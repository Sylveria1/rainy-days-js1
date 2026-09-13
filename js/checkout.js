"use strict";

//! ======================================================
//!                       STATE
//! ======================================================
let cart = [];

//! ======================================================
//!                      DOM ELEMENTS
//! ======================================================
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const errorMessage = document.querySelector("#error-message");
const completePurchaseButton = document.querySelector("#complete-purchase");

//! ======================================================
//!                     FUNCTIONS
//! ======================================================

function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function renderCart(cartItems) {
  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="no-results">Your cart is empty.</p>';

    cartTotal.textContent = "";
    completePurchaseButton.style.display = "none";
    return;
  }

  completePurchaseButton.style.display = "inline-block";

  cartItems.forEach((item) => {
    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");

    const image = document.createElement("img");
    image.src = item.image.url;
    image.alt = item.image.alt;

    const info = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = item.title;

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${item.quantity}`;

    const price = document.createElement("p");
    price.textContent = `${item.discountedPrice} kr`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";

    info.appendChild(title);
    info.appendChild(quantity);

    orderItem.appendChild(image);
    orderItem.appendChild(info);
    orderItem.appendChild(price);
    orderItem.appendChild(removeButton);

    cartItemsContainer.appendChild(orderItem);

    removeButton.addEventListener("click", () => {
      removeFromCart(item.id);
    });
  });

  calculateTotal();
}

function calculateTotal() {
  const total = cart.reduce((sum, item) => {
    return sum + item.discountedPrice * item.quantity;
  }, 0);

  cartTotal.textContent = `Total: ${total.toFixed(2)} kr`;
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart(cart);
}

//! ======================================================
//!                      EVENT LISTENERS
//! ======================================================

completePurchaseButton.addEventListener("click", () => {
  localStorage.removeItem("cart");
});

//! ======================================================
//!                      INITIAL LOAD
//! ======================================================

function startApp() {
  loadCart();
  renderCart(cart);
}

startApp();
