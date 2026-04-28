import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { normalizeIngredient, splitIngredientEntries } from '../utils/ingredients';
import { api } from '../api';
import Navbar from '../components/Navbar';
import { useTranslation } from "react-i18next";
import Footer from '../components/Footer';


function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeFilter, setRecipeFilter] = useState('');
  const [recipeSort, setRecipeSort] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [addedIngredientSearch, setAddedIngredientSearch] = useState('');
  const [addedIngredients, setAddedIngredients] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/api/recipes');
        setRecipes(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load recipes');
      }
    };

    fetchRecipes();
  }, []);

  const getRecipeIngredientKeySet = useCallback((recipe) => {
    const keys = new Set();
    const ingredientList = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];

    ingredientList.forEach((entry) => {
      splitIngredientEntries(entry).forEach((item) => {
        const { key } = normalizeIngredient(item);
        if (key) {
          keys.add(key);
        }
      });
    });

    return keys;
  }, []);

  const allIngredients = useMemo(() => {
    const ingredientByKey = new Map();

    recipes.forEach((recipe) => {
      const ingredientList = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];

      ingredientList.forEach((entry) => {
        if (typeof entry !== 'string') {
          return;
        }

        splitIngredientEntries(entry).forEach((ingredient) => {
          const { key, label } = normalizeIngredient(ingredient);
          if (!key) {
            return;
          }

          if (!ingredientByKey.has(key)) {
            ingredientByKey.set(key, label);
          }
        });
      });
    });

    return Array.from(ingredientByKey.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  }, [recipes]);

  const handleAddIngredient = (ingredientName) => {
    const { key, label } = normalizeIngredient(ingredientName);
    if (!key) {
      return;
    }

    setAddedIngredients((prevIngredients) => {
      const existing = prevIngredients.find((item) => item.key === key);
      if (existing) {
        if (existing.count >= 10) {
          return prevIngredients;
        }

        return prevIngredients.map((item) =>
          item.key === key ? { ...item, count: item.count + 1 } : item
        );
      }

      return [...prevIngredients, { key, name: label, count: 1 }];
    });
  };

  const handleRemoveIngredient = (ingredientKey) => {
    setAddedIngredients((prevIngredients) =>
      prevIngredients
        .map((item) =>
          item.key === ingredientKey ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const handleClearAddedIngredients = () => {
    setAddedIngredients([]);
  };

  useEffect(() => {
  const fetchRecipes = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    try {
      const res = await axios.get(`${API_URL}/api/recipes`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes');
    }
  };
  fetchRecipes();}, []);

  const filteredRecipes = useMemo(() => {
    let list = recipes;

    const pantryKeys = addedIngredients.map((item) => item.key).filter(Boolean);
    if (recipeFilter === 'pantry-all' && pantryKeys.length > 0) {
      const pantryKeySet = new Set(pantryKeys);
      list = list.filter((recipe) => {
        const recipeKeys = getRecipeIngredientKeySet(recipe);
        for (const key of recipeKeys) {
          if (!pantryKeySet.has(key)) {
            return false;
          }
        }
        return true;
      });
    }

    const needle = searchTerm.trim().toLowerCase();
    if (needle) {
      list = list.filter((recipe) => {
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
      });
    }

    if (recipeFilter && recipeFilter !== 'pantry-all') {
      list = list.filter((recipe) => recipe.diet === recipeFilter);
    }

    if (recipeSort === 'time-asc') {
      list = [...list].sort((a, b) => (a.cooking_time || 0) - (b.cooking_time || 0));
    } else if (recipeSort === 'time-desc') {
      list = [...list].sort((a, b) => (b.cooking_time || 0) - (a.cooking_time || 0));
    }

    return list;
  }, [recipes, addedIngredients, searchTerm, recipeFilter, recipeSort, getRecipeIngredientKeySet]);

  const getRecipeIngredientPreview = useCallback((recipe) => {
    const ingredientList = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
    const labels = ingredientList
      .filter((entry) => typeof entry === 'string')
      .flatMap((entry) => splitIngredientEntries(entry))
      .map((entry) => normalizeIngredient(entry).label)
      .filter(Boolean);

    const uniqueLabels = Array.from(new Set(labels));
    if (uniqueLabels.length === 0) {
      return 'No ingredients listed.';
    }

    return uniqueLabels.slice(0, 10).join(', ');
  }, []);

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{t("pantry")}</h2>
        </div>

        <div className="sidebar-section">
          <input
            type="text"
            placeholder={t("searchForIngredients")}
            value={ingredientSearch}
            onChange={(event) => setIngredientSearch(event.target.value)}
          />
          <select>
            <option>{t("filterBy...")}</option>
            <option>{t("fruits")}</option>
            <option>{t("vegetables")}</option>
            <option>{t("meat")}</option>
            <option>{t("nuts")}</option>
            <option>{t("oils")}</option>
          </select>
        </div>

        <div className="sidebar-section">
          <h3>{t("allIngredients")}</h3>
          <ul className="ingredient-list ingredient-list-scroll ingredient-list-selectable">
            {allIngredients.length === 0 ? (
              <li>
                <span>{t("noIngredientsFound")}</span>
              </li>
            ) : (
              allIngredients
                .filter((ingredient) => {
                  const needle = ingredientSearch.trim().toLowerCase();
                  if (!needle) {
                    return true;
                  }

                  return ingredient.label.toLowerCase().includes(needle);
                })
                .map((ingredient) => (
                  <li
                    key={ingredient.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleAddIngredient(ingredient.label)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleAddIngredient(ingredient.label);
                      }
                    }}
                  >
                    {ingredient.label}
                  </li>
                ))
            )}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>{t("addedIngredients")}</h3>
          <input
            type="text"
            placeholder={t("searchForIngredients")}
            value={addedIngredientSearch}
            onChange={(event) => setAddedIngredientSearch(event.target.value)}
          />
          <button
            type="button"
            className="small-btn sidebar-btn"
            onClick={handleClearAddedIngredients}
            disabled={addedIngredients.length === 0}
          >
            {t("clearAll")}
          </button>
          <ul className="ingredient-list ingredient-list-scroll">
            {addedIngredients
              .filter((item) => {
                const needle = addedIngredientSearch.trim().toLowerCase();
                if (!needle) {
                  return true;
                }

                return item.name.toLowerCase().includes(needle);
              })
              .map((item) => (
                <li key={item.key}>
                  <span>{item.name}</span>
                  <span className="ingredient-actions">
                    <span>x{item.count}</span>
                    <button
                      type="button"
                      className="ingredient-remove-btn"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => handleRemoveIngredient(item.key)}
                    >
                      {t("remove")}
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <Navbar />

        <section className="controls">
          <input
            type="text"
            placeholder={t("searchForRecipes")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select
            value={recipeFilter}
            onChange={(event) => setRecipeFilter(event.target.value)}
          >
            <option value="">{t("filterBy...")}</option>
            <optgroup label="Diet">
              <option value="vegetarian">{t("vegetarian")}</option>
              <option value="vegan">{t("vegan")}</option>
            </optgroup>
            <optgroup label="Ingredients">
              <option value="pantry-all">{t("matchesAddedIngredients")}</option>
            </optgroup>
          </select>
          <select
            value={recipeSort}
            onChange={(event) => setRecipeSort(event.target.value)}
          >
            <option value="">{t("sortBy...")}</option>
            <option value="time-asc">{t("cookingTimeAsc")}</option>
            <option value="time-desc">{t("cookingTimeDesc")}</option>
          </select>
        </section>

        {error && <p className="empty-message">{error}</p>}

        <section className="recipe-grid">
          {filteredRecipes.length === 0 ? (
            <div className="empty-message">
              <p>{t("noRecipesFound")}</p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
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

                  <p className="recipe-status">{t("recipeAvailable")}</p>
                  <p className="recipe-description">{getRecipeIngredientPreview(recipe)}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default RecipeListPage;
