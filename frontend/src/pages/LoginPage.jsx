import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', { email, password });
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
          <h2 style={{ color: 'var(--text-h)' }}>Login</h2>
          {error && <div className="auth-error">{error}</div>}
          
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" className="small-btn">Sign In</button>
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
