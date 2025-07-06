
const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../modals/connectionReq');
const User = require('../modals/userSchema');

const USER_DATA = ['firstName', 'lastName', 'bio'];

connectionRouter.get('/user/pendingReq', userAuth, async (req, res) => {
     const loggedInUser = req.user;
     try{
          const connectionRequests = await ConnectionRequest.find({
               toUserId: loggedInUser._id,
               status: 'pending'
          }).populate('fromUserId', USER_DATA);

          if(connectionRequests.length === 0){
               return res.send('No pending connection requests')
          }

          const data = connectionRequests.map((row) => {
               return row.fromUserId;
          })

          res.status(200).json({
               message: 'Pending connection requests retrieved successfully',
               data: data
          })

     }catch(error){
          return res.status(500).send(error.message);
     }
})

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


connectionRouter.get('/user/feed', userAuth, async (req, res) => {
     const loggedInUser = req.user;
     const page = req.query.page || 1;
     const limit = req.query.limit || 5;
     const skip = (page - 1) * limit;

     try{
          const connections = await ConnectionRequest.find({
               $or : [
                    {fromUserId: loggedInUser._id},
                    {toUserId: loggedInUser._id}
               ]
          })

          const hideUserFromFeed = new Set();
          connections.forEach((row) => {
               hideUserFromFeed.add(row.fromUserId.toString());
               hideUserFromFeed.add(row.toUserId.toString());
          })

          const users = await User.find({
               $and : [
                    {_id: {$nin: Array.from(hideUserFromFeed)}},
                    {_id: {$ne: loggedInUser._id}}
               ]
          }).select(USER_DATA).skip(skip).limit(limit);

          return res.status(200).json({
               message: 'Feed retrieved successfully',
               data: users
          })

     }catch(error){
          return res.status(500).send(error.message);
     }
})



module.exports = connectionRouter;