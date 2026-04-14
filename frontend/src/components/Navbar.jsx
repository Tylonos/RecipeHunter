import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
  // Don't show auth-related buttons if we are already on the Login or Register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Logic: If NOT logged in AND not on an auth page, show Login button */}
        {!user && !isAuthPage && (
          <Link to="/login" className="small-btn">Login</Link>
        )}
      </div>

      <div className="topbar-center">
        <h1 className="main-title">
          <Link to="/recipes" style={{ textDecoration: 'none', color: '#333' }}>RECIPE HUNTER</Link>
        </h1>
      </div>

      <div className="topbar-right">
        {/* Only show "Add Recipe" if not on login/register pages */}
        {!isAuthPage && <Link to="/add-recipe" className="small-btn add-link">Add Recipe</Link>}
        
        <button className="small-btn">Language</button>
        <button className="small-btn">Light/Dark</button>
        
        {/* Profile picture only shows when user is logged in */}
        {user && (
          <Link to="/profile" title="Go to Profile">
            <div className="profile-circle" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '2px solid #ff7f7f',
                marginLeft: '15px'
            }}>
              <img 
                src={user.profilePicture || DEFAULT_AVATAR} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;