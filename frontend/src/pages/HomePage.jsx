import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { API_BASE_URL } from "../api";

export default function Home() {
  const navigate = useNavigate();

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
          Just tell us what’s in your fridge, we got you!
        </h1>

        <button className="btn main-btn" onClick={() => navigate("/recipes")}>
          GO HUNTING
        </button>

        <p className="or-text">Or you can either</p>

        <div className="options">
          <button className="btn green" onClick={goToRandomRecipe}>
            Try out a random dish!
          </button>

          <button
            className="btn orange"
            onClick={() => navigate("/recipes/69de72f97869f80ade485353")}
          >
            Go with the dish of the day!
          </button>
        </div>
      </div>
    </>
  );
}
