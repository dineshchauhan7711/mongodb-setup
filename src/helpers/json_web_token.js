const jwt = require("jsonwebtoken");
const config = require("../config/config.js");


/**
 * Create JWT token
 */
const createJWT = async (object) => {
  try {
    const token = jwt.sign(
      object.data,
      config.jwt.secret,
      {
        ...(object.expiry_time) && { expiresIn: object.expiry_time },
      },
    );
    return {
      success: true,
      token: token
    };
  } catch (error) {
    // console.log("Error :==>> ", error);
    return {
      success: false,
      message: error.name || "Error while creating token."
    };
  }

};

/**
 * Verify JWT token 
 */
const verifyJWT = async (token) => {
  try {
    const decodedToken = jwt.verify(token, config.jwt.secret);
    return {
      success: true,
      data: decodedToken
    };
  } catch (error) {
    // console.log("Error :==>> ", error);
    return {
      success: false,
      message: error.name || "Error while verifying token."
    };
  }
};


module.exports = {
  createJWT,
  verifyJWT
};
