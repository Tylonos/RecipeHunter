import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { splitIngredientEntries } from '../utils/ingredients';

function AddRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState('');
  const [diet, setDiet] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  try {
    await axios.post(`${API_URL}/api/recipes`, {
      title,
      description,
      ingredients: splitIngredientEntries(ingredients),
      cooking_time: Number(cookingTime),
      diet,
      image
    });

    navigate('/recipes');
  } catch (err) {
    console.error(err);
    setError('Failed to create recipe');
  }
};

  return (
    <div className="add-page">
      <Navbar />

      <div className="add-form-wrapper">
        <form className="add-form" onSubmit={handleSubmit}>
          <h2>{t("addRecipe")}</h2>

          {error && <p>{error}</p>}

          <label>{t("title")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>{t("description")}</label>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>(comma separated){t("ingredients")}</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <label>{t("cookingTime")}</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
          />

          <label>{t("diet")}</label>
          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">{t("none")}</option>
            <option value="vegetarian">{t("vegetarian")}</option>
            <option value="vegan">{t("vegan")}</option>
          </select>

          <label>{t("image")}</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button type="submit" className="small-btn">{t("saveRecipe")}</button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipePage;
