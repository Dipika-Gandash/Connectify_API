const jwt = require("jsonwebtoken");
const User = require("../modals/userSchema");
require("dotenv").config();

const userAuth = async (req, res, next) => {
     const token = req.cookies.token;
     if(!token){
          return res.status(401).send("Unauthorized! Please login first!")
     }

     try{
          const decodedMessage = await jwt.verify(token , process.env.JWT_SECRET_KEY);
          const user = await User.findById(decodedMessage._id);
          if(!user){
               return re.status(404).send("User not found");
          }
          req.user = user;
          next();
     

     } catch(error){
          return res.status(500).send("Error fetching user : " + error.message);
     }
}

module.exports = { userAuth };