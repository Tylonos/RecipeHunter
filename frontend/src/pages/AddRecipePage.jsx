import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AddRecipePage() {
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

    try {
      await axios.post('http://localhost:5001/api/recipes', {
        title,
        description,
        ingredients: ingredients
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item !== ''),
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
          <h2>Add Recipe</h2>

          {error && <p>{error}</p>}

          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Ingredients (comma separated)</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <label>Cooking Time</label>
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
          />

          <label>Diet</label>
          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button type="submit" className="small-btn">Save Recipe</button>
        </form>
      </div>
    </div>
  );
}

export default AddRecipePage;
