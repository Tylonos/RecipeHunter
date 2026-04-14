import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/api/users/update/${user.id || user._id}`, formData);
      login(res.data); 
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="profile-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src={user.profilePicture || DEFAULT_AVATAR} 
              alt="Profile" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #ff7f7f' }}
            />
            <h2 style={{ color: '#333', marginTop: '10px' }}>{user.username}</h2>
          </div>

          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field}>
                <label style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#555' }}>{field.replace(/([A-Z])/g, ' $1')}:</label>
                {isEditing ? (
                  <input 
                    className="dark-text-input"
                    type="text" 
                    value={formData[field] || ''} 
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                  />
                ) : (
                  <p className="profile-data-box">
                    {user[field] || <span style={{ color: '#999', fontStyle: 'italic' }}>Not specified</span>}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSave} className="small-btn" style={{ backgroundColor: '#4CAF50' }}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="small-btn" style={{ backgroundColor: '#aaa' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="small-btn">Edit Profile</button>
            )}
            
            {!isEditing && (
              <button 
                onClick={handleLogoutClick} 
                className="small-btn" 
                style={{ backgroundColor: '#ff4d4d', marginTop: '10px' }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;