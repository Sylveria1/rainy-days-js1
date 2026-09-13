"use strict";

//! ======================================================
//!                       STATE
//! ======================================================
let allProducts = [];
let selectedGender = "all";

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
    const productLink = document.createElement("a");
    productLink.classList.add("product-item");
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

    imageContainer.appendChild(image);

    card.appendChild(imageContainer);
    card.appendChild(title);

    productLink.appendChild(card);
    productLink.appendChild(price);

    productsContainer.appendChild(productLink);
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
  loading.style.display = "block";

  await fetchProducts();

  if (allProducts.length > 0) {
    updateProducts();
  }

  loading.style.display = "none";
}

startApp();
