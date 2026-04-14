import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeFilter, setRecipeFilter] = useState('');
  const [recipeSort, setRecipeSort] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [addedIngredientSearch, setAddedIngredientSearch] = useState('');

  const allIngredients = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .map((letter) => `${letter} ingredient`);

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
          <input
            type="text"
            placeholder="Search for ingredients..."
            value={ingredientSearch}
            onChange={(event) => setIngredientSearch(event.target.value)}
          />
          <select>
            <option>Filter by...</option>
            <option>Fruits</option>
            <option>Vegetables</option>
            <option>Meat</option>
            <option>Nuts</option>
            <option>Oils</option>
          </select>
        </div>

        <div className="sidebar-section">
          <h3>All ingredients</h3>
          <ul
            className="ingredient-list"
            style={{ maxHeight: '220px', overflowY: 'auto' }}
          >
            {allIngredients
              .filter((ingredient) => {
                const needle = ingredientSearch.trim().toLowerCase();
                if (!needle) {
                  return true;
                }

                return ingredient.toLowerCase().includes(needle);
              })
              .map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Added ingredients</h3>
          <input
            type="text"
            placeholder="Search for ingredients..."
            value={addedIngredientSearch}
            onChange={(event) => setAddedIngredientSearch(event.target.value)}
          />
          <ul className="ingredient-list">
            {[
              { name: 'Tomato', amount: 'x4' },
              { name: 'Beef', amount: '350g' },
              { name: 'Sunflower oil', amount: '2 t.s.' }
            ]
              .filter((item) => {
                const needle = addedIngredientSearch.trim().toLowerCase();
                if (!needle) {
                  return true;
                }

                return item.name.toLowerCase().includes(needle);
              })
              .map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <span>{item.amount}</span>
                </li>
              ))}
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
          <input
            type="text"
            placeholder="Search for the recipes..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            value={recipeFilter}
            onChange={(event) => setRecipeFilter(event.target.value)}
          >
            <option value="">Filter by...</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <select
            value={recipeSort}
            onChange={(event) => setRecipeSort(event.target.value)}
          >
            <option value="">Sort by...</option>
            <option value="time-asc">Cooking time (asc)</option>
            <option value="time-desc">Cooking time (desc)</option>
          </select>
        </section>

        {error && <p className="empty-message">{error}</p>}

        <section className="recipe-grid">
          {recipes.filter((recipe) => {
            const needle = searchTerm.trim().toLowerCase();
            if (!needle) {
              return true;
            }

            const title = recipe.title?.toLowerCase() ?? '';
            const description = recipe.description?.toLowerCase() ?? '';
            const ingredients = Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join(' ').toLowerCase()
              : '';

            return (
              title.includes(needle) ||
              description.includes(needle) ||
              ingredients.includes(needle)
            );
          }).filter((recipe) => {
            if (!recipeFilter) {
              return true;
            }

            return recipe.diet === recipeFilter;
          }).sort((a, b) => {
            if (recipeSort === 'time-asc') {
              return (a.cooking_time || 0) - (b.cooking_time || 0);
            }

            if (recipeSort === 'time-desc') {
              return (b.cooking_time || 0) - (a.cooking_time || 0);
            }

            return 0;
          }).length === 0 ? (
            <div className="empty-message">
              <p>No recipes found.</p>
            </div>
          ) : (
            recipes.filter((recipe) => {
              const needle = searchTerm.trim().toLowerCase();
              if (!needle) {
                return true;
              }

              const title = recipe.title?.toLowerCase() ?? '';
              const description = recipe.description?.toLowerCase() ?? '';
              const ingredients = Array.isArray(recipe.ingredients)
                ? recipe.ingredients.join(' ').toLowerCase()
                : '';

              return (
                title.includes(needle) ||
                description.includes(needle) ||
                ingredients.includes(needle)
              );
            }).filter((recipe) => {
              if (!recipeFilter) {
                return true;
              }

              return recipe.diet === recipeFilter;
            }).sort((a, b) => {
              if (recipeSort === 'time-asc') {
                return (a.cooking_time || 0) - (b.cooking_time || 0);
              }

              if (recipeSort === 'time-desc') {
                return (b.cooking_time || 0) - (a.cooking_time || 0);
              }

              return 0;
            }).map((recipe) => (
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
                  <Link className="small-btn" to={`/recipes/${recipe._id}/edit`}>
                    Edit
                  </Link>
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
