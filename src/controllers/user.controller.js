// Modules
const fs = require('fs');
const path = require('path');

// Config
const {
     jwt: { forgot_link_expiry_time },
     frontend_base_url,
     email_service: { support_center_email }
} = require('../config/config');

// Helpers/Files
const {
     validator,
     response,
     jsonWebToken: { createJWT, verifyJWT },
     emailService: { mailService },
     files: { uploadFile, deleteFile, profileImageValidation }
} = require('../helpers');

// Models
const {
     User,
     UserSession
} = require('../models');



/**
 * SignUp User
 */
const signup = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               first_name: 'required|string|min:3|max:50',
               last_name: 'required|string|min:3|max:50',
               email: 'required|email|string|lowercase',
               password: 'required|string|min:8|max:30',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const { first_name, last_name, email, password } = req.body;

          // Check email already exists
          const checkEmail = await User.findOne({ email });

          // Check if user is deleted
          if (checkEmail && checkEmail.is_deleted) {
               return response.error(res, 1018, 409);
          };

          // Check if email already exists
          if (checkEmail) {
               return response.error(res, 1004, 409);
          };

          // Create new user
          await User.create({
               first_name,
               last_name,
               email,
               password
          });


          return response.success(res, 1001, null, 201);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Login
 */
const login = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               email: 'required|email|string|lowercase',
               password: 'required|string',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const { email, password } = req.body;

          // Check user exists
          const user = await User.findOne({ email }, '_id email first_name last_name password is_deleted submission_date current_submission authorized');
          if (!user) {
               return response.error(res, 1005);
          };

          // Check if user is deleted
          if (user.is_deleted) {
               return response.error(res, 1018, 409);
          };

          // Check password
          if (!await User.validatePassword(password, user.password)) {
               return response.error(res, 1005);
          };

          // Create session
          const token = await UserSession.createSessionToken(user._id);

          const responseData = {
               _id: user._id,
               first_name: user.first_name,
               last_name: user.last_name,
               email: user.email,
               token
          };
          return response.success(res, 1002, responseData);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Get profile  
 */
const getProfile = async (req, res) => {
     try {
          const { _id } = req.user;
          const user = await User.findOne({ _id }, '_id first_name last_name email profile_image role');
          return response.success(res, 1003, user);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Logout
 */
const logout = async (req, res) => {
     try {
          const headerToken = req.headers.authorization;
          await UserSession.deleteOne({ token: headerToken });
          return response.success(res, 1006);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Send forgot password email
 */
const sendForgotPasswordEmail = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               email: 'required|email|string',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const { email } = req.body;

          // Check user exists
          const user = await User.findOne({ email }, '_id first_name last_name email is_deleted');
          if (!user) {
               return response.error(res, 1007);
          };

          // Check if user is deleted
          if (user.is_deleted) {
               return response.error(res, 1018, 409);
          };

          // Create forgot password link
          const tokenRes = await createJWT({ data: { user_id: user._id }, expiry_time: forgot_link_expiry_time });
          if (!tokenRes.success) {
               return response.error(res, 1020);
          };

          // Save forgot password link
          await User.updateOne(
               { _id: user._id },
               {
                    $set: {
                         forgot_password_token: tokenRes.token
                    }
               });

          // Read email template
          let template = fs.readFileSync(
               './src/helpers/email_service/email_formats/forgot_password.html',
               'utf-8'
          );
          // Replace placeholders with dynamic values
          template = template.replace('${name}', `${user.first_name} ${user.last_name}`);
          template = template.replace('${link}', `${frontend_base_url}/forgot-password?token=${tokenRes.token}`);
          template = template.replace('${support_center_email}', support_center_email);


          // Send OTP
          const mailResponse = await mailService(
               email,
               'Forgot Password OTP',
               template
          );
          if (!mailResponse.success) {
               return response.error(res, 1011);
          };

          return response.success(res, 1012);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Verify forgot password OTP
 */
const verifyForgotPasswordLink = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               token: 'required|string',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const { token } = req.body;

          // Verify forgot password token
          const verifyResponse = await verifyJWT(token);
          if (!verifyResponse.success) {
               return response.error(res, 1014);
          };

          // Check user exists
          const user = await User.findOne({ _id: verifyResponse.data.user_id }, '_id email is_deleted forgot_password_token');
          if (!user) {
               return response.error(res, 1014);
          };

          // Check if user is deleted
          if (user.is_deleted) {
               return response.error(res, 1018, 409);
          };

          // Check if forgot password token is expired
          if (user.forgot_password_token !== token) {
               return response.error(res, 1014);
          };


          return response.success(res, 1015);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Forgot password
 */
const forgotPassword = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               token: 'required|string',
               password: 'required|string|min:8|max:30',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const { token, password } = req.body;

          // Verify forgot password token
          const verifyResponse = await verifyJWT(token);
          if (!verifyResponse.success) {
               return response.error(res, 1014);
          };

          // Check user exists
          const user = await User.findOne({ _id: verifyResponse.data.user_id }, '_id email is_deleted forgot_password_token');
          if (!user) {
               return response.error(res, 1014);
          };

          // Check if user is deleted
          if (user.is_deleted) {
               return response.error(res, 1018, 409);
          };

          // Check if forgot password token is expired
          if (user.forgot_password_token !== token) {
               return response.error(res, 1014);
          };

          // Update password
          await User.updateOne(
               { _id: user._id },
               {
                    $set: {
                         password,
                         forgot_password_token: null,
                    }
               }
          );

          // Delete all sessions
          await UserSession.deleteMany({ user_id: user._id });

          return response.success(res, 1016);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};

/**
 * Update profile
 */
const updateProfile = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               first_name: 'string|min:3|max:50',
               last_name: 'string|min:3|max:50',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 400);
          };
          const {
               user: { _id },
               body: { first_name, last_name },
               files: file
          } = req;

          // Find user
          const user = await User.findOne({ _id }, '_id first_name last_name profile_image');
          if (!user) {
               return response.error(res, 1007, 404);
          };

          let updateObj = {
               first_name,
               last_name,
          };

          if (file.length > 0) {
               // Validate file
               const validateRes = await profileImageValidation(file);
               if (!validateRes.success) {
                    return response.error(res, validateRes.message, 400);
               };

               // Upload file
               const uploadRes = await uploadFile(file[0], "profileImages");
               if (!uploadRes.success) {
                    return response.error(res, 1021, 400);
               };

               updateObj.profile_image = uploadRes.fileName;
          };


          // Update user
          await User.updateOne(
               { _id },
               {
                    $set: updateObj
               },
          );

          // Delete Old Profile Image
          if (user.profile_image) {
               await deleteFile(path.basename(user.profile_image), "profileImages");
          };

          return response.success(res, 1019);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};


module.exports = {
     signup,
     login,
     getProfile,
     logout,
     sendForgotPasswordEmail,
     verifyForgotPasswordLink,
     forgotPassword,
     updateProfile
};