
Saraha-Inspired Anonymous Messaging App
A secure and scalable backend API for anonymous messaging, built with Node.js and MongoDB.

🚀 Features
User Signup (Email + Google OAuth)

OTP-based Email Verification with HTML templates via Nodemailer

JWT Authentication with refresh tokens

Data Validation using Joi

Environment Variables secured with dotenv

RESTful API with error handling

Clean MVC Architecture with modular folder structure

🛠 Tech Stack
Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT, Google OAuth, bcryptjs

Email Service: Nodemailer

⚙️ Tools Used
VS Code | Postman | MongoDB Compass | MongoDB Atlas


📂 Project Structure
تحرير
src  
│  
├── db  
│   ├── connection.js  
│   └── models  
│       ├── message.model.js  
│       └── user.model.js  
│  
├── middlewares  
│   ├── auth.middleware.js  
│   ├── authorization.middleware.js  
│   └── validation.middleware.js  
│  
├── modules  
│   ├── auth  
│   │   ├── auth.controller.js  
│   │   ├── auth.service.js  
│   │   └── auth.validation.js  
│   │  
│   ├── message  
│   │   ├── message.controller.js  
│   │   ├── message.endpoint.js  
│   │   ├── message.service.js  
│   │   └── message.validation.js  
│   │  
│   └── user  
│   |   ├── user.controller         
|   |   └── user.service.js  
│  
├── utils  
│   ├── crypto/  
│   ├── email/  
│   ├── error/  
│   ├── hash/  
│   ├── messages/  
│   ├── token/  
│   └── index.js  
│  
└── app.controller.js
نسخ
تحرير

📌 Installation & Setup
# Clone the repository
git clone https://github.com/MaRrAaMm/Social-App.git

# Install dependencies
npm install

# Create a .env file and add your environment variables

# Run in development mode
npm run dev

# Run in production mode
npm start
