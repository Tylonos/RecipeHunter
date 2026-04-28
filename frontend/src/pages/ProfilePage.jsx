import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import api from '../api';

function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const { t } = useTranslation();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleSave = async () => {
    try {
      //Regex to check for a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return; 
      }


      const res = await api.put(`/api/users/update/${user.id || user._id}`, formData);
      login(res.data); 
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      console.error("Update error:", err);
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
        <div
          className="profile-card"
          style={{
            background: 'var(--surface)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)',
          }}
        >
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src={user.profilePicture || DEFAULT_AVATAR} 
              alt="Profile" 
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '5px solid var(--accent)',
              }}
            />
            <h2 style={{ color: 'var(--text-h)', marginTop: '10px' }}>{user.username}</h2>
          </div>

          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field}>
                <label style={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'var(--muted)' }}>{field.replace(/([A-Z])/g, ' $1')}:</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData[field] || ''} 
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-data-box">
                    {user[field] || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Not specified</span>}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSave} className="small-btn">{t("saveChanges")}</button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="small-btn"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-h)', border: '1px solid var(--border)' }}
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="small-btn">{t("editProfile")}</button>
            )}
            
            {!isEditing && (
              <button 
                onClick={handleLogoutClick} 
                className="small-btn" 
                style={{ backgroundColor: 'var(--danger)', marginTop: '10px' }}
              >
                {t("logout")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
