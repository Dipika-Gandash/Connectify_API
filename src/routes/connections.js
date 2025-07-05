
const express = require('express');
const connectionRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../modals/connectionReq');
const User = require('../modals/userSchema');

connectionRouter.get('/user/connections', userAuth, async (req, res) => {
     try{
          const loggedInUser = req.user;
          const userId = loggedInUser._id;

          const connections = await ConnectionRequest.find({
               $or : [
                    {fromUserId: userId, status: 'accepted'},
                    {toUserId: userId, status: 'accepted'}
               ]
          })

          if(connections.length === 0){
               return res.status(404).send('No connections found');
          }

          return res.status(200).json({
               message: 'Connections retrieved successfully',
               data: connections
          })
          

     }catch(error){
          return res.status(500).send('Internal Server Error');
     }
})


module.exports = connectionRouter;