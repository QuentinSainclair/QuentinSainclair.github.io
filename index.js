//Filtres
function gererFiltres() {
  const checkboxes = document.querySelectorAll('.form-check input[type="checkbox"]');
  const categoriesSelectionnees = [];

  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      categoriesSelectionnees.push(checkbox.getAttribute('data-categorie'));
    }
  });

  const inputPricesMin = document.querySelectorAll('#price-min');
  const inputPricesMax = document.querySelectorAll('#price-max');
  const prixSelectionnesMin = [];
  const prixSelectionnesMax = [];

  inputPricesMin.forEach(function(input) {
    if (input.value !== '') {
      prixSelectionnesMin.push(input.value);
    }
  });

  inputPricesMax.forEach(function(input) {
    if (input.value !== '') {
      prixSelectionnesMax.push(input.value);
    }
  });

  const inputNotesMin = document.querySelectorAll('#note-min');
  const inputNotesMax = document.querySelectorAll('#note-max');
  const noteSelectionneeMin = [];
  const noteSelectionneeMax = [];

  inputNotesMin.forEach(function(input) {
    if (input.value !== '') {
      noteSelectionneeMin.push(input.value);
    }
  });

  inputNotesMax.forEach(function(input) {
    if (input.value !== '') {
      noteSelectionneeMax.push(input.value);
    }
  });

  const produits = document.querySelectorAll('.card');
  produits.forEach(function(produit) {
    const categoriesProduit = produit.getAttribute('data-categorie').split(' ');
    const prixProduit = parseInt(produit.querySelector('p').getAttribute('data-prix'));
    const noteProduit = parseInt(produit.querySelector('p').getAttribute('data-note'));

    const afficherProduitCategories = categoriesSelectionnees.length === 0 || categoriesSelectionnees.some(function(categorie) {
      return categoriesProduit.includes(categorie) || categorie === 'Tous';
    });

    const afficherProduitPrix = (prixSelectionnesMin.length === 0 || prixProduit >= Math.min(...prixSelectionnesMin)) &&
      (prixSelectionnesMax.length === 0 || prixProduit <= Math.max(...prixSelectionnesMax));

    const afficherProduitNote = (noteSelectionneeMin.length === 0 || noteProduit >= Math.min(...noteSelectionneeMin)) &&
    (noteSelectionneeMax.length === 0 || noteProduit <= Math.max(...noteSelectionneeMax));

    produit.style.display = afficherProduitCategories && afficherProduitPrix && afficherProduitNote ? 'block' : 'none';
  });
}


// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || {}; // Récupère le panier depuis le localStorage, ou initialise un panier vide

// Fonction pour sauvegarder le panier dans le localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Fonction pour ajouter un produit au panier
function addToCart(product) {
  let productId = product.id;

  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = { ...product, quantity: 1 };
  }

  updateCartDisplay();
  saveCartToLocalStorage(); // Sauvegarde le panier dans le localStorage
}

// Fonction pour supprimer un produit du panier
function removeFromCart(productId) {
  delete cart[productId];

  updateCartDisplay();
  saveCartToLocalStorage(); // Sauvegarde le panier dans le localStorage
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
function updateQuantity(productId, newQuantity) {
  cart[productId].quantity = newQuantity;

  updateCartDisplay();
  saveCartToLocalStorage(); // Sauvegarde le panier dans le localStorage
}

// Fonction pour augmenter la quantité d'un produit
function increaseQuantity(productId) {
  cart[productId].quantity += 1;

  updateCartDisplay();
  saveCartToLocalStorage(); // Sauvegarde le panier dans le localStorage
}

// Fonction pour diminuer la quantité d'un produit
function decreaseQuantity(productId) {
  if (cart[productId].quantity > 1) {
    cart[productId].quantity -= 1;

    updateCartDisplay();
    saveCartToLocalStorage(); // Sauvegarde le panier dans le localStorage
  }
}

// Fonction pour mettre à jour l'affichage du panier
function updateCartDisplay() {
  let cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = ''; // Vide le contenu précédent du conteneur

  let total = 0;

  for (let productId in cart) {
    let product = cart[productId];
    let productElement = document.createElement('div');

    // Crée l'élément HTML pour le produit
    productElement.classList.add('cart-item');
    productElement.innerHTML = `
      <div class="item-details">
        <img src="${product.image}" alt="${product.name}" class="image-panier">
        <div class="orga-panier-flex">
          <div>
          <p>${product.name}</p>
          <p>Prix total : ${(product.price * product.quantity).toFixed(2)}€</p>
          </div>
          <div class="quantity-control">
            <button class="decrease-quantity-btn" data-product-id="${productId}">-</button>
            <input type="number" class="quantity-input" value="${product.quantity}" min="1" step="1" data-product-id="${productId}">
            <button class="increase-quantity-btn" data-product-id="${productId}">+</button>
          </div>
        </div>
      </div>
      <button class="removeItemBtn" data-product-id="${productId}">Supprimer</button>
      <hr>
    `;

    total += product.price * product.quantity;

    // Ajoute l'écouteur d'événement pour supprimer un produit du panier
    let removeItemBtn = productElement.querySelector('.removeItemBtn');
    removeItemBtn.addEventListener('click', function (event) {
      let productId = event.target.getAttribute('data-product-id');
      removeFromCart(productId);
    });

    // Ajoute l'écouteur d'événement pour augmenter la quantité d'un produit
    let increaseQuantityBtn = productElement.querySelector('.increase-quantity-btn');
    increaseQuantityBtn.addEventListener('click', function (event) {
      let productId = event.target.getAttribute('data-product-id');
      increaseQuantity(productId);
    });

    // Ajoute l'écouteur d'événement pour diminuer la quantité d'un produit
    let decreaseQuantityBtn = productElement.querySelector('.decrease-quantity-btn');
    decreaseQuantityBtn.addEventListener('click', function (event) {
      let productId = event.target.getAttribute('data-product-id');
      decreaseQuantity(productId);
    });

    // Ajoute l'écouteur d'événement pour modifier la quantité d'un produit directement
    let quantityInput = productElement.querySelector('.quantity-input');
    quantityInput.addEventListener('change', function (event) {
      let productId = event.target.getAttribute('data-product-id');
      let newQuantity = parseInt(event.target.value, 10);
      updateQuantity(productId, newQuantity);
    });

    // Ajoute le produit au conteneur du panier
    cartItemsContainer.appendChild(productElement);
  }

  let totalElement = document.getElementById('total');
  totalElement.textContent = total.toFixed(2) + '€';

  if (Object.keys(cart).length === 0) {
    let emptyCartMessage = document.createElement('p');
    emptyCartMessage.textContent = 'Votre panier est vide';
    cartItemsContainer.appendChild(emptyCartMessage);
  }
}

// Exemple d'événement pour ajouter un produit au panier
let addToCartButtons = document.querySelectorAll('.addToCartBtn');

addToCartButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    let product = {
      id: button.getAttribute('data-product-id'),
      name: button.getAttribute('data-product-name'),
      image: button.getAttribute('data-product-image'),
      price: parseFloat(button.getAttribute('data-product-price')),
    };

    addToCart(product);
  });
});

// Exemple d'événement pour réinitialiser le panier
let resetCartBtn = document.getElementById('resetCartBtn');
resetCartBtn.addEventListener('click', function () {
  cart = {};
  updateCartDisplay();
  saveCartToLocalStorage(); // Sauvegarde le panier vide dans le localStorage
});

// Exemple d'événement pour valider le panier
let checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', function () {
  // Logique pour valider le panier, effectuer le paiement, etc.
});

// Met à jour l'affichage du panier au chargement de la page
updateCartDisplay();

//Corrections sur les clics
// Récupère la référence vers le contenu du panier
let cartContent = document.querySelector('.dropdown-menu');

// Ajoute un gestionnaire d'événements de clic sur le contenu du panier
cartContent.addEventListener('click', function(event) {
  event.stopPropagation();
});

// Fonction pour fermer le panier
function closeCart() {
  let cartDropdown = document.getElementById('cartDropdown');
  cartDropdown.classList.remove('show');
}

// Récupère la référence vers le bouton de fermeture du panier
let closeButton = document.querySelector('.btn-close');

// Ajoute un gestionnaire d'événements de clic sur la croix pour fermer le panier
closeButton.addEventListener('click', function() {
  closeCart();
});

