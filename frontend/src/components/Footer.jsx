import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const Footer = () => {
const { t } = useTranslation();

  return (
    <footer className="main-footer">
      <div className="footer-logo-section">
        <h1 className="footer-brand">Recipe Hunter</h1>
      </div>

      <div className="footer-content">
        <div className="footer-column">
          <h3>{t("contactUs")}</h3>
          <p>Griffith College, Dublin</p>
          <p>support@recipeapp.com</p>
        </div>
        
        <div className="footer-column">
          <h3>{t("helpSupport")}</h3>
          <ul>
            <li><Link to="/about">{t("aboutUs")}</Link></li>
            <li><Link to="/profile">{t("profile")}</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>{t("community")}</h3>
          <p>{t("joinNewsletter")}</p>
        </div>
      </div>
      
        <div className="footer-bottom">
            &copy; 2026 RecipeApp - {t('footer_tagline', 'All rights reserved')}
        </div>
    </footer>
  );
};

export default Footer;