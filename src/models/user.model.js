const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
     is_deleted: {
          type: Boolean,
          required: true,
          default: false
     }
},
     {
          toJSON: {
               getters: true,
               setters: true
          },
          toObject: {
               getters: true,
               setters: true
          },
          versionKey: false
     }

);

userSchema.static('validatePassword', (password, hashPassword) => {
     return bcrypt.compareSync(password, hashPassword);
});

const user = mongoose.model('users', userSchema);
module.exports = user;