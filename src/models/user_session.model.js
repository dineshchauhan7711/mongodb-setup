const mongoose = require('mongoose');
const { createJWT } = require('../helpers/json_web_token');
const { jwt: { session_token_expiry_time } } = require('../config/config');

const userSessionSchema = new mongoose.Schema({
     user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "users"
     },
     token: {
          type: String,
          required: true,
     }
}, {
     versionKey: false
});

userSessionSchema.static('createToken', async function (user_id) {
     const tokenData = await createJWT({ data: { user_id }, expiry_time: session_token_expiry_time });
     await this.create({ user_id, token: tokenData.token });
     return tokenData.token;
});


const userSession = mongoose.model('user_sessions', userSessionSchema);
module.exports = userSession; 