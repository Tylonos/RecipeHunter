import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { splitIngredientEntries } from '../utils/ingredients';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import { api } from '../api';
import Footer from '../components/Footer';

function EditRecipePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [diet, setDiet] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/recipes/${id}`);
        const recipe = response.data;
        setTitle(recipe.title || '');
        setDescription(recipe.description || '');
        setIngredients(Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '');
        setCookingTime(recipe.cooking_time ?? '');
        setImage(recipe.image || '');
        setImagePreview(recipe.image || '');
        setDiet(recipe.diet || '');
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await api.put(`/api/recipes/${id}`, {
        title,
        description,
        ingredients: splitIngredientEntries(ingredients),
        cooking_time: Number(cookingTime),
        image,
        diet
      });

      // If edit caused the recipe to become pending (owner edit), notify and send user to profile
      if (res && res.data && res.data.status === 'pending') {
        alert(t('changesPending') || 'Your changes were saved and are pending admin approval.');
        navigate('/profile');
        return;
      }

      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update recipe');
    }
  };

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

  if (loading) {
    return <h2>Loading recipe...{t("loadingRecipe")}</h2>;
  }

  return (
    <div className="add-page">
      <Navbar />

      <div className="add-form-wrapper">
        <form className="add-form" onSubmit={handleSubmit}>
          <h2>{t("editRecipe")}</h2>

          {error && <p>{error}</p>}

          <label>{t("title")}</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label>{t("description")}</label>
          <textarea
            rows="5"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <label>{t("ingredients")}</label>
          <input
            type="text"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            required
          />

          <label>{t("cookingTime")}</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(event) => setCookingTime(event.target.value)}
            required
          />

          <label>{t("diet")}</label>
          <select value={diet} onChange={(event) => setDiet(event.target.value)}>
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

          <button type="submit" className="small-btn">{t("saveChanges")}</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditRecipePage;
