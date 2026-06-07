import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { Recipe } from "../types";
import burgerImg from "../assets/burger-frenchfries.png";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const recipeSectionRef = useRef<HTMLElement>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await api.get<Recipe[]>("/recipes");
        setRecipes(data);
      } catch {
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (user?.bookmarks) {
      setBookmarkedIds(new Set(user.bookmarks.map((b) => b._id)));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedRecipe) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRecipe(null);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedRecipe]);

  const toggleBookmark = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.put(`/recipes/${recipeId}/bookmark`);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(recipeId)) {
          next.delete(recipeId);
        } else {
          next.add(recipeId);
        }
        return next;
      });
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response: { status: number } }).response.status === 401
      ) {
        navigate("/login");
      }
    }
  };

  const scrollToRecipes = () => {
    recipeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero_section">
        <div className="section_content">
          <div className="hero_details">
            <span
              className="subtitle_tag"
              style={{
                color: "var(--secondary-color)",
                fontSize: "var(--font-size-m)",
              }}
            >
              Explore. Cook. Enjoy.
            </span>
            <h2
              className="title"
              style={{ fontFamily: "'Miniver', sans-serif" }}
            >
              BiteBasket
            </h2>
            <h3 className="subtitle">Your Recipe Discovery Hub</h3>
            <p className="description">
              Discover thousands of recipes from around the world. From quick
              weeknight dinners to weekend feasts, find your next favorite meal
              and save it to your collection.
            </p>
            <div className="buttons">
              <button className="button" onClick={scrollToRecipes}>
                Explore Recipes
              </button>
              {user ? (
                <button
                  className="button contact_us"
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </button>
              ) : (
                <button
                  className="button contact_us"
                  onClick={() => navigate("/login")}
                >
                  Join Free
                </button>
              )}
            </div>
          </div>
          <div className="image_wrapper">
            <img
              src={burgerImg}
              alt="Delicious food"
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="menu_section" ref={recipeSectionRef}>
        <h2 className="section_title">Our Recipes</h2>
        <div className="section_content">
          {loading ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--primary-color)",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading recipes...
            </p>
          ) : error ? (
            <p
              style={{
                textAlign: "center",
                color: "red",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {error}
            </p>
          ) : (
            <ul className="menu_list">
              {recipes.map((recipe) => (
                <li
                  className="menu_item"
                  key={recipe._id}
                  onClick={() => setSelectedRecipe(recipe)}
                  style={{ cursor: "pointer", position: "relative" }}
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
                    {bookmarkedIds.has(recipe._id) ? "★" : "☆"}
                  </button>
                  <img
                    className="menu_image"
                    src={recipe.image}
                    alt={recipe.name}
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

      {/* ABOUT SECTION */}
      <section className="about_section">
        <div className="section_content">
          <div className="about_image_wrapper">
            <img
              className="about-image"
              src="https://cdn.dummyjson.com/recipe-images/22.webp"
              alt="About BiteBasket"
            />
          </div>
          <div className="about_details">
            <h2 className="section_title">About Us</h2>
            <p className="about_text">
              BiteBasket is a community-driven recipe platform where food lovers
              share their favorite dishes. Whether you're a seasoned chef or
              just starting your culinary journey, you'll find inspiration for
              every meal, every day.
            </p>
            <ul className="socail_link_list">
              <li>
                <a href="#" className="social_link">
                  🌐
                </a>
              </li>
              <li>
                <a href="#" className="social_link">
                  🐦
                </a>
              </li>
              <li>
                <a href="#" className="social_link">
                  📸
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
