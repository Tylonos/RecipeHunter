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
        cookingExpUnit: expParts[1] || 'years' 
      });
    }
  }, [user, isEditing]);

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePicture: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 14 || ageNum > 99) {
      alert("Validation Error: Age must be between 14 and 99.");
      return; 
    }

    const occRegex = /^[a-zA-Z\s]*$/;
    if (formData.occupation && !occRegex.test(formData.occupation)) {
      alert("Validation Error: Occupation can only contain letters and spaces.");
      return; 
    }

    const finalData = {
      ...formData,
      age: ageNum,
      cookingExp: `${formData.cookingExpValue || 0} ${formData.cookingExpUnit || 'years'}`
    };

    try {
      const res = await api.put(`/api/users/update/${user.id || user._id}`, finalData);
      login(res.data); 
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            {/* HOVER EDITABLE AVATAR */}
            <div className={`avatar-wrapper ${isEditing ? 'editable' : ''}`} 
                 onClick={() => isEditing && fileInputRef.current.click()}>
              <img 
                src={formData.profilePicture || DEFAULT_AVATAR} 
                alt="Profile" 
                className={`profile-img ${isEditing ? 'profile-img-clickable' : ''}`} 
                onClick={() => isEditing && fileInputRef.current.click()} 
              />
              {isEditing && <div className="avatar-overlay">Click to Change</div>}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
            <h2>{user.username}</h2>
          </div>

          <div className="profile-info-grid">
            <div className="info-item">
              <label>Age:</label>
              {isEditing ? (
                <input 
                  type="number" 
                  value={formData.age || ''} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="profile-input"
                />
              ) : <p className="profile-data-box">{user.age}</p>}
            </div>

            <div className="info-item">
              <label>Occupation:</label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="profile-input"
                  value={formData.occupation || ''} 
                  onChange={(e) => {
                    // This line removes any numbers as the user types
                    const cleanValue = e.target.value.replace(/[0-9]/g, '');
                    setFormData({...formData, occupation: cleanValue});
                  }}
                />
              ) : <p className="profile-data-box">{user.occupation}</p>}
            </div>

            <div className="info-item">
              <label>Cooking Experience:</label> 
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    className="profile-input"
                    style={{ width: '80px' }}
                    value={formData.cookingExpValue || ''} 
                    onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})}
                  />
                  <select 
                    className="profile-input"
                    value={formData.cookingExpUnit || 'years'}
                    onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})}
                  >
                    <option value="days">days</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                  </select>
                </div>
              ) : <p className="profile-data-box">{user.cookingExp}</p>}
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="small-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="small-btn cancel">Cancel</button>
              </>
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