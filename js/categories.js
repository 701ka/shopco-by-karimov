const cartItems = document.querySelector(".cart__items");
const subtotalEl = document.querySelector(".cart__subtotal");
const discountEl = document.querySelector(".cart__discount");
const deliveryEl = document.querySelector(".cart__delivery");
const totalEl = document.querySelector(".cart__total");
const promoForm = document.querySelector(".cart__promo");
const promoInput = document.querySelector(".cart__promo_input");
const promoMessage = document.querySelector(".cart__promo_message");
const topbar = document.querySelector(".cart-topbar");
const topbarClose = document.querySelector(".cart-topbar__close");
const newsletterForm = document.querySelector(".cart-newsletter__form");
const deliveryFee = 15;
let discountRate = 0.2;
const CART_KEY = "shopcoCart";

function formatPrice(value) {
  return `$${Math.round(value)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function renderCartItem(item) {
  const quantity = Number(item.quantity) || 1;
  const price = Number(item.price) || 0;

  return `
    <article
      class="cart__item"
      data-id="${escapeHtml(item.id)}"
      data-price="${price}"
      data-quantity="${quantity}"
    >
      <img
        src="${escapeHtml(item.image)}"
        alt="${escapeHtml(item.title)}"
        class="cart__item_img"
      />
      <div class="cart__item_body">
        <div>
          <h2 class="cart__item_title">${escapeHtml(item.title)}</h2>
          <p class="cart__item_meta">Size: <span>${escapeHtml(item.size || "Large")}</span></p>
          <p class="cart__item_meta">Color: <span>${escapeHtml(item.color || "Default")}</span></p>
        </div>
        <strong class="cart__item_price">${formatPrice(price)}</strong>
      </div>
      <button
        type="button"
        class="cart__delete"
        aria-label="Remove ${escapeHtml(item.title)}"
      >
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <div class="cart__quantity" aria-label="Quantity selector">
        <button type="button" class="cart__qty_btn" data-action="minus">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="cart__qty_value">${quantity}</span>
        <button type="button" class="cart__qty_btn" data-action="plus">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </article>`;
}

function renderCart() {
  if (!cartItems) return;

  const items = getCart();

  cartItems.innerHTML = items.length
    ? items.map(renderCartItem).join("")
    : `
      <div class="cart__empty">
        <h2>Your cart is empty</h2>
        <p>Add something you love and it will show up here.</p>
      </div>`;

  updateCartSummary();
}

function getCartRows() {
  return [...document.querySelectorAll(".cart__item")];
}

function updateCartSummary() {
  const rows = getCartRows();
  const subtotal = rows.reduce((sum, row) => {
    const price = Number(row.dataset.price) || 0;
    const quantity = Number(row.dataset.quantity) || 1;

    return sum + price * quantity;
  }, 0);
  const discount = subtotal * discountRate;
  const delivery = rows.length ? deliveryFee : 0;
  const total = Math.max(0, subtotal - discount + delivery);

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (discountEl) discountEl.textContent = `-${formatPrice(discount)}`;
  if (deliveryEl) deliveryEl.textContent = formatPrice(delivery);
  if (totalEl) totalEl.textContent = formatPrice(total);

  if (!rows.length && cartItems) {
    cartItems.innerHTML = `
      <div class="cart__empty">
        <h2>Your cart is empty</h2>
        <p>Add something you love and it will show up here.</p>
      </div>`;
  }
}

function setQuantity(row, quantity) {
  const safeQuantity = Math.max(1, quantity);
  const quantityValue = row.querySelector(".cart__qty_value");
  const items = getCart();
  const item = items.find((cartItem) => cartItem.id === row.dataset.id);

  row.dataset.quantity = safeQuantity;

  if (quantityValue) {
    quantityValue.textContent = safeQuantity;
  }

  if (item) {
    item.quantity = safeQuantity;
    saveCart(items);
  }

  updateCartSummary();
}

cartItems?.addEventListener("click", (event) => {
  const quantityButton = event.target.closest(".cart__qty_btn");
  const deleteButton = event.target.closest(".cart__delete");

  if (quantityButton) {
    const row = quantityButton.closest(".cart__item");
    const action = quantityButton.dataset.action;
    const currentQuantity = Number(row.dataset.quantity) || 1;
    const nextQuantity =
      action === "plus" ? currentQuantity + 1 : currentQuantity - 1;

    setQuantity(row, nextQuantity);
    return;
  }

  if (deleteButton) {
    const row = deleteButton.closest(".cart__item");
    const items = getCart().filter((item) => item.id !== row?.dataset.id);

    saveCart(items);
    row?.remove();
    updateCartSummary();
  }
});

promoForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const promoCode = promoInput?.value.trim().toUpperCase();

  if (promoCode === "SHOPCO20") {
    discountRate = 0.2;
    promoMessage.textContent = "Promo code applied.";
  } else if (promoCode === "SHOPCO30") {
    discountRate = 0.3;
    promoMessage.textContent = "30% promo code applied.";
  } else {
    promoMessage.textContent = "Use SHOPCO20 or SHOPCO30.";
  }

  updateCartSummary();
});

topbarClose?.addEventListener("click", () => {
  topbar?.remove();
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();
});

document.querySelector(".user__shop")?.addEventListener("click", () => {
  window.location.href = "/html/categories.html";
});

renderCart();
