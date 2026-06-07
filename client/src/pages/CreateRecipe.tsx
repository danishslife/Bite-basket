import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

interface RecipeFormData {
  name: string;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  rating: number;
  tags: string;
  mealType: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

const initialFormData: RecipeFormData = {
  name: "",
  cuisine: "",
  difficulty: "Easy",
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 0,
  caloriesPerServing: 0,
  rating: 0,
  tags: "",
  mealType: "",
  image: "",
  ingredients: ["", "", ""],
  instructions: ["", "", ""],
};

export const CreateRecipe = () => {
  useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RecipeFormData>({ ...initialFormData, ingredients: ["", "", ""], instructions: ["", "", ""] });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof RecipeFormData>(key: K, value: RecipeFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...formData.ingredients];
    updated[index] = value;
    updateField("ingredients", updated);
  };

  const addIngredient = () => updateField("ingredients", [...formData.ingredients, ""]);

  const removeIngredient = (index: number) => {
    updateField("ingredients", formData.ingredients.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...formData.instructions];
    updated[index] = value;
    updateField("instructions", updated);
  };

  const addInstruction = () => updateField("instructions", [...formData.instructions, ""]);

  const removeInstruction = (index: number) => {
    updateField("instructions", formData.instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.cuisine.trim() || !formData.difficulty || !formData.prepTimeMinutes || !formData.cookTimeMinutes || !formData.servings) {
      setError("Please fill in all required fields.");
      return;
    }

    const filteredIngredients = formData.ingredients.filter((i) => i.trim());
    const filteredInstructions = formData.instructions.filter((i) => i.trim());

    if (filteredIngredients.length < 1) {
      setError("Please add at least one ingredient.");
      return;
    }
    if (filteredInstructions.length < 1) {
      setError("Please add at least one instruction.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      cuisine: formData.cuisine.trim(),
      difficulty: formData.difficulty,
      prepTimeMinutes: Number(formData.prepTimeMinutes),
      cookTimeMinutes: Number(formData.cookTimeMinutes),
      servings: Number(formData.servings),
      caloriesPerServing: Number(formData.caloriesPerServing),
      rating: Number(formData.rating),
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      mealType: formData.mealType.split(",").map((t) => t.trim()).filter(Boolean),
      image: formData.image.trim(),
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    };

    setLoading(true);
    try {
      await api.post("/recipes", payload);
      navigate("/");
    } catch {
      setError("Failed to share recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
    border: `2px solid ${focusedField === field ? "var(--secondary-color)" : "#eee"}`,
    borderRadius: "var(--border-radius-s)",
    fontSize: "var(--font-size-s)",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    color: "var(--dark-color)",
    fontSize: "var(--font-size-s)",
    fontWeight: "var(--font-weight-semibold)" as unknown as number,
  };

  const sectionHeadingStyle = (first?: boolean): React.CSSProperties => ({
    color: "var(--primary-color)",
    fontSize: "var(--font-size-m)",
    fontWeight: "var(--font-weight-semibold)" as unknown as number,
    paddingBottom: 8,
    borderBottom: "2px solid var(--secondary-color)",
    marginBottom: 20,
    marginTop: first ? 0 : 32,
  });

  const helperTextStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "#888",
    marginTop: 4,
  };

  const isValidImageUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div style={{ backgroundColor: "var(--light-pink-color)", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ backgroundColor: "var(--primary-color)", padding: "50px 0" }}>
        <div className="section_content" style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Miniver', cursive",
              color: "var(--secondary-color)",
              fontSize: "3rem",
              fontWeight: 400,
            }}
          >
            Share Your Recipe
          </h1>
          <p
            style={{
              color: "var(--white-color)",
              fontSize: "var(--font-size-m)",
              marginTop: 8,
            }}
          >
            Share your favorite dish with the BiteBasket community
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--white-color)",
          borderRadius: "var(--border-radius-s)",
          maxWidth: 800,
          margin: "0 auto",
          padding: 40,
          marginTop: -30,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        {/* SECTION A - Basic Info */}
        <h3 style={sectionHeadingStyle(true)}>Basic Info</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Recipe Name *</label>
            <input
              type="text"
              placeholder="e.g. Chicken Biryani"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("name")}
            />
          </div>
          <div>
            <label style={labelStyle}>Cuisine *</label>
            <input
              type="text"
              placeholder="e.g. Pakistani, Italian, Mexican"
              value={formData.cuisine}
              onChange={(e) => updateField("cuisine", e.target.value)}
              onFocus={() => setFocusedField("cuisine")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("cuisine")}
            />
          </div>
          <div>
            <label style={labelStyle}>Difficulty *</label>
            <select
              value={formData.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value as RecipeFormData["difficulty"])}
              onFocus={() => setFocusedField("difficulty")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("difficulty")}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* SECTION B - Time & Servings */}
        <h3 style={sectionHeadingStyle()}>Time & Servings</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          <div>
            <label style={labelStyle}>Prep Time (mins) *</label>
            <input
              type="number"
              min={1}
              placeholder="minutes"
              value={formData.prepTimeMinutes || ""}
              onChange={(e) => updateField("prepTimeMinutes", Number(e.target.value))}
              onFocus={() => setFocusedField("prepTimeMinutes")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("prepTimeMinutes")}
            />
          </div>
          <div>
            <label style={labelStyle}>Cook Time (mins) *</label>
            <input
              type="number"
              min={1}
              placeholder="minutes"
              value={formData.cookTimeMinutes || ""}
              onChange={(e) => updateField("cookTimeMinutes", Number(e.target.value))}
              onFocus={() => setFocusedField("cookTimeMinutes")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("cookTimeMinutes")}
            />
          </div>
          <div>
            <label style={labelStyle}>Servings *</label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 4"
              value={formData.servings || ""}
              onChange={(e) => updateField("servings", Number(e.target.value))}
              onFocus={() => setFocusedField("servings")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("servings")}
            />
          </div>
        </div>

        {/* SECTION C - Optional Details */}
        <h3 style={sectionHeadingStyle()}>Optional Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={labelStyle}>Calories per Serving (optional)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 350"
              value={formData.caloriesPerServing || ""}
              onChange={(e) => updateField("caloriesPerServing", Number(e.target.value))}
              onFocus={() => setFocusedField("caloriesPerServing")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("caloriesPerServing")}
            />
          </div>
          <div>
            <label style={labelStyle}>Rating (optional)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              placeholder="0.0 - 5.0"
              value={formData.rating || ""}
              onChange={(e) => updateField("rating", Number(e.target.value))}
              onFocus={() => setFocusedField("rating")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("rating")}
            />
          </div>
        </div>

        {/* SECTION D - Tags & Meal Type */}
        <h3 style={sectionHeadingStyle()}>Tags & Meal Type</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={labelStyle}>Tags (optional)</label>
            <input
              type="text"
              placeholder="e.g. Spicy, Comfort Food, Quick"
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              onFocus={() => setFocusedField("tags")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("tags")}
            />
            <p style={helperTextStyle}>Separate tags with commas</p>
          </div>
          <div>
            <label style={labelStyle}>Meal Type (optional)</label>
            <input
              type="text"
              placeholder="e.g. Breakfast, Lunch, Dinner"
              value={formData.mealType}
              onChange={(e) => updateField("mealType", e.target.value)}
              onFocus={() => setFocusedField("mealType")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("mealType")}
            />
            <p style={helperTextStyle}>Separate meal types with commas</p>
          </div>
        </div>

        {/* SECTION E - Image URL */}
        <h3 style={sectionHeadingStyle()}>Image</h3>
        <div>
          <label style={labelStyle}>Image URL (optional)</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) => updateField("image", e.target.value)}
            onFocus={() => setFocusedField("image")}
            onBlur={() => setFocusedField(null)}
            style={inputStyle("image")}
          />
          <p style={helperTextStyle}>Paste a direct link to an image of your dish</p>
          {isValidImageUrl(formData.image) && (
            <img
              src={formData.image}
              alt="Recipe preview"
              style={{
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: "var(--border-radius-s)",
                width: "100%",
                marginTop: 8,
              }}
            />
          )}
        </div>

        {/* SECTION F - Ingredients */}
        <h3 style={sectionHeadingStyle()}>Ingredients</h3>
        <label style={{ ...labelStyle, marginBottom: 12 }}>Ingredients (required)</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <input
              type="text"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              onFocus={() => setFocusedField(`ingredient-${index}`)}
              onBlur={() => setFocusedField(null)}
              style={{ ...inputStyle(`ingredient-${index}`), flex: 1 }}
            />
            {formData.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                style={{
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#e53935",
                  color: "var(--white-color)",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          style={{
            border: "2px solid var(--secondary-color)",
            color: "var(--secondary-color)",
            backgroundColor: "transparent",
            borderRadius: "var(--border-radius-m)",
            padding: "8px 20px",
            cursor: "pointer",
            fontSize: "var(--font-size-s)",
            fontFamily: "inherit",
            fontWeight: "var(--font-weight-semibold)" as unknown as number,
            marginTop: 4,
          }}
        >
          Add Ingredient
        </button>

        {/* SECTION G - Instructions */}
        <h3 style={sectionHeadingStyle()}>Instructions</h3>
        <label style={{ ...labelStyle, marginBottom: 12 }}>Instructions (required)</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <label style={{ ...labelStyle, fontSize: "0.85rem", color: "var(--primary-color)" }}>
              Step {index + 1}
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <textarea
                rows={3}
                placeholder={`Describe step ${index + 1}`}
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                onFocus={() => setFocusedField(`instruction-${index}`)}
                onBlur={() => setFocusedField(null)}
                style={{ ...inputStyle(`instruction-${index}`), flex: 1, resize: "vertical" }}
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  style={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "#e53935",
                    color: "var(--white-color)",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "inherit",
                    marginTop: 6,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          style={{
            border: "2px solid var(--secondary-color)",
            color: "var(--secondary-color)",
            backgroundColor: "transparent",
            borderRadius: "var(--border-radius-m)",
            padding: "8px 20px",
            cursor: "pointer",
            fontSize: "var(--font-size-s)",
            fontFamily: "inherit",
            fontWeight: "var(--font-weight-semibold)" as unknown as number,
            marginTop: 4,
          }}
        >
          Add Step
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "var(--secondary-color)",
            color: "var(--primary-color)",
            border: "none",
            borderRadius: "var(--border-radius-m)",
            padding: 14,
            fontSize: "var(--font-size-m)",
            fontWeight: "var(--font-weight-bold)" as unknown as number,
            marginTop: 32,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            opacity: loading ? 0.7 : 1,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "var(--primary-color)";
              e.currentTarget.style.color = "var(--white-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "var(--secondary-color)";
              e.currentTarget.style.color = "var(--primary-color)";
            }
          }}
        >
          {loading ? "Sharing..." : "Share Recipe"}
        </button>

        {error && (
          <p
            style={{
              color: "#e53935",
              fontSize: "var(--font-size-s)",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
