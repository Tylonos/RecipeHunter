import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import api from '../api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/users/login", { email, password });
    
    login(res.data.user);
    localStorage.setItem('token', res.data.token);
    navigate('/recipes');
  } catch (err) {
    setError(err.response?.data?.message || "Invalid Email or Password");
  }
};

  return (
    <div className="auth-page">
      <Navbar />
      <div className="add-form-wrapper">
        <form className="add-form auth-form" onSubmit={handleLogin}>
          <h2 style={{ color: 'var(--text-h)' }}>{t("login")}</h2>
          {error && <div className="auth-error">{error}</div>}
          
          <label>{t("email")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label>{t("password")}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" className="small-btn">{t("signIn")}</button>
          <p style={{ marginTop: '15px', color: 'var(--muted)' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
