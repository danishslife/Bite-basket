// server/controllers/recipeController.js
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

/**
 * Get all recipes
 * @route   GET /api/recipes
 * @method  GET
 * @access  Public
 */
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("postedBy", "name email");

    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single recipe by id
 * @route   GET /api/recipes/:id
 * @method  GET
 * @access  Public
 */
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new recipe
 * @route   POST /api/recipes
 * @method  POST
 * @access  Private
 */
const createRecipe = async (req, res) => {
  try {
    const {
      name,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing,
      tags,
      mealType,
      image,
    } = req.body;

    const recipe = await Recipe.create({
      name,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing,
      tags,
      mealType,
      image,
      postedBy: req.user._id,
    });

    return res.status(201).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Update a recipe
 * @route   PUT /api/recipes/:id
 * @method  PUT
 * @access  Private
 */
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this recipe" });
    }

    Object.assign(recipe, req.body);

    const updatedRecipe = await recipe.save();

    return res.status(200).json(updatedRecipe);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a recipe
 * @route   DELETE /api/recipes/:id
 * @method  DELETE
 * @access  Private
 */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();

    return res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Bookmark or unbookmark a recipe for the logged in user
 * @route   PUT /api/recipes/:id/bookmark
 * @method  PUT
 * @access  Private
 */
const bookmarkRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = user.bookmarks.some(
      (bookmarkId) => bookmarkId.toString() === req.params.id,
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmarkId) => bookmarkId.toString() !== req.params.id,
      );
      await user.save();

      return res.status(200).json({ message: "Recipe removed from bookmarks" });
    }

    user.bookmarks.push(req.params.id);
    await user.save();

    return res.status(200).json({ message: "Recipe bookmarked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  bookmarkRecipe,
};
