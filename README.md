## 🔗 Connectify API
A mini social networking backend built with Node.js, Express, MongoDB, and JWT Auth.
Features include user authentication, sending/accepting connection requests, managing profiles, and a personalized user feed with pagination.

# 🧠 Features
👤 User Signup & Login (JWT + Cookies)

🛡️ Protected routes with middleware

🔄 Send/Accept/Reject Connection Requests

🧑‍🤝‍🧑 View list of accepted connections

📡 User Feed showing non-connected users (with pagination)

✏️ Edit user profile and update password securely

🧪 Validations using validator & custom Mongoose validations


# ⚙️ Tech Stack
Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Auth: JWT (stored in HTTP-only cookies)

Validation: validator, bcrypt

Environment: dotenv


# 📂 Project Structure
├── config/
│   └── database.js
├── modals/
│   ├── userSchema.js
│   └── connectionReq.js
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── request.js
│   └── connections.js
├── middlewares/
│   └── auth.js
├── utils/
│   └── validation.js
├── .env
├── app.js
└── README.md


# 🔐 Environment Setup
Create a .env file in the root directory:
     PORT=3000
     MONGODB_URL=your_mongodb_connection_string
     JWT_SECRET_KEY=your_jwt_secret

#▶️ Getting Started
# 1. Clone the repository
git clone https://github.com/Dipika-Gandash/Connectify_API
cd Connectify_API

# 2. Install dependencies
npm install

# 3. Start the server
npm start
Server will start on: http://localhost:3000


# ✅ Validations & Security
Passwords are hashed using bcrypt

Strong password rules enforced (min 8 chars, 1 upper, 1 lower, 1 symbol, 1 number)

Token is verified in userAuth middleware before protected routes

Input data is validated using validator.js and Mongoose rules

Users can't send duplicate or self-requests


