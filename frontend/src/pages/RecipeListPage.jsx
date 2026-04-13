import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/recipes');
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipes');
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Pantry</h2>
        </div>

        <div className="sidebar-section">
          <input type="text" placeholder="Search for ingredients..." />
          <select>
            <option>Filter by...</option>
          </select>
        </div>

        <div className="sidebar-section">
          <h3>All ingredients</h3>
          <ul className="ingredient-list">
            <li>Apple</li>
            <li>Flour</li>
            <li>Milk</li>
            <li>Sugar</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <input type="text" placeholder="Search for ingredients..." />
          <h3>Added ingredients</h3>
          <ul className="ingredient-list">
            <li><span>Tomato</span><span>x4</span></li>
            <li><span>Beef</span><span>350g</span></li>
            <li><span>Sunflower oil</span><span>2 t.s.</span></li>
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="small-btn">Login</button>
          </div>

          <div className="topbar-center">
            <h1>RECIPE HUNTER</h1>
          </div>

          <div className="topbar-right">
            <Link to="/add-recipe" className="small-btn add-link">Add Recipe</Link>
            <button className="small-btn">Language</button>
            <button className="small-btn">Light/Dark</button>
            <div className="profile-circle"></div>
          </div>
        </header>

        <section className="controls">
          <input type="text" placeholder="Search for the recipes..." />
          <select>
            <option>Filter by...</option>
          </select>
          <select>
            <option>Sort by...</option>
          </select>
        </section>

        {error && <p className="empty-message">{error}</p>}

        <section className="recipe-grid">
          {recipes.length === 0 ? (
            <div className="empty-message">
              <p>No recipes found.</p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <div className="recipe-card" key={recipe._id}>
                <div className="recipe-card-image">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                </div>

                <div className="recipe-card-content">
                  <div className="recipe-card-top">
                    <h2>
                      <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
                    </h2>
                    <div className="time-badge">
                      {recipe.cooking_time}m
                    </div>
                  </div>

                  <p className="recipe-status">Recipe available</p>
                  <p className="recipe-description">{recipe.description}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default RecipeListPage;