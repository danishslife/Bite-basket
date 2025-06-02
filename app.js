// Select the elements
const menu = document.querySelector(".nav_menu");
const openBtn = document.getElementById("menu_open_button");
const closeBtn = document.getElementById("menu_close_button");
const menuList = document.getElementById("menu_list");
const navLinks = document.querySelectorAll(".nav_link");

// Function to open/close the mobile menu
function toggleMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  document.body.classList.toggle("show_mobile_menu");
}

// Open/close menu when clicking the menu button
openBtn.addEventListener("click", toggleMenu);

// Close menu when clicking the close button
closeBtn.addEventListener("click", toggleMenu);


// Add click event to each navigation link to close the menu
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // If the mobile menu is open, close it
    if (document.body.classList.contains("show_mobile_menu")) {
      document.body.classList.remove("show_mobile_menu");
    }
  });
});

// Prevent clicks inside the menu from closing it
menu.addEventListener("click", function (event) {
  // Stop the event from reaching the document
  event.stopPropagation();
});

// Close menu when clicking outside
document.addEventListener("click", function () {
  // Check if the mobile menu is open
  if (document.body.classList.contains("show_mobile_menu")) {
    document.body.classList.remove("show_mobile_menu");
  }
});

// Fetch recipes from the API
fetch("https://dummyjson.com/recipes")
  .then((response) => response.json())
  .then((data) => {
    // Store the recipes data globally so we can access it later
    window.recipesData = data.recipes;

    let output = "";
    data.recipes.forEach((recipe) => {
      output += `
        <li class="menu_item" data-recipe-id="${recipe.id}" onclick="showRecipeDetails(${recipe.id})">
            <img src=${recipe.image} alt=${recipe.name} class="menu_image">
            <div class="recipe_content">
                <h3 class="name">${recipe.name}</h3>
                <p class="cuisine">${recipe.cuisine} Cuisine</p>
                <div class="recipe_meta">
                    <span class="time"><i class="far fa-clock"></i> ${recipe.cookTimeMinutes} mins</span>
                    <span class="difficulty">${recipe.difficulty}</span>
                </div>
            </div>
        </li>
      `;
    });
    menuList.innerHTML = output;
  })
  .catch((error) => {
    menuList.innerHTML = "<li>Could not load recipes.</li>";
    console.error("Error fetching recipes:", error);
  });

// Function to show recipe details
function showRecipeDetails(recipeId) {
  // Find the recipe with the matching ID
  const recipe = window.recipesData.find((recipe) => recipe.id === recipeId);

  if (!recipe) {
    console.error("Recipe not found!");
    return;
  }

  // Get the modal and content elements
  const modal = document.getElementById("recipe_detail_modal");
  const contentContainer = document.getElementById("recipe_detail_content");

  // Create the HTML for the recipe details
  const recipeHTML = `
        <div class="recipe_detail">
            <div class="recipe_detail_header">
                <img src="${recipe.image}" alt="${
    recipe.name
  }" class="recipe_detail_image">
                <h2 class="recipe_detail_title">${recipe.name}</h2>
                
                <div class="recipe_detail_meta">
                    <span class="meta_item"><i class="far fa-clock"></i> Prep: ${
                      recipe.prepTimeMinutes
                    } mins</span>
                    <span class="meta_item"><i class="fas fa-fire"></i> Cook: ${
                      recipe.cookTimeMinutes
                    } mins</span>
                    <span class="meta_item"><i class="fas fa-utensils"></i> Servings: ${
                      recipe.servings
                    }</span>
                    <span class="meta_item"><i class="fas fa-chart-line"></i> Difficulty: ${
                      recipe.difficulty
                    }</span>
                    <span class="meta_item"><i class="fas fa-globe"></i> Cuisine: ${
                      recipe.cuisine
                    }</span>
                    <span class="meta_item"><i class="fas fa-fire-alt"></i> Calories: ${
                      recipe.caloriesPerServing
                    } per serving</span>
                </div>
                
            </div>
            
            <div class="recipe_detail_sections">
                <div class="detail_section">
                    <h3 class="detail_section_title">Ingredients</h3>
                    <ul class="ingredients_list">
                        ${recipe.ingredients
                          .map((ingredient) => `<li>${ingredient}</li>`)
                          .join("")}
                    </ul>
                </div>
                
                <div class="detail_section">
                    <h3 class="detail_section_title">Instructions</h3>
                    <ol class="instructions_list">
                        ${recipe.instructions
                          .map((instruction) => `<li>${instruction}</li>`)
                          .join("")}
                    </ol>
                </div>
            </div>
        </div>
    `;

  // Set the HTML content
  contentContainer.innerHTML = recipeHTML;

  // Show the modal
  modal.style.display = "block";

  // Prevent scrolling on the body when modal is open
  document.body.style.overflow = "hidden";
}

// Function to close recipe details
function closeRecipeDetails() {
  const modal = document.getElementById("recipe_detail_modal");
  modal.style.display = "none";

  // Re-enable scrolling on the body
  document.body.style.overflow = "auto";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("recipe_detail_modal");
  if (event.target === modal) {
    closeRecipeDetails();
  }
};
