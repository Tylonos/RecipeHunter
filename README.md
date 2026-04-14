# 🍲 Recipe Hunter

## 📝 Project Description
Recipe Hunter is a full-stack web application designed to help users discover, create, and manage their favorite recipes. The platform features a robust authentication system, a detailed user profile management suite, and an interactive recipe "Pantry" for filtering dishes based on available ingredients.

## 👥 Team Members
* **Radu Lupu** - Full-Stack Developer (not yet)
  * Developed the User Authentication system (Register/Login).
  * Implemented Base64 Image Processing for local profile picture uploads.
  * Built the Dynamic Profile Page with real-time editing and database synchronization.
  * Optimized Backend API to handle large data payloads (10MB limit).
  * Standardized the Global UI/UX (Navbar, consistent form styling, and dark/light modes).

## 🛠️ Radu's Technical Contributions

### 🔐 Secure Authentication & Security
* Built a custom **JWT (JSON Web Token)** authentication flow.
* Implemented password hashing using **Bcrypt.js** to ensure user data security.
* Added frontend validation using **Regex** for strong password requirements and username constraints.

### 🖼️ Profile & Image Management
* Replaced URL-based profile pictures with a **File Upload** system.
* Developed a **Base64 conversion** utility to store images directly in MongoDB Atlas without external hosting.
* Created an **Edit Mode** for profiles allowing users to update occupation, cooking experience, and appliances.

### ⚙️ Backend Optimization
* Configured **Express.js** body-parsers to handle high-volume data (413 Payload fix).
* Developed RESTful API endpoints for user updates and recipe management.
* Structured **Mongoose Models** to support complex user metadata and dietary filters.

## 🌐 References & Resources
* [React Documentation](https://react.dev/) - For building the component-based UI.
* [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/) - For cloud database configuration.
* [MDN Web Docs: FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) - For handling the local profile picture uploads.
* [JWT.io](https://jwt.io/introduction) - For understanding secure token-based authentication.
* [Axios Cheat Sheet](https://axios-http.com/docs/intro) - For managing API requests between Frontend and Backend.