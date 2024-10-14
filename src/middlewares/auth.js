// Files/Helpers
const validator = require('../helpers/validator');
const response = require('../helpers/response');
const { verifyJWT } = require('../helpers/json_web_token');

// Models
const User = require('../models/user.model');
const UserSession = require('../models/user_session.model');


/**
 * Authentication Middleware
 */
const userAuth = async function (req, res, next) {
     try {
          let validation = new validator(req.headers, {
               authorization: 'required|string',
          }, {
               'required.authorization': 'Unauthorized Users.',
               'string.authorization': 'Unauthorized Users.',
          });
          if (validation.fails()) {
               const firstMessage = Object.keys(validation.errors.all())[0];
               return response.error(res, validation.errors.first(firstMessage), 401);
          };

          const headerToken = req.headers.authorization;

          // Verify JWT token
          const verifyToken = await verifyJWT(headerToken);
          if (!verifyToken.success) {
               return response.error(res, 1010, 401);
          };

          const isAuth = await UserSession.findOne({ token: headerToken });
          if (isAuth != null) {
               let userData = await User.findOne({
                    _id: isAuth.user_id
               }, '_id');
               if (!userData) {
                    return response.error(res, 1010, 401);
               };

               // Check if user is deleted
               if (userData.is_deleted) {
                    return response.error(res, 1018, 401);
               };

               req.user = userData.toJSON()
               next()
          } else {
               return response.error(res, 1010, 401);
          }
     } catch (error) {
          console.log('Error in auth middleware :>> ', error);
          return response.error(res, 9999);
     }
};


module.exports = {
     userAuth
};
