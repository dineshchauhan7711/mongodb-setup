const mongoose = require('mongoose');

const socketIdsSchema = new mongoose.Schema({
     user_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "users"
     },
     socket_id: {
          type: String,
          required: true,
     }
}, {
     timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at'
     }
});


const socketIds = mongoose.model('socket_ids', socketIdsSchema);
module.exports = socketIds; 