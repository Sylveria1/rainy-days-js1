"use strict";

//! ======================================================
//!                       STATE
//! ======================================================
let product = null;
let cart = [];

//* ====================== CONSTANTS =====================
const url = "https://v2.api.noroff.dev/rainy-days";

//! ======================================================
//!                      DOM ELEMENTS
//! ======================================================
const productContainer = document.querySelector("#product-container");
const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error-message");

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

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function fetchProduct(productId) {
  try {
    const response = await fetch(`${url}/${productId}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();

    product = result.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);

    productContainer.innerHTML =
      '<p class="error-message">Could not load product. Please try refreshing the page.</p>';
  }
}

function renderProduct(productToRender) {
  productContainer.innerHTML = "";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("product-detail-image");

  const image = document.createElement("img");
  image.src = productToRender.image.url;
  image.alt = productToRender.image.alt;

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("product-detail-info");

  const title = document.createElement("h1");
  title.textContent = productToRender.title;

  const price = document.createElement("p");
  price.classList.add("product-price");

  if (productToRender.onSale) {
    const originalPrice = document.createElement("p");
    originalPrice.classList.add("original-price");
    originalPrice.textContent = `Previous price: ${productToRender.price} kr`;

    price.textContent = `${productToRender.discountedPrice} kr`;

    infoContainer.appendChild(originalPrice);
  } else {
    price.textContent = `${productToRender.price} kr`;
  }

  const description = document.createElement("p");
  description.textContent = productToRender.description;

  const sizes = document.createElement("p");
  sizes.textContent = `Sizes: ${productToRender.sizes.join(", ")}`;

  const color = document.createElement("p");
  color.textContent = `Color: ${productToRender.baseColor}`;

  const addToCartButton = document.createElement("button");
  addToCartButton.classList.add("btn");
  addToCartButton.textContent = "Add to Cart";

  addToCartButton.addEventListener("click", () => {
    addToCart(productToRender);

    addToCartButton.textContent = "Added to Cart";

    setTimeout(() => {
      addToCartButton.textContent = "Add to Cart";
    }, 1500);
  });

  imageContainer.appendChild(image);

  infoContainer.appendChild(title);
  infoContainer.appendChild(price);
  infoContainer.appendChild(description);
  infoContainer.appendChild(sizes);
  infoContainer.appendChild(color);
  infoContainer.appendChild(addToCartButton);

  productContainer.appendChild(imageContainer);
  productContainer.appendChild(infoContainer);
}

//! ======================================================
//!                      INITIAL LOAD
//! ======================================================

async function startApp() {
  loadCart();
  loading.style.display = "block";

  const productId = getProductId();

  if (!productId) {
    errorMessage.textContent = "Product not found.";
    loading.style.display = "none";
    return;
  }

  await fetchProduct(productId);

  if (product) {
    renderProduct(product);
  }

  loading.style.display = "none";
}

startApp();
