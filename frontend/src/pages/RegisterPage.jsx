import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import { api } from '../api';
import Footer from '../components/Footer';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', profilePicture: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 5MB.");
        e.target.value = null; 
        return;
    }

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => setFormData({ ...formData, profilePicture: reader.result });
    }
  };

  const validate = () => {
    if (formData.username.length < 3 || formData.username.length > 15) return "Username must be between 3-15 characters.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailRegex.test(formData.email)) {
      return "Registration is only allowed for @gmail.com or @yahoo.com addresses.";
    }
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(formData.password)) return "Password is too weak.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vError = validate();
    if (vError) return setError(vError);

    try {
      const res = await api.post('/users/register', formData);
      alert("Registration successful!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="add-form-wrapper">
        <form className="add-form auth-form" onSubmit={handleSubmit}>
          <h2>{t("createAccount")}</h2>
          {error && <div className="auth-error">{error}</div>}
          
          <label>{t("username")}</label>
          <span className="input-hint">3-15 characters, no spaces allowed.</span>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            required 
          />
          
          <label>{t("email")}</label>
          <span className="input-hint">Use @gmail.com or @yahoo.com.</span>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
          
          <label>{t("password")}</label>
          <span className="input-hint">Min. 8 characters, letters and numbers.</span>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />

          <label>{t("profilePicture")}</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />

          <button type="submit" className="small-btn">{t("register")}</button>
          <p className="auth-footer">
            {t("allreadyHaveAnAccount")} <Link to="/login">{t("login")}</Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
export default RegisterPage;