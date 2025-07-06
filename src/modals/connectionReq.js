const mongoose = require('mongoose');

const connectionReqSchema = new mongoose.Schema({
     fromUserId : {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'user'
     },

     toUserId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'user'

     },

     status: {
          type: String,
          required: true,
          enum : {
               values : ['pending', 'accepted', 'rejected', 'ignored'],
               message: `{VALUE} is not a valid status`
          }
     }
}, {timestamps: true});

connectionReqSchema.index({ fromUserId: 1, toUserId: 1})

const connectionReqModel = new mongoose.model('ConnectionRequest', connectionReqSchema);

module.exports = connectionReqModel;