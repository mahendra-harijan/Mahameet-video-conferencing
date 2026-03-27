# 🚀 Mahameet – Video Calling Web Application

A full-stack **video conferencing web application** (inspired by Zoom/Google Meet) that enables users to connect via **real-time video calls, chat, and meeting history tracking**.

---

## ✨ Features

* 🔐 **User Authentication**

  * Register & Login system
  * Secure password hashing using bcrypt

* 🎥 **Video Conferencing**

  * 1:1 and Group video calls
  * Built using WebRTC APIs

* 💬 **Real-Time Communication**

  * Instant chat during meetings
  * Powered by Socket.IO

* 🧠 **Meeting History**

  * Stores past meetings in MongoDB
  * Easy retrieval of activity

* 🌐 **Room-Based Meetings**

  * Unique meeting URLs
  * Join via shared link

---

## 🛠️ Tech Stack

### Frontend

* React (Create React App)
* React Router
* Material UI (MUI)
* Axios
* Socket.IO Client
* WebRTC APIs (`RTCPeerConnection`, `getUserMedia`, `getDisplayMedia`)

### Backend

* Node.js + Express (ES Modules)
* Socket.IO (Signaling + Chat)
* MongoDB + Mongoose
* Authentication:

  * bcrypt (Password Hashing)
  * crypto (Token Generation)
* dotenv (Environment Variables)

---

## 📁 Project Structure

```
Mahameet/
│
├── backend/        # Express API + Socket.IO server
├── frontend/       # React application
└── README.md
```

---

## ⚙️ How It Works

### 🔹 1. REST API (Authentication + History)

Base Route:

```
/api/v1/users
```

Endpoints:

* `POST /register` → Register a new user
* `POST /login` → Login and receive auth token
* `POST /add_to_activity` → Save meeting history
* `GET /get_all_activity?token=...` → Fetch user meeting history

📌 The frontend stores:

* `token`
* `user data`
  in **localStorage**

---

### 🔹 2. Real-Time Video Calls

#### Flow:

1. User joins a meeting room using a URL:

   ```
   /:meetingId
   ```

2. Socket.IO handles:

   * Room joining/leaving
   * Signaling (SDP offers/answers)
   * ICE candidate exchange
   * Real-time chat

3. WebRTC handles:

   * Audio/Video streaming
   * Peer-to-peer connection

---

## 📋 Prerequisites

* Node.js (LTS recommended)
* npm
* MongoDB (Local or Atlas)

---

## 🔐 Environment Variables

Create a file:

```
backend/.env
```

### Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mahameet
PORT=8000
```

### Notes:

* `.env` is used only in **development**
* In production, use **real environment variables**

---

## ▶️ Running the Project (Development)

### 1️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:8000
```

---

### 2️⃣ Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧪 Usage Guide

1. Open:

   ```
   http://localhost:3000
   ```
2. Register a new account
3. Login
4. Create or Join a meeting
5. Share meeting URL with others

---

### 💡 Pro Tip

Add your name in the URL:

```
http://localhost:3000/<meetingId>?name=YourName
```

---

## 🚀 Production Deployment

### Backend

```bash
npm start
```

### Frontend

```bash
npm run build
```

Output:

```
frontend/build/
```

---

### ⚠️ Important

* Update API base URL in:

  ```
  frontend/src/environment.js
  ```
* Use:

  * HTTPS
  * MongoDB Atlas
  * Environment variables (no `.env` in production)

---

## 📌 Future Improvements

* Screen recording 🎬
* Meeting scheduling 📅
* JWT-based authentication 🔐
* Participant controls (mute/remove) 🎛️
* UI/UX enhancements 🎨

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make changes
4. Submit a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💡 Author

Developed by **Mahendra Harijan**

---

⭐ If you like this project, don't forget to **star the repository**!
