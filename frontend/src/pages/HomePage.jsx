import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useTranslation } from "react-i18next";
import { api } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToRandomRecipe = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();

      if (data.length === 0) return;

      const random = data[Math.floor(Math.random() * data.length)];
      navigate(`/recipes/${random._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        <h1 className="home-title">
          {t("homeTitle")}
        </h1>

        <button className="btn main-btn" onClick={() => navigate("/recipes")}>
          {t("mainBtn")}
        </button>

        <p className="or-text">{t("orEither")}</p>

        <div className="options">
          <button className="btn green" onClick={goToRandomRecipe}>
            {t("randomBtn")}
          </button>

          <button
            className="btn orange"
            onClick={() => navigate("/recipes/69de72f97869f80ade485353")}
          >
          {t("dailyBtn")}
          </button>
        </div>
      </div>
    </>
  );
}
