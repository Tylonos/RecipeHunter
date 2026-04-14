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

* **Ivan Novik** - Project Manager (almost)
  * set up the project.
  * Created intial recipe list and recipe details pages.
  * Created and set up the database.
  * Implemented ingredient normalization and pantry-driven recipe filtering.
   (AI was used to make the script which extracts ingredients from the new recipes)
  * Improved recipe card layout and recipe detail page UX.
  * Added backend helpers for consistent ingredient storage and cleanup.
  * Added addition/editing of the recipies on the site.

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


## 🛠️ Ivan's Technical Contributions

### 🧺 Pantry & Ingredient Normalization
* Replaced placeholder ingredient list with real ingredients derived from recipe data.
* Added ingredient normalization (capitalization, basic singularization, bracket removal, and splitting simple "x or y" entries).
* Improved ingredient selection so similar entries merge under the same counter (e.g. "Tomatoes" → "Tomato").

### 🧩 Recipe Filtering & UX Improvements
* Added a recipe filter option to match recipes by the user's added pantry ingredients.
* Refined pantry matching so recipes are not excluded when extra ingredients are added beyond what the recipe needs.
* Removed the Edit button from recipe cards to keep editing actions on the recipe detail page.

### 🖼️ UI Layout & Recipe Detail Enhancements
* Adjusted recipe card sizing so images fit better and descriptions have more vertical space.
* Improved the Add Recipe form layout so the Diet and Image URL fields stack correctly.
* Added a 3-step instructions box layout on the recipe detail page (placeholder content for now).

### ⚙️ Backend Data Hygiene Helpers
* Normalized incoming recipe ingredients on create/update to keep stored data consistent.
* Added a script to normalize existing recipes in MongoDB (dry-run supported).

### 🛠️ Added addition/editing of the recipies on the site.
* Wrote backend/frontend to add and edit recipies from the site itself.

## 🌐 References & Resources
* [React Vite Testing Tutorial For Beginners - Vitest Testing Crash Course](https://www.youtube.com/watch?v=CxSL0knFxAs) - For building and bundling the React frontend.
* [React Documentation](https://react.dev/) - This one speaks for itself.
* [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/) - For understanding how to create DB and set it up inside IDE across all the members.
* [Mongoose Documentation](https://mongoosejs.com/docs/guide.html) - For schema design and MongoDB data modeling in the backend.
* [React Router - Complete Tutorial](https://www.youtube.com/watch?v=oTIJunBa6MA) - For client-side routing between recipe pages.
