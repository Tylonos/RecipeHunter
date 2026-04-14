import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', profilePicture: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    // Safety Check: Limit to 5MB on the frontend
    if (file.size > 5 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 5MB.");
        e.target.value = null; // Clear the input
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
      await axios.post('http://localhost:5001/api/users/register', formData);
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
          <h2>Create Account</h2>
          {error && <div className="auth-error">{error}</div>}
          
          <label>Username</label>
          <span className="input-hint">3-15 characters, no spaces allowed.</span>
          <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          
          <label>Email</label>
          <span className="input-hint">Must be a valid email address (e.g. name@mail.com).</span>
          <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          
          <label>Password</label>
          <span className="input-hint">Min. 8 characters, must include at least one letter and one number.</span>
          <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

          <label>Profile Picture</label>
          <span className="input-hint">Select a square image for best results.</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} />

          <button type="submit" className="small-btn">Register</button>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;