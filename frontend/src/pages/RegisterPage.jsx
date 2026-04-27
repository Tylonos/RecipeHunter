import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";


function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', profilePicture: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    
    if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 5MB.");
        e.target.value = null; 
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setFormData({ ...formData, profilePicture: reader.result });
    };

  const validate = () => {
    if (formData.username.length < 3 || formData.username.length > 15) return "Username must be between 3-15 characters.";
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(formData.password)) return "Password is too weak.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vError = validate();
    if (vError) return setError(vError);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${API_URL}/api/users/register`, formData);
      alert("Registration successful!");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
          <span className="input-hint">3-15 characters, no spaces allowed.{t("usernameHint")}</span>
          <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          
          <label>{t("email")}</label>
          <span className="input-hint">Must be a valid email address (e.g. name@mail.com).{t("emailHint")}</span>
          <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          
          <label>{t("password")}</label>
          <span className="input-hint">Min. 8 characters, must include at least one letter and one number.{t("passwordHint")}</span>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

          <label>{t("profilePicture")}</label>
          <span className="input-hint">Select a square image for best results.{t("selectImage")}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} />

          <button type="submit" className="small-btn">{t("register")}</button>
          <p className="auth-footer">
            {t("allreadyHaveAnAccount")} <Link to="/login">{t("login")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;