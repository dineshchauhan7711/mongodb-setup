// Helpers/Files
const validator = require('../helpers/validator');
const response = require('../helpers/response');

// Models
const db = require('../models');
const User = db.user;
const UserSession = db.userSession;



/**
 * SignUp User
 */
const signup = async (req, res) => {
     try {
          const validation = new validator(req.body, {
               first_name: 'required|string|min:3|max:50',
               last_name: 'required|string|min:3|max:50',
               email: 'required|email|string',
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
          const userData = await User.create({
               first_name,
               last_name,
               email,
               password
          });

          // Create session
          const token = await UserSession.createToken(userData._id);

          const responseData = {
               _id: userData._id,
               first_name: userData.first_name,
               last_name: userData.last_name,
               email: userData.email,
               current_submission: userData.current_submission,
               submission_date: userData.submission_date,
               authorized: userData.authorized,
               token
          };
          return response.success(res, 1001, responseData, 201);
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
               email: 'required|email|string',
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
          const token = await UserSession.createToken(user._id);

          const responseData = {
               _id: user._id,
               first_name: user.first_name,
               last_name: user.last_name,
               email: user.email,
               current_submission: user.current_submission,
               submission_date: user.submission_date,
               authorized: user.authorized,
               token
          };
          return response.success(res, 1002, responseData);
     } catch (error) {
          console.log('error', error);
          return response.error(res, 9999);
     }
};



module.exports = {
     signup,
     login
};