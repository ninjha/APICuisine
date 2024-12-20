document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour réinitialiser les cases à cocher
    const resetFormOnLoad = function () {
      const checkboxes = document.querySelectorAll(
        '#ingredients-list input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Réinitialise chaque case à cocher
      });
    };
    // Appel de la fonction pour réinitialiser les cases à cocher au chargement
    resetFormOnLoad();
  
    // Liste pour stocker les ingrédients sélectionnés
    let selectedIngredients = [];
  
    // Fonction pour gérer la sélection d'ingrédients
    const handleIngredientSelection = function () {
      const checkboxes = document.querySelectorAll(
        '#ingredients-list input[type="checkbox"]'
      );
  
      // Ajoute un événement "change" à chaque case à cocher
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          const ingredient = checkbox.value;
  
          // Ajouter ou retirer l'ingrédient de la liste en fonction de l'état de la case
          if (checkbox.checked) {
            selectedIngredients.push(ingredient); // Ajoute l'ingrédient à la liste
          } else {
            // Retire l'ingrédient de la liste si la case est décochée
            selectedIngredients = selectedIngredients.filter(
              (item) => item !== ingredient
            );
          }
  
          // Affiche la liste d'ingrédients sélectionnés pour vérification
          console.log("Ingrédients sélectionnés :", selectedIngredients);
        });
      });
    };
  
    // Appel de la fonction pour gérer la sélection d'ingrédients
    handleIngredientSelection();
  
    // Clé API pour Spoonacular (remplace par ta propre clé)
    const apiKey = "0278654419c8486382be9d0379a1206b";
    // Fonction pour rechercher des recettes par ingrédients sélectionnés //"ne sert pas à grand chose vu qu'on fait un live search, cette section du code est pertinente avec boutons recherche"
    const searchRecipesByIngredients = function () {
      if (selectedIngredients.length === 0) {
        alert("Veuillez sélectionner au moins un ingrédient pour la recherche.");
        return;
      }
  
      // Préparation de l'URL pour la requête API
      const ingredientsQuery = selectedIngredients.join(",+");
      const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsQuery}&number=10&apiKey=${apiKey}`;
      console.log(apiUrl);
  
      // Requête asynchrone pour obtenir les recettes
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          displayRecipes(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la recherche des recettes :", error);
          displayError(
            "Une erreur s'est produite lors de la recherche des recettes."
          );
        });
    };
    const srcBtn = document.querySelector("#search-button");
    const srcForm = document.querySelector("#recipe-search");
  
    srcForm.addEventListener("input", function () {
      let isWriting = true;
  
      if (srcForm.value.length >= 3) {
        let writingLast = srcForm.value;
        setTimeout(() => {
          const apiUrlSug = `https://api.spoonacular.com/recipes/autocomplete?apiKey=${apiKey}&number=10&query=${srcForm.value
            .split(" ")
            .join(",")}`;
          if (srcForm.value == writingLast) {
            isWriting = false;
            fetch(apiUrlSug)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                displayRecipes(data);
              });
          }
        }, 2000);
      }
    });
  
    srcBtn.addEventListener("click", function () {
      searchRecipesByIngredients();
    });
    // Fonction pour afficher les recettes dans la section correspondante
    const displayRecipes = function (recipes) {
      const recipesList = document.querySelector("#recipes-list");
      recipesList.innerHTML = ""; // Vide la liste avant d'ajouter les nouvelles recettes
  
      if (recipes.length === 0) {
        displayError("Aucune recette trouvée avec les ingrédients sélectionnés.");
        return;
      }
  
      // Parcourt chaque recette et l'ajoute sous forme de carte
      recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
                  <h3>${recipe.title}</h3>
                  <img src="${recipe.image}" alt="${recipe.title}">
              `;
        recipesList.appendChild(recipeCard);
      });
    };
  
    // Fonction pour afficher un message d'erreur
    const displayError = function (message) {
      const recipesList = document.querySelector("#recipes-list");
      recipesList.innerHTML = `<p>${message}</p>`;
    };
  
    // Événement pour rechercher des recettes par ingrédients lors du clic sur le bouton de recherche
    const searchButton = document.querySelector(
      "#search-button-container button"
    );
    if (searchButton) {
      searchButton.addEventListener("click", searchRecipesByIngredients);
    }
  });