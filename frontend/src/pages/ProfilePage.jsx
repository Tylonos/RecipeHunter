import { useContext, useState, useEffect, useRef } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

function ProfilePage() {
  const { user, login } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); 
  const [notification, setNotification] = useState({ show: false, msg: '', type: '' });
  const fileInputRef = useRef(null);

  //5 Colors
  const themeOptions = [
    { name: 'Purple', hex: '#8e44ad' },
    { name: 'Green', hex: '#0a7a3f' },
    { name: 'Blue', hex: '#2980b9' },
    { name: 'Red', hex: '#c0392b' },
    { name: 'Yellow', hex: '#f1c40f' }
  ];

  useEffect(() => {
    if (user && !isEditing) {
      const expParts = user.cookingExp ? user.cookingExp.split(' ') : ['', 'years'];
      setFormData({ 
        ...user, 
        cookingExpValue: expParts[0], 
        cookingExpUnit: expParts[1] || 'years',
        themeColor: user.themeColor || '#0a7a3f'
      });
      document.documentElement.style.setProperty('--accent', user.themeColor || '#0a7a3f');
    }
  }, [user, isEditing]);

  const triggerNotify = (msg, type = 'success') => {
    setNotification({ show: true, msg, type });
    setTimeout(() => setNotification({ show: false, msg: '', type: '' }), 4000);
  };

  const handleSave = async () => {
    // 1. Email Verification
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailRegex.test(formData.email)) {
      triggerNotify("Error: Only @gmail or @yahoo allowed", "error");
      return;
    }

    // 2. Age Verification
    if (Number(formData.age) < 14 || Number(formData.age) > 99) {
      triggerNotify("Error: Age must be 14-99", "error");
      return;
    }

    const finalData = {
      ...formData,
      cookingExp: `${formData.cookingExpValue || 0} ${formData.cookingExpUnit || 'years'}`
    };

    try {
      const res = await api.put(`/api/users/update/${user.id || user._id}`, finalData);
      login(res.data); 
      setIsEditing(false);
      triggerNotify("Profile updated successfully!"); // CLEAN ALERT
    } catch (err) {
      triggerNotify("Update failed", "error");
    }
  };

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  return (
    <div className="page-layout">
      <Navbar />

      {notification.show && (
        <div className={`custom-alert ${notification.type}`}>
          {notification.msg}
        </div>
      )}

      <div className="profile-centering-container">
        <div className="profile-card themed-card" style={{ borderTop: `8px solid ${formData.themeColor}` }}>
          
          <div className="profile-header">
            <div className="avatar-container" onClick={() => isEditing && fileInputRef.current.click()}>
              <img 
                src={user.profilePicture || DEFAULT_AVATAR} 
                alt="Avatar" 
                className="profile-img-circle" 
              />
              {isEditing && (
                <div className="avatar-overlay">
                  <span>Change</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />
            
            <h2 className="profile-username">{user.username}</h2>

            <div className="color-selector">
              {themeOptions.map(c => (
                <div 
                  key={c.name}
                  className={`color-dot ${formData.themeColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => isEditing && setFormData({...formData, themeColor: c.hex})}
                />
              ))}
            </div>
          </div>

          <div className="profile-info-grid">
            {['username', 'email', 'age', 'occupation', 'cookingExp'].map((field) => (
              <div key={field} className="info-item">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {isEditing ? (
                  field === 'occupation' ? (
                    <input 
                      className="profile-input themed" 
                      value={formData.occupation || ''} 
                      onChange={(e) => setFormData({...formData, occupation: e.target.value.replace(/[0-9]/g, '')})} 
                    />
                  ) : field === 'cookingExp' ? (
                    <div className="exp-inputs">
                      <input type="number" value={formData.cookingExpValue || ''} onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})} className="profile-input themed" />
                      <select value={formData.cookingExpUnit || 'years'} onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})} className="profile-input themed">
                        <option value="days">days</option><option value="months">months</option><option value="years">years</option>
                      </select>
                    </div>
                  ) : (
                    <input className="profile-input themed" value={formData[field] || ''} onChange={(e) => setFormData({...formData, [field]: e.target.value})} />
                  )
                ) : (
                  <div className="data-display">{user[field] || "Not set"}</div>
                )}
              </div>
            ))}
          </div>

          <div className="profile-footer-btns">
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="small-btn">
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default ProfilePage;