import { useContext, useState, useEffect, useRef } from 'react'; 
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); 
  const [notification, setNotification] = useState({ show: false, msg: '', type: '' });
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const ALLERGY_OPTIONS = [
    { key: 'peanuts', labelKey: 'allergyPeanuts' },
    { key: 'tree_nuts', labelKey: 'allergyTreeNuts' },
    { key: 'milk', labelKey: 'allergyMilk' },
    { key: 'eggs', labelKey: 'allergyEggs' },
    { key: 'wheat', labelKey: 'allergyWheat' },
    { key: 'soy', labelKey: 'allergySoy' },
    { key: 'fish', labelKey: 'allergyFish' },
    { key: 'shellfish', labelKey: 'allergyShellfish' },
    { key: 'sesame', labelKey: 'allergySesame' },
  ];

  const DIET_OPTIONS = [
    { key: 'vegetarian', labelKey: 'dietVegetarian' },
    { key: 'vegan', labelKey: 'dietVegan' },
    { key: 'pescatarian', labelKey: 'dietPescatarian' },
    { key: 'keto', labelKey: 'dietKeto' },
    { key: 'gluten_free', labelKey: 'dietGlutenFree' },
    { key: 'dairy_free', labelKey: 'dietDairyFree' },
  ];

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
        allergies: Array.isArray(user.allergies) ? user.allergies : [],
        diets: Array.isArray(user.diets) ? user.diets : [],
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!emailRegex.test(formData.email)) {
      triggerNotify("Error: Only @gmail or @yahoo allowed", "error");
      return;
    }

    if (Number(formData.age) < 14 || Number(formData.age) > 99) {
      triggerNotify("Error: Age must be 14-99", "error");
      return;
    }

    const finalData = {
      ...formData,
      allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
      diets: Array.isArray(formData.diets) ? formData.diets : [],
      cookingExp: `${formData.cookingExpValue || 0} ${formData.cookingExpUnit || 'years'}`
    };

    delete finalData.cookingExpValue;
    delete finalData.cookingExpUnit;

    try {
      const res = await api.put(`/api/users/update/${user.id || user._id}`, finalData);
      login(res.data); 
      setIsEditing(false);
      triggerNotify("Profile updated successfully!"); 
    } catch (err) {
      triggerNotify("Update failed", "error");
    }
  };

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        
        await api.put(`/users/update/${user._id}`, { profilePicture: base64Image });
        
        
        login({ ...user, profilePicture: base64Image });
        setNotification({ show: true, msg: 'Profile picture updated!', type: 'success' });
      } catch (err) {
        console.error("Upload error:", err);
        setNotification({ show: true, msg: 'Failed to upload image.', type: 'error' });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {notification.show && (
        <div className={`custom-alert ${notification.type}`}>
          {notification.msg}
        </div>
      )}

      <main className="profile-container" style={{ flex: '1', padding: '60px 20px' }}>
        <div className="profile-card">
          
          
          <div className="profile-header">
            <div className="avatar-container" onClick={() => isEditing && fileInputRef.current.click()}>
              <img 
                src={user.profilePicture || DEFAULT_AVATAR} 
                alt="Profile" 
                className="profile-img-main"
                style={{ borderColor: formData.themeColor }}
              />
              {isEditing && (
                <div className="avatar-overlay">
                  <span>{t("change")}</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />
            
            <h2 className="profile-username" style={{ color: formData.themeColor }}>
              {user.username}
            </h2>

            
            {isEditing && (
              <div className="color-selector" style={{ marginTop: '15px' }}>
                {themeOptions.map(col => (
                  <div 
                    key={col.hex}
                    className={`color-dot ${formData.themeColor === col.hex ? 'active' : ''}`}
                    style={{ backgroundColor: col.hex, cursor: 'pointer' }}
                    onClick={() => setFormData({...formData, themeColor: col.hex})}
                  />
                ))}
              </div>
            )}
          </div>

          
          <div className="profile-info-grid">
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'diets'].map((field) => (
              <div key={field} className="info-item">
                <label className="info-label">{t(field)}</label>
                
                {isEditing ? (
                  <>
                    {field === 'age' ? (
                      <input 
                        type="number" 
                        className="profile-input themed"
                        value={formData.age || ''} 
                        onChange={(e) => setFormData({...formData, age: e.target.value})} 
                      />
                    ) : field === 'allergies' ? (
                      <div className="allergies-grid">
                        {ALLERGY_OPTIONS.map((option) => {
                          const selected = Array.isArray(formData.allergies)
                            ? formData.allergies.includes(option.key)
                            : false;

                          return (
                            <label key={option.key} className="allergy-option">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => {
                                  const nextChecked = e.target.checked;
                                  setFormData((prev) => {
                                    const prevAllergies = Array.isArray(prev.allergies) ? prev.allergies : [];
                                    const nextAllergies = nextChecked
                                      ? Array.from(new Set([...prevAllergies, option.key]))
                                      : prevAllergies.filter((item) => item !== option.key);
                                    return { ...prev, allergies: nextAllergies };
                                  });
                                }}
                              />
                              <span>{t(option.labelKey)}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : field === 'diets' ? (
                      <div className="allergies-grid">
                        {DIET_OPTIONS.map((option) => {
                          const selected = Array.isArray(formData.diets)
                            ? formData.diets.includes(option.key)
                            : false;

                          return (
                            <label key={option.key} className="allergy-option">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => {
                                  const nextChecked = e.target.checked;
                                  setFormData((prev) => {
                                    const prevDiets = Array.isArray(prev.diets) ? prev.diets : [];
                                    const nextDiets = nextChecked
                                      ? Array.from(new Set([...prevDiets, option.key]))
                                      : prevDiets.filter((item) => item !== option.key);
                                    return { ...prev, diets: nextDiets };
                                  });
                                }}
                              />
                              <span>{t(option.labelKey)}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : field === 'occupation' ? (
                      <input 
                        className="profile-input themed"
                        value={formData.occupation || ''} 
                        onChange={(e) => setFormData({...formData, occupation: e.target.value.replace(/[0-9]/g, '')})} 
                      />
                    ) : field === 'cookingExp' ? (
                      <div className="exp-inputs">
                        <input 
                          type="number" 
                          value={formData.cookingExpValue || ''} 
                          onChange={(e) => setFormData({...formData, cookingExpValue: e.target.value})} 
                          className="profile-input themed" 
                        />
                        <select 
                          value={formData.cookingExpUnit || 'years'} 
                          onChange={(e) => setFormData({...formData, cookingExpUnit: e.target.value})} 
                          className="profile-input themed"
                        >
                          <option value="days">days</option>
                          <option value="months">months</option>
                          <option value="years">years</option>
                        </select>
                      </div>
                    ) : (
                      <input 
                        className="profile-input themed" 
                        value={formData[field] || ''} 
                        onChange={(e) => setFormData({...formData, [field]: e.target.value})} 
                      />
                    )}
                  </>
                ) : (
                  <div className="data-display">
                    {field === 'allergies'
                      ? (() => {
                          const existing = Array.isArray(user.allergies) ? user.allergies : [];
                          if (existing.length === 0) {
                            return "Not set";
                          }

                          const labelByKey = new Map(
                            ALLERGY_OPTIONS.map((option) => [option.key, t(option.labelKey)])
                          );

                          return (
                            <div className="allergy-badges" role="list">
                              {existing.map((key) => (
                                <span key={key} className="allergy-badge" role="listitem">
                                  {labelByKey.get(key) || key}
                                </span>
                              ))}
                            </div>
                          );
                        })()
                      : field === 'diets'
                        ? (() => {
                            const existing = Array.isArray(user.diets) ? user.diets : [];
                            if (existing.length === 0) {
                              return "Not set";
                            }

                            const labelByKey = new Map(
                              DIET_OPTIONS.map((option) => [option.key, t(option.labelKey)])
                            );

                            return (
                              <div className="allergy-badges" role="list">
                                {existing.map((key) => (
                                  <span key={key} className="allergy-badge" role="listitem">
                                    {labelByKey.get(key) || key}
                                  </span>
                                ))}
                              </div>
                            );
                          })()
                      : (user[field] || "Not set")}
                  </div>
                )}
              </div>
            ))}
          </div>

          
          <div className="profile-footer-btns" style={{ marginTop: '40px', textAlign: 'center' }}>
            <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="small-btn">
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
            
            {!isEditing && (
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="small-btn" 
                style={{ background: 'var(--danger)', marginLeft: '10px' }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default ProfilePage;
