// server/models/Recipe.js
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    prepTimeMinutes: { type: Number, required: true },
    cookTimeMinutes: { type: Number, required: true },
    servings: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    cuisine: { type: String, required: true },
    caloriesPerServing: { type: Number },
    tags: [{ type: String }],
    mealType: [{ type: String }],
    image: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
