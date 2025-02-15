# 🛡️ Hack-Corruption Backend - Anonymous Corruption Reporting API

## 📌 Project Overview
**Hack-Corruption Backend** is the server-side API for the **Hack-Corruption** platform. Built using the **MERN stack**, it provides secure endpoints for anonymous corruption reporting, AI-powered analysis, and administrative controls. The backend ensures data integrity, authentication, and seamless integration with the frontend.

## 🛠️ Technologies Used
- **Framework**: Express.js
- **Database**: MongoDB (Local for development, MongoDB Atlas for production)
- **ODM**: Mongoose
- **Authentication**: Firebase & JWT-based authentication
- **AI Integration**: Google Generative AI for image analysis & spam detection

## 📦 Dependencies

![Backend Dependencies](./public/images/backend-dependencies.jpg)

The backend uses the following dependencies:

```json
"dependencies": {
  "@google/generative-ai": "^0.21.0",
  "axios": "^1.7.9",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "form-data": "^4.0.1",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.13.0",
  "mongoose": "^8.10.0",
  "multer": "^1.4.5-lts.1",
  "nodemon": "^3.1.9",
  "sharp": "^0.33.5"
}
```

## 🛠 Installation and Setup (Local Development)

### 📍 Prerequisites
- **Node.js**
- **MongoDB** (Local or MongoDB Atlas)

### 📂 Backend Setup
```bash
git clone <backend-repo-link>
cd backend
npm install
```

#### Set up environment variables in `.env` file:
```env
PORT=8080
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FIREBASE_CONFIG=<your-firebase-config>
AI_API_KEY=<your-google-ai-api-key>
```

#### Run the development server:
```bash
npm run dev
```

## 🚀 API Features
- **User Authentication**: Secure login and registration with JWT.
- **Anonymous Report Submission**: Users can submit corruption reports without revealing their identity.
- **AI-Powered Analysis**: AI generates descriptions and detects spam in uploaded images.
- **Admin Management**: Admins can ban/unban users and manage reports.

## 📢 Future Enhancements
- **Advanced AI filtering for enhanced spam detection**.
- **Integration with blockchain for immutable report storage**.
- **Detailed analytics dashboard for admins**.

## 🤝 Contribution
We welcome contributions! Feel free to **fork** the repository and submit a **pull request**. If you have any suggestions, open an **issue** to discuss new features.

---

🚀 **Empowering users to report corruption safely and anonymously!**

