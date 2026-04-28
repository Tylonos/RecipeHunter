import { useContext, useState, useEffect, useRef } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import api from '../api';

function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); 
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    if (user && !isEditing) {
      const expParts = user.cookingExp ? user.cookingExp.split(' ') : ['', 'years'];
      setFormData({ 
        ...user, 
        cookingExpValue: expParts[0], 
        cookingExpUnit: expParts[1] || 'years',
        themeColor: user.themeColor || '#0a7a3f'
      });
      //user's theme color
      document.documentElement.style.setProperty('--accent', user.themeColor || '#0a7a3f');
    }
  }, [user, isEditing]);

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleSave = async () => {
    
    const ageNum = Number(formData.age);
    if (ageNum < 14 || ageNum > 99) { alert("Age must be 14-99."); return; }
    const occRegex = /^[a-zA-Z\s]*$/;
    if (formData.occupation && !occRegex.test(formData.occupation)) { alert("Occupation: Letters only."); return; }

    const finalData = {
      ...formData,
      age: ageNum,
      cookingExp: `${formData.cookingExpValue || 0} ${formData.cookingExpUnit || 'years'}`
    };

    try {
      const res = await api.put(`/api/users/update/${user.id || user._id}`, finalData);
      login(res.data); 
      setIsEditing(false);
      // CLEAN ALERT: Just the text you wanted
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
            
            {/* Color Picker Button (Top Right of Card) */}
            {isEditing && (
              <div style={{ position: 'absolute', right: '10px', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ fontSize: '10px', fontWeight: 'bold' }}>THEME</label>
                <input 
                  type="color" 
                  value={formData.themeColor || '#0a7a3f'} 
                  onChange={(e) => {
                    setFormData({...formData, themeColor: e.target.value});
                    document.documentElement.style.setProperty('--accent', e.target.value);
                  }}
                  style={{ width: '30px', height: '30px', border: 'none', cursor: 'pointer', background: 'none' }}
                />
              </div>
            )}

            <div 
              className="avatar-container" 
              onClick={() => isEditing && fileInputRef.current.click()}
              style={{ 
                cursor: isEditing ? 'pointer' : 'default', 
                border: `5px solid var(--accent)`, // Follows the chosen color
                borderRadius: '50%',
                display: 'inline-block',
                overflow: 'hidden'
              }}
            >
              <img src={formData.profilePicture || DEFAULT_AVATAR} alt="Profile" className="profile-img" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              {isEditing && <div className="avatar-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Edit</div>}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onloadend = () => setFormData({ ...formData, profilePicture: reader.result });
              reader.readAsDataURL(file);
            }} />
            <h2 style={{ color: 'var(--text-h)' }}>{user.username}</h2>
          </div>

          {/* GRID: Sit in 2 Columns */}
          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field} className="info-group">
                <label>{field === 'cookingExp' ? "Experience" : field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {isEditing ? (
                  field === 'cookingExp' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input type="number" style={{ width: '50px' }} value={formData.cookingExpValue || ''} onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})} className="profile-input" />
                      <select value={formData.cookingExpUnit || 'years'} onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})} className="profile-input">
                        <option value="days">days</option><option value="months">months</option><option value="years">years</option>
                      </select>
                    </div>
                  ) : (
                    <input 
                      type={field === 'age' ? 'number' : 'text'} 
                      value={formData[field] || ''} 
                      onChange={(e) => setFormData({...formData, [field]: e.target.value})} 
                      className="profile-input"
                      style={{ borderColor: 'var(--accent)' }} // Input boxes follow theme color
                    />
                  )
                ) : (
                  <p className="profile-data-box">{user[field] || "Not set"}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleSave} className="small-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="small-btn" style={{ background: '#666' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="small-btn">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;