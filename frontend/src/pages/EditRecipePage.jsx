import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { splitIngredientEntries } from '../utils/ingredients';

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
        const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
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
      await axios.put(`http://localhost:5001/api/recipes/${id}`, {
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
      <header className="detail-topbar">
        <div className="detail-topbar-left">
          <Link className="subtle-back" to={`/recipes/${id}`}>← Back</Link>
        </div>

        <div className="detail-topbar-center">
          <h1>RECIPE HUNTER</h1>
        </div>

        <div className="detail-topbar-right">
          <div className="profile-circle"></div>
        </div>
      </header>

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
