const mongoose = require('mongoose');
const { jsonWebToken: { createJWT } } = require('../helpers');
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
     timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at'
     }
});

userSessionSchema.static('createSessionToken', async function (user_id) {
     const tokenData = await createJWT({ data: { user_id }, expiry_time: session_token_expiry_time });
     await this.create({ user_id, token: tokenData.token });
     return tokenData.token;
});


const userSession = mongoose.model('user_sessions', userSessionSchema);
module.exports = userSession; 