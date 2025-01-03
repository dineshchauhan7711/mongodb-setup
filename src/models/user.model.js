const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { assets: { getFileURL } } = require('../helpers')

const userSchema = new mongoose.Schema({
     first_name: {
          type: String,
          required: true,
          maxlength: 50,
     },
     last_name: {
          type: String,
          required: true,
          maxlength: 50,
     },
     email: {
          type: String,
          required: true,
          unique: true,
          maxlength: 50,
          set: value => value.toLowerCase()
     },
     password: {
          type: String,
          required: true,
          set: value => bcrypt.hashSync(value, 10)
     },
     profile_image: {
          type: String,
          required: false,
          default: null,
          get: value => {
               if (value) {
                    return getFileURL('profile_images', value)
               };
               return null
          }
     },
     role: {
          type: String,
          required: false,
          default: 'user',
          enum: ['user', 'admin']
     },
     forgot_password_token: {
          type: String,
          required: false,
          default: null
     },
     is_deleted: {
          type: Boolean,
          required: true,
          default: false
     }
},
     {
          timestamps: {
               createdAt: 'created_at',
               updatedAt: 'updated_at'
          },
          toJSON: {
               getters: true,
               setters: true
          },
          toObject: {
               getters: true,
               setters: true
          },
     }

);

userSchema.static('validatePassword', (password, hashPassword) => {
     return bcrypt.compareSync(password, hashPassword);
});

const user = mongoose.model('users', userSchema);
module.exports = user;