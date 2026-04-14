import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
// NEW IMPORTS:
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" />} />
        <Route path="/recipes" element={<RecipeListPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
        
        {/* ADD THESE NEW ROUTES: */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;