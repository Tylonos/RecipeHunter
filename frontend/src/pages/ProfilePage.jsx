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
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {/*Profile Picture */}
            <div 
              className="avatar-container" 
              onClick={() => isEditing && fileInputRef.current.click()}
              style={{ position: 'relative', display: 'inline-block', cursor: isEditing ? 'pointer' : 'default' }}
            >
              <img 
                src={formData.profilePicture || DEFAULT_AVATAR} 
                alt="Profile" 
                className="profile-img" 
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--accent)' }}
              />
              {isEditing && (
                <div className="avatar-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                  {t("editPhoto") || "Change"}
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            <h2 style={{ color: 'var(--text-h)', marginTop: '10px' }}>{user.username}</h2>
          </div>

          <div className="profile-info-grid">
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field} className="info-group">
                <label>
                  {field === 'cookingExp' ? "Cooking Experience" : field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                
                {isEditing ? (
                  <>
                    {/*AGE*/}
                    {field === 'age' ? (
                      <input 
                        type="number" 
                        value={formData.age || ''} 
                        onChange={(e) => setFormData({...formData, age: e.target.value})} 
                        className="profile-input" 
                      />
                    ) : 
                    /*OCCUPATION*/
                    field === 'occupation' ? (
                      <input 
                        type="text" 
                        value={formData.occupation || ''} 
                        onChange={(e) => setFormData({...formData, occupation: e.target.value.replace(/[0-9]/g, '')})} 
                        className="profile-input" 
                      />
                    ) : 
                    /*COOKING EXPERIENCE*/
                    field === 'cookingExp' ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <input 
                          type="number" 
                          style={{ width: '70px' }} 
                          value={formData.cookingExpValue || ''} 
                          onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})} 
                          className="profile-input" 
                        />
                        <select 
                          value={formData.cookingExpUnit || 'years'} 
                          onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})} 
                          className="profile-input"
                          style={{ flex: 1 }}
                        >
                          <option value="days">days</option>
                          <option value="months">months</option>
                          <option value="years">years</option>
                        </select>
                      </div>
                    ) : (
                      /*ALL OTHER FIELDS*/
                      <input 
                        type="text" 
                        value={formData[field] || ''} 
                        onChange={(e) => setFormData({...formData, [field]: e.target.value})} 
                        className="profile-input" 
                      />
                    )}
                  </>
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