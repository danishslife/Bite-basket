// server/seed.js
import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Recipe from "./models/Recipe.js";
import User from "./models/User.js";

const SEED_USER = {
  name: "BiteBasket",
  email: "seed@bitebasket.com",
  password: "seedpassword123",
};

const seedDatabase = async () => {
  try {
    await connectDB();

    const response = await fetch("https://dummyjson.com/recipes?limit=50");

    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status}`);
    }

    const data = await response.json();
    const fetchedRecipes = data.recipes || [];

    let seedUser = await User.findOne({ email: SEED_USER.email });

    if (!seedUser) {
      seedUser = await User.create(SEED_USER);
      console.log(`Created seed user: ${seedUser.email}`);
    }

    const mappedRecipes = fetchedRecipes.map((recipe) => ({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      caloriesPerServing: recipe.caloriesPerServing,
      tags: recipe.tags,
      mealType: recipe.mealType,
      image: recipe.image,
      rating: recipe.rating,
      postedBy: seedUser._id,
      isSeeded: true,
    }));

    await Recipe.deleteMany({ isSeeded: true });

    const inserted = await Recipe.insertMany(mappedRecipes);

    console.log(`Seeded ${inserted.length} recipes`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
