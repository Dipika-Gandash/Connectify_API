const mongoose = require('mongoose');

const connectionReqSchema = new mongoose.Schema({
     fromUserId : {
          type: mongoose.Schema.Types.ObjectId,
          required: true
     },

     toUserId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true

     },

     status: {
          type: String,
          required: true,
          enum : {
               values : ['pending', 'accepted', 'rejected', 'ignored', 'withdrawn'],
               message: `{VALUE} is not a valid status`
          }
     }
}, {timestamps: true});


const connectionReqModel = new mongoose.model('ConnectionRequest', connectionReqSchema);

module.exports = connectionReqModel;