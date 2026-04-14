# 🍲 Recipe Hunter <small>— (Press Ctrl + Shift + V to Preview)</small>

## 📝 Project Description
Recipe Hunter is a full-stack web application designed to help users discover, create, and manage their favorite recipes. The platform features a robust authentication system, a detailed user profile management suite, and an interactive recipe "Pantry" for filtering dishes based on available ingredients.

## 👥 Team Members
* **Radu Lupu** - Full-Stack Developer (not yet)
  * Developed the User Authentication system (Register/Login).
  * Implemented Base64 Image Processing for local profile picture uploads.
  * Built the Dynamic Profile Page with real-time editing and database synchronization.
  * Optimized Backend API to handle large data payloads (10MB limit).
  * Standardized the Global UI/UX (Navbar, consistent form styling, and dark/light modes).

* **Serianu Andrei-Silviu** - Full-Stack Developer (not yet)
  * Gathered recipes from Romania, Ukraine to promote the cultural diversity of Ireland. There are also some international recepies.
  * Worked with the Database, implementing all the recipes with ingredients, time to cook, type of food and with images.
  * Created a Home Page, from where the used can use the navbar, select a randome dish from our collection, or choose todays specilaty : Mamaliga (polenta)
  * Reworked the NavBar to accomplish a better and more accesible "flow" between pages for the user.
  * Some minor bug fixes in the code as a whole.


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

## 🛠️ Silviu's Technical Contributions

### ⚙️ Worked with the DataBase
* I had a lot of pain in accesing the Database, as using it on windows seems very chaotic, i had to change my DNS to somehow make it work.
* All the recipes are implemented in the Database

### 🖥️ Front End
* Developed the Homepage and reworked the NavBar
* Added new functions to the Homepage: Randome Recipe and Todays Dish
* Small Bug Fixes

## 🌐 References & Resources
* [React Documentation](https://react.dev/) - For building the component-based UI.
* [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/) - For cloud database configuration.
* [MDN Web Docs: FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) - For handling the local profile picture uploads.
* [JWT.io](https://jwt.io/introduction) - For understanding secure token-based authentication.
* [Axios Cheat Sheet](https://axios-http.com/docs/intro) - For managing API requests between Frontend and Backend.
* [MongoDB II](https://ocw.cs.pub.ro/courses/bdd/laboratoare/12) - For learning about MongoDB
* [TechBit](https://teachbit.ro/blog/tutorial-javascript-pentru-incepatori/) - For refreshing what we learned about JavaScript