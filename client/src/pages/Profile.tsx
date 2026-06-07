import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { Recipe } from "../types";

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Recipe[]>(
    user?.bookmarks ?? []
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [postedRecipes, setPostedRecipes] = useState<Recipe[]>([]);
  const [postedLoading, setPostedLoading] = useState(true);

  useEffect(() => {
    if (user?.bookmarks) {
      setBookmarkedRecipes(user.bookmarks);
    }
  }, [user?.bookmarks]);

  useEffect(() => {
    const fetchPostedRecipes = async () => {
      try {
        const { data } = await api.get<Recipe[]>("/recipes");
        const userRecipes = data.filter(
          (r) => r.postedBy._id === user?._id
        );
        setPostedRecipes(userRecipes);
      } catch (err) {
        console.error(err);
      } finally {
        setPostedLoading(false);
      }
    };
    fetchPostedRecipes();
  }, [user?._id]);

  useEffect(() => {
    if (!selectedRecipe) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRecipe(null);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedRecipe]);

  if (!user) return null;

  const toggleBookmark = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    try {
      setRemovingIds((prev) => new Set(prev).add(recipeId));
      await api.put(`/recipes/${recipeId}/bookmark`);
      await refreshUser();
      setTimeout(() => {
        setBookmarkedRecipes((prev) => prev.filter((r) => r._id !== recipeId));
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(recipeId);
          return next;
        });
      }, 400);
    } catch (err) {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(recipeId);
        return next;
      });
      console.error(err);
    }
  };

  return (
    <>
      {/* PROFILE HEADER */}
      <section style={{ background: "var(--primary-color)", padding: "60px 0" }}>
        <div
          className="section_content"
          style={{ display: "flex", alignItems: "center", gap: "40px" }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "var(--secondary-color)",
              border: "4px solid var(--secondary-color)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "var(--white-color)",
                fontSize: "2.5rem",
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2
              style={{
                color: "var(--white-color)",
                fontSize: "var(--font-size-xx1)",
                fontWeight: "bold",
              }}
            >
              {user.name}
            </h2>
            <p
              style={{
                color: "var(--secondary-color)",
                fontSize: "var(--font-size-m)",
                marginTop: "8px",
              }}
            >
              {user.email}
            </p>
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "var(--white-color)",
                    fontSize: "var(--font-size-xl)",
                    fontWeight: "bold",
                  }}
                >
                  {bookmarkedRecipes.length}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "var(--font-size-s)",
                  }}
                >
                  Saved Recipes
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/create-recipe")}
              style={{
                marginTop: "20px",
                padding: "10px 24px",
                backgroundColor: "var(--secondary-color)",
                color: "var(--primary-color)",
                border: "none",
                borderRadius: "var(--border-radius-m)",
                fontSize: "var(--font-size-m)",
                fontWeight: "var(--font-weight-semibold)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--white-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--secondary-color)";
              }}
            >
              Post a Recipe
            </button>
          </div>
        </div>
      </section>

      {/* MY RECIPES SECTION */}
      <section className="menu_section" style={{ paddingBottom: "60px" }}>
        <h2 className="section_title">My Recipes</h2>
        <div className="section_content">
          {postedLoading ? (
            <p style={{ textAlign: "center", color: "var(--primary-color)",
              minHeight: "100px", display: "flex", alignItems: "center",
              justifyContent: "center" }}>
              Loading your recipes...
            </p>
          ) : postedRecipes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "4rem" }}>👨‍🍳</div>
              <p style={{ color: "var(--primary-color)",
                fontSize: "var(--font-size-l)",
                fontWeight: "var(--font-weight-semibold)",
                marginTop: "16px" }}>
                No recipes posted yet
              </p>
              <p style={{ color: "#666", fontSize: "var(--font-size-m)",
                marginTop: "8px" }}>
                Share your first recipe with the community
              </p>
              <button
                onClick={() => navigate("/create-recipe")}
                style={{
                  background: "var(--secondary-color)",
                  color: "var(--primary-color)",
                  borderRadius: "var(--border-radius-m)",
                  padding: "10px 26px",
                  fontWeight: "var(--font-weight-medium)",
                  marginTop: "24px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "var(--font-size-m)",
                }}
              >
                Post Your First Recipe
              </button>
            </div>
          ) : (
            <ul className="menu_list">
              {postedRecipes.map((recipe) => (
                <li
                  className="menu_item"
                  key={recipe._id}
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <img
                    className="menu_image"
                    src={recipe.image}
                    alt={recipe.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <p className="name">{recipe.name}</p>
                  <div className="recipe_content">
                    <p className="cuisine">{recipe.cuisine} Cuisine</p>
                    <div className="recipe_meta">
                      <span className="time">
                        ⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                      </span>
                      <span className="difficulty">{recipe.difficulty}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* BOOKMARKED RECIPES SECTION */}
      <section className="menu_section" style={{ paddingBottom: "60px" }}>
        <h2 className="section_title">Saved Recipes</h2>
        <div className="section_content">
          {bookmarkedRecipes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "4rem" }}>🔖</div>
              <p
                style={{
                  color: "var(--primary-color)",
                  fontSize: "var(--font-size-l)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginTop: "16px",
                }}
              >
                No saved recipes yet
              </p>
              <p
                style={{
                  color: "#666",
                  fontSize: "var(--font-size-m)",
                  marginTop: "8px",
                }}
              >
                Browse recipes and click ☆ to save your favorites
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "var(--secondary-color)",
                  color: "var(--primary-color)",
                  borderRadius: "var(--border-radius-m)",
                  padding: "10px 26px",
                  fontWeight: "var(--font-weight-medium)",
                  marginTop: "24px",
                }}
              >
                Explore Recipes
              </button>
            </div>
          ) : (
            <ul className="menu_list">
              {bookmarkedRecipes.map((recipe) => (
                <li
                  className="menu_item"
                  key={recipe._id}
                  onClick={() => !removingIds.has(recipe._id) && setSelectedRecipe(recipe)}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    opacity: removingIds.has(recipe._id) ? 0 : 1,
                    transform: removingIds.has(recipe._id) ? "scale(0.95)" : "scale(1)",
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}
                >
                  <button
                    onClick={(e) => toggleBookmark(e, recipe._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "1.5rem",
                      zIndex: 2,
                      color: "var(--secondary-color)",
                      background: "rgba(255,255,255,0.85)",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ★
                  </button>
                  <img
                    className="menu_image"
                    src={recipe.image}
                    alt={recipe.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <p className="name">{recipe.name}</p>
                  <div className="recipe_content">
                    <p className="cuisine">{recipe.cuisine} Cuisine</p>
                    <div className="recipe_meta">
                      <span className="time">
                        ⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                      </span>
                      <span className="difficulty">{recipe.difficulty}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* RECIPE MODAL */}
      {selectedRecipe && (
        <div
          className="recipe_modal"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          onClick={() => setSelectedRecipe(null)}
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close_modal"
              onClick={() => setSelectedRecipe(null)}
            >
              &times;
            </span>
            <div className="recipe_detail">
              <div className="recipe_detail_header">
                <img
                  className="recipe_detail_image"
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                />
                <h2 className="recipe_detail_title">{selectedRecipe.name}</h2>
                <div className="recipe_detail_meta">
                  <span className="meta_item">
                    🕐 Prep: {selectedRecipe.prepTimeMinutes} min
                  </span>
                  <span className="meta_item">
                    🍳 Cook: {selectedRecipe.cookTimeMinutes} min
                  </span>
                  <span className="meta_item">
                    🍽 Servings: {selectedRecipe.servings}
                  </span>
                  <span className="meta_item">
                    🔥 {selectedRecipe.caloriesPerServing} cal
                  </span>
                  <span className="meta_item">
                    📊 {selectedRecipe.difficulty}
                  </span>
                  <span className="meta_item">🌍 {selectedRecipe.cuisine}</span>
                  <span className="meta_item">⭐ {selectedRecipe.rating}</span>
                </div>
              </div>
              <div className="recipe_detail_sections">
                <div className="detail_section">
                  <h3 className="detail_section_title">Ingredients</h3>
                  <ul className="ingredients_list">
                    {selectedRecipe.ingredients.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail_section">
                  <h3 className="detail_section_title">Instructions</h3>
                  <ol className="instructions_list">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
