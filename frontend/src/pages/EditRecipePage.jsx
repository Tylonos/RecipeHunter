import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { splitIngredientEntries } from '../utils/ingredients';
import Navbar from '../components/Navbar';
import { api } from '../api';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState('');
  const [diet, setDiet] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${API_URL}/api/recipes/${id}`);
        const recipe = response.data;
        setTitle(recipe.title || '');
        setDescription(recipe.description || '');
        setIngredients(Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '');
        setCookingTime(recipe.cooking_time ?? '');
        setImage(recipe.image || '');
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
      await api.put(`/api/recipes/${id}`, {
        title,
        description,
        ingredients: splitIngredientEntries(ingredients),
        cooking_time: Number(cookingTime),
        image,
        diet
      });

      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update recipe');
    }
  };

  if (loading) {
    return <h2>Loading recipe...</h2>;
  }

  return (
    <div className="add-page">
      <Navbar />

      <div className="add-form-wrapper">
        <form className="add-form" onSubmit={handleSubmit}>
          <h2>Edit Recipe</h2>

          {error && <p>{error}</p>}

          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            rows="5"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <label>Ingredients (comma separated)</label>
          <input
            type="text"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            required
          />

          <label>Cooking Time</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(event) => setCookingTime(event.target.value)}
            required
          />

          <label>Diet</label>
          <select value={diet} onChange={(event) => setDiet(event.target.value)}>
            <option value="">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />

          <button type="submit" className="small-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditRecipePage;
