import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
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
      <header className="detail-topbar">
        <div className="detail-topbar-left">
          <Link className="subtle-back" to="/recipes">← Back</Link>
        </div>

        <div className="detail-topbar-center">
          <h1>RECIPE HUNTER</h1>
        </div>

        <div className="detail-topbar-right">
          <Link to="/add-recipe" className="small-btn add-link">Add Recipe</Link>
          <Link to={`/recipes/${id}/edit`} className="small-btn">Edit</Link>
          <button className="small-btn">Language</button>
          <button className="small-btn">Light/Dark</button>
          <div className="profile-circle"></div>
        </div>
      </header>

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
              recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))
            ) : (
              <li>No ingredients added yet.</li>
            )}
          </ul>
        </aside>

        <main className="detail-panel instructions-panel">
          <h3>Description</h3>

          <div className="instruction-step">
            <span className="step-number">About</span>
            <p>{recipe.description}</p>
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
            <p>This dish has a classic homemade style and is a great base for a richer recipe story later on.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default RecipeDetailPage;
