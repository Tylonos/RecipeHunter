import { useContext, useState, useEffect, useRef } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Import the new footer
import api from '../api';

function ProfilePage() {
  const { user, login } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); 
  const [msg, setMsg] = useState({ text: '', type: '' }); // Custom Alert State
  const fileInputRef = useRef(null);

  // Restricted Colors
  const colors = [
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

  const showNotification = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSave = async () => {
    // 1. Email Verification Fix
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailRegex.test(formData.email)) {
      showNotification("Error: Only @gmail or @yahoo allowed", "error");
      return;
    }

    // 2. Age Check
    if (Number(formData.age) < 14 || Number(formData.age) > 99) {
      showNotification("Error: Age must be 14-99", "error");
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
      showNotification("Profile updated successfully!"); // Clean notification
    } catch (err) {
      showNotification("Save failed", "error");
    }
  };

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  return (
    <div className="profile-page">
      <Navbar />
      
      {/* Custom Notification Box (Replaces Browser Alert) */}
      {msg.text && (
        <div className={`custom-alert ${msg.type}`}>
          {msg.text}
        </div>
      )}

      <div className="profile-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div className="profile-card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            
            {/* 5-Color Picker Buttons */}
            {isEditing && (
              <div className="color-selector">
                {colors.map(c => (
                  <button 
                    key={c.hex} 
                    className="color-dot" 
                    style={{ backgroundColor: c.hex, border: formData.themeColor === c.hex ? '3px solid black' : 'none' }}
                    onClick={() => {
                      setFormData({...formData, themeColor: c.hex});
                      document.documentElement.style.setProperty('--accent', c.hex);
                    }}
                  />
                ))}
              </div>
            )}

            <div className="avatar-container" onClick={() => isEditing && fileInputRef.current.click()} style={{ border: `5px solid var(--accent)` }}>
              <img src={formData.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Profile" className="profile-img" />
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
              const reader = new FileReader();
              reader.onloadend = () => setFormData({ ...formData, profilePicture: reader.result });
              reader.readAsDataURL(e.target.files[0]);
            }} />
          </div>

          <div className="profile-info-grid">
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field} className="info-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {isEditing ? (
                  field === 'occupation' ? (
                    <input 
                      className="profile-input" 
                      value={formData.occupation || ''} 
                      onChange={(e) => setFormData({...formData, occupation: e.target.value.replace(/[0-9]/g, '')})} 
                    />
                  ) : field === 'cookingExp' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input type="number" style={{width: '60px'}} value={formData.cookingExpValue || ''} onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})} className="profile-input" />
                      <select value={formData.cookingExpUnit || 'years'} onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})} className="profile-input">
                        <option value="days">days</option><option value="months">months</option><option value="years">years</option>
                      </select>
                    </div>
                  ) : (
                    <input className="profile-input" value={formData[field] || ''} onChange={(e) => setFormData({...formData, [field]: e.target.value})} />
                  )
                ) : (
                  <p className="profile-data-box">{user[field] || "Not set"}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="small-btn">
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default ProfilePage;