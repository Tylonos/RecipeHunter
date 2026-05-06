import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { applyTheme, getEffectiveTheme, getStoredTheme, setStoredTheme } from '../utils/theme';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [storedTheme, setStoredThemeState] = useState(null);
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const initial = getStoredTheme();
    setStoredThemeState(initial);
    applyTheme(initial);
  }, []);

  const handleThemeToggle = () => {
    const effective = getEffectiveTheme(storedTheme);
    const next = effective === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    setStoredThemeState(next);
    applyTheme(next);
  };

  const cycleLanguage = () => {
    const order = ["en", "ro", "ua"];
    const current = i18n.language;
    const next = order[(order.indexOf(current) + 1) % order.length];
    i18n.changeLanguage(next);
    localStorage.setItem("language", next);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {!user && !isAuthPage && (
          <Link to="/login" className="small-btn">{t("login")}</Link>
        )}

        <Link to="/recipes" className="small-btn">{t("home")}</Link>

        {!isAuthPage && (
          <Link to="/add-recipe" className="small-btn add-link">{t("addRecipe")}</Link>
        )}
      </div>

      <div className="topbar-center">
        <h1 className="main-title">
          <Link to="/" className="brand-link">
            RECIPE HUNTER
          </Link>
        </h1>
      </div>

      <div className="topbar-right">
        <button className="small-btn" onClick={cycleLanguage}>
          {t("language")}
        </button>

        <button className="small-btn" type="button" onClick={handleThemeToggle}>
          {t("themeToggle")}
        </button>

        {user && (
          <div className="nav-profile-section" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <img 
              src={user.profilePicture || DEFAULT_AVATAR} 
              alt="Profile" 
              className="nav-avatar"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <span className="nav-username">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
