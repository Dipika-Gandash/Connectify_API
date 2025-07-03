

const validateEditProfileData = (req) => {
          
          const ALLOWED_FIELDS = ["firstName", "lastName", "email", "bio", "photoUrl", "age", "skills"];

          const isValidField = Object.keys(req.body).every((field) => ALLOWED_FIELDS.includes(field));

         return isValidField;
          
     
}

module.exports = {validateEditProfileData};