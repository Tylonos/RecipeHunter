import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { normalizeIngredient, splitIngredientEntries } from '../utils/ingredients';
import Navbar from '../components/Navbar';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await axios.get(`${API_URL}/api/recipes/${id}`);
        
        setRecipe(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe');
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!recipe) {
    return <h2>Loading recipe...</h2>;
  }

  return (
    <div className="detail-page">
      <Navbar />

      <section className="detail-hero">
        <h2 className="detail-title">{recipe.title}</h2>

        <div className="single-image-card">
          {recipe.image ? (
            <img className="detail-main-image" src={recipe.image} alt={recipe.title} />
          ) : (
            <div className="detail-main-placeholder"></div>
          )}
        </div>
      </section>

      <section className="detail-content-grid">
        <aside className="detail-panel ingredients-panel">
          <h3>Ingredients</h3>
          <ul className="detail-list">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.flatMap((ingredient, index) =>
                splitIngredientEntries(ingredient).map((entry, subIndex) => {
                  const normalized = normalizeIngredient(entry);
                  if (!normalized.key) {
                    return null;
                  }

                  return (
                    <li key={`${index}-${subIndex}-${normalized.key}`}>
                      {normalized.label}
                    </li>
                  );
                })
              )
            ) : (
              <li>No ingredients added yet.</li>
            )}
          </ul>
        </aside>

        <main className="detail-panel instructions-panel">
          <h3>Instructions</h3>

          <div className="instruction-step">
            <span className="step-number">Step 1</span>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="instruction-step">
            <span className="step-number">Step 2</span>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="instruction-step">
            <span className="step-number">Step 3</span>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </main>

        <aside className="detail-panel info-panel">
          <h3>Recipe Info</h3>

          <div className="info-box">
            <p><strong>Cooking time:</strong> {recipe.cooking_time} minutes</p>
            <p><strong>Created at:</strong> {new Date(recipe.createdAt).toLocaleString()}</p>
            <p><strong>Difficulty:</strong> Medium</p>
            <p><strong>Servings:</strong> 4</p>
          </div>

          <div className="history-box">
            <p><strong>Description:</strong> {recipe.description}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default RecipeDetailPage;
