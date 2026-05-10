import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { splitIngredientEntries } from '../utils/ingredients';
import { useTranslation } from "react-i18next";
import api from '../api';
import Footer from '../components/Footer';

function AddRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [diet, setDiet] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/recipes', {
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
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div style={{ marginTop: 10 }}>
              <img src={imagePreview} alt="preview" style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          )}

          <button type="submit" className="small-btn">{t("saveRecipe")}</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AddRecipePage;
