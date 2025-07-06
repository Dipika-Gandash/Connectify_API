
const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../modals/connectionReq');
const User = require('../modals/userSchema');

const USER_DATA = ['firstName', 'lastName', 'photoUrl', 'bio'];

connectionRouter.get('/user/connections', userAuth, async (req, res) => {
     try{
          const loggedInUser = req.user;
          const userId = loggedInUser._id;

          const connections = await ConnectionRequest.find({
               $or : [
                    {fromUserId: userId, status: 'accepted'},
                    {toUserId: userId, status: 'accepted'}
               ]
          }).populate('fromUserId toUserId', USER_DATA)

          if(connections.length === 0){
               return res.status(404).send('No connections found');
          }

          const data = connections.map((row) => {
               if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId;
               }
               return row.fromUserId;
          })

          return res.status(200).json({
               message: 'Connections retrieved successfully',
               data: data
          })
          

     }catch(error){
          return res.status(500).send(error.message);
     }
})


module.exports = connectionRouter;