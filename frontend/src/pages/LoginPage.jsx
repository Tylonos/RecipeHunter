import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { api } from '../api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    try {
      const res = await api.post('/api/users/login', { email, password });
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
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
          <h2 style={{color: '#333'}}>Login</h2>
          {error && <div className="auth-error">{error}</div>}
          
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" className="small-btn">Sign In</button>
          <p style={{marginTop: '15px', color: '#555'}}>
            New here? <Link to="/register" style={{color: '#ff7f7f', fontWeight: 'bold'}}>Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
