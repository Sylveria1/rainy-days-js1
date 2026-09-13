"use strict";

//! ======================================================
//!                       STATE
//! ======================================================
let allProducts = [];
let selectedGender = "all";
let cart = [];

//* ====================== CONSTANTS =====================
const url = "https://v2.api.noroff.dev/rainy-days";

//! ======================================================
//!                      DOM ELEMENTS
//! ======================================================
const productsContainer = document.querySelector("#products-container");
const loading = document.querySelector("#loading");
const filterButtons = document.querySelectorAll(".filter-button");

//! ======================================================
//!                     FUNCTIONS
//! ======================================================

function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function addToCart(productToAdd) {
  const existingProduct = cart.find(
    (cartItem) => cartItem.id === productToAdd.id,
  );

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      ...productToAdd,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

async function fetchProducts() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();

    allProducts = result.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);

    productsContainer.innerHTML =
      '<p class="error-message">Could not load products. Please try refreshing the page.</p>';
  }
}

function renderProducts(productsToRender) {
  productsContainer.innerHTML = "";

  if (productsToRender.length === 0) {
    productsContainer.innerHTML =
      '<p class="no-results">No products found.</p>';
    return;
  }

  productsToRender.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");

    const productLink = document.createElement("a");
    productLink.href = `product/index.html?id=${product.id}`;

    const card = document.createElement("article");
    card.classList.add("product-card");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("product-image");

    const image = document.createElement("img");
    image.src = product.image.url;
    image.alt = product.image.alt;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `${product.discountedPrice} kr`;

    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("btn");
    addToCartButton.textContent = "Add to Cart";

    addToCartButton.addEventListener("click", () => {
      addToCart(product);

      addToCartButton.textContent = "Added to Cart";

      setTimeout(() => {
        addToCartButton.textContent = "Add to Cart";
      }, 1500);
    });

    imageContainer.appendChild(image);

    card.appendChild(imageContainer);
    card.appendChild(title);
    card.appendChild(price);

    productLink.appendChild(card);
    productItem.appendChild(productLink);
    productItem.appendChild(addToCartButton);

    productsContainer.appendChild(productItem);
  });
}

function filterProducts() {
  if (selectedGender === "all") {
    return allProducts;
  }

  const filteredProducts = allProducts.filter((product) => {
    return product.gender.toLowerCase() === selectedGender;
  });

  return filteredProducts;
}

function updateProducts() {
  const filteredProducts = filterProducts();

  renderProducts(filteredProducts);
}

//! ======================================================
//!                      EVENT LISTENERS
//! ======================================================

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedGender = button.dataset.gender;

    updateProducts();
  });
});

//! ======================================================
//!                      INITIAL LOAD
//! ======================================================

async function startApp() {
  loadCart();
  loading.style.display = "block";

  await fetchProducts();

  if (allProducts.length > 0) {
    updateProducts();
  }

  loading.style.display = "none";
}

startApp();
