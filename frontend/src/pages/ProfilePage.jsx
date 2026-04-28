import { useContext, useState, useEffect } from 'react'; 
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

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  //Sync formData
  useEffect(() => {
    if (user && !isEditing) {
      // this splits the "8 months" string into '8' and 'months' for the edit inputs
      const expParts = user.cookingExp ? user.cookingExp.split(' ') : ['', 'years'];
      
      setFormData({ 
        ...user, 
        cookingExpValue: expParts[0], 
        cookingExpUnit: expParts[1] || 'years' 
      });
    }
  }, [user, isEditing]);

  if (!user) return <div className="page-layout"><Navbar /><h2>Please log in.</h2></div>;

  const handleSave = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      alert("Invalid Email: Only @gmail.com or @yahoo.com addresses are permitted.");
      return;
    }

    // 2. Age Validation (14 to 99)
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 14) {
      alert("Minors are not allowed (Minimum age: 14).");
      return;
    }
    if (ageNum > 99) {
      alert("Please enter a valid age between 14 and 99.");
      return;
    }

    // 3. Occupation Validation 
    const occRegex = /^[a-zA-Z\s]*$/;
    if (formData.occupation && !occRegex.test(formData.occupation)) {
      alert("Occupation can only contain letters (no numbers or special characters).");
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
      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
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
        <div className="profile-card" style={{ background: 'var(--surface)', padding: '30px', borderRadius: '15px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src={user.profilePicture || DEFAULT_AVATAR} 
              alt="Profile" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--accent)' }}
            />
            <h2 style={{ color: 'var(--text-h)', marginTop: '10px' }}>{user.username}</h2>
          </div>

          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {['email', 'age', 'occupation', 'cookingExp', 'allergies', 'appliances'].map((field) => (
              <div key={field}>
                <label style={{ fontWeight: 'bold', textTransform: 'capitalize', color: 'var(--muted)' }}>
                  {field.replace(/([A-Z])/g, ' $1')}:
                </label>
                {isEditing ? (
                  <input 
                    type={field === 'email' ? "email" : "text"} 
                    value={formData[field] || ''} 
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                    className="profile-input"
                    placeholder={field === 'email' ? "must be @gmail or @yahoo" : ""}
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
                <button onClick={() => setIsEditing(false)} className="small-btn" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="small-btn">{t("editProfile")}</button>
            )}
            
            {!isEditing && (
              <button onClick={handleLogoutClick} className="small-btn" style={{ backgroundColor: 'var(--danger)', marginTop: '10px' }}>
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