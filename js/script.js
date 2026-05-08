const PRODUCTS_API = "https://shop-co-backend-k5f0.onrender.com/api/products";
const API_ORIGIN = "https://shop-co-backend-k5f0.onrender.com";
const FALLBACK_IMAGE =
  "https://i.pinimg.com/736x/73/c5/e8/73c5e8348e8dbd832edaff69a1628497.jpg";

function initRatings() {
  document.querySelectorAll(".rating").forEach((rating) => {
    const stars = rating.querySelectorAll(".star");
    let currentRating = -1;

    stars.forEach((star, index) => {
      star.addEventListener("mouseenter", () => {
        stars.forEach((s, i) => {
          s.classList.toggle("active", i <= index);
        });
      });

      rating.addEventListener("mouseleave", () => {
        stars.forEach((s, i) => {
          s.classList.toggle("active", i <= currentRating);
        });
      });

      star.addEventListener("click", () => {
        currentRating = index;
      });
    });
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getProductImage(product) {
  const image = product.images?.[0] || product.image || product.thumbnail;

  if (!image) return FALLBACK_IMAGE;

  const imageUrl =
    typeof image === "string"
      ? image
      : image.url || image.path || image.filename;

  if (!imageUrl) return FALLBACK_IMAGE;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${API_ORIGIN}${imageUrl}`;

  return `${API_ORIGIN}/${imageUrl}`;
}

function getProductId(product) {
  return product._id || product.id || product.productId || "";
}

function getProductPageUrl(product) {
  const id = getProductId(product);
  const path = window.location.pathname.includes("/html/")
    ? `./products.html?id=${id}`
    : `./html/products.html?id=${id}`;

  return path;
}

function renderProductCard(product) {
  const title = product.title || product.name || "Product";
  const price = Number(product.price || 0);
  const oldPrice = product.oldPrice || product.originalPrice;
  const discount = product.discount || product.discountPercentage || "";
  const rating = product.rating || 5;
  const productUrl = getProductPageUrl(product);

  return `
    <li class="new__item">
      <a href="${productUrl}" class="new__link_pr">
        <div class="new__img_bg">
          <img
            src="${getProductImage(product)}"
            width="295"
            height="298"
            class="new__img"
            alt="${escapeHtml(title)}"
          />
        </div>
        <div class="new__info">
          <h4 class="new__subtitle">${escapeHtml(title)}</h4>
          <div class="new__rating">
            <div class="rating" data-rating-id="${getProductId(product)}">
              <span class="star">&#9733;</span>
              <span class="star">&#9733;</span>
              <span class="star">&#9733;</span>
              <span class="star">&#9733;</span>
              <span class="star">&#9733;</span>
            </div>
            <p class="new__rating__text">${rating}/5</p>
          </div>
          <div class="new__price">
            <strong class="new__real_price">$${price}</strong>
            ${oldPrice ? `<del class="new__del_price">$${oldPrice}</del>` : ""}
            ${discount ? `<p class="new__sale">-${discount}%</p>` : ""}
          </div>
        </div>
      </a>
    </li>`;
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function renderIndexProducts() {
  const productLists = document.querySelectorAll(".new__list");

  if (!productLists.length) return;

  try {
    const res = await fetch(PRODUCTS_API);
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products || data.data || [];

    productLists.forEach((list, index) => {
      const start = index * 4;
      const sectionProducts = products.slice(start, start + 4);
      const limitedProducts = sectionProducts.length
        ? sectionProducts
        : products.slice(0, 4);

      list.innerHTML = limitedProducts.map(renderProductCard).join("");
    });

    initRatings();
  } catch (error) {
    console.log("Productlarni render qilishda xatolik:", error.message);
    initRatings();
  }
}

renderIndexProducts();

async function getProducts() {
  const res = await fetch(PRODUCTS_API);
  const data = await res.json();

  return Array.isArray(data) ? data : data.products || data.data || [];
}

function getProductImages(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const normalizedImages = images.map((image) => {
    if (typeof image === "string") return image;

    return image.url || image.path || image.filename;
  });

  return normalizedImages.filter(Boolean).length
    ? normalizedImages.map((image) => getProductImage({ images: [image] }))
    : [getProductImage(product)];
}

function renderProductDetail(product) {
  const titleEl = document.querySelector(".product__title");
  const ratingTextEl = document.querySelector(".product__rating_text");
  const priceEl = document.querySelector(".product__real_price");
  const oldPriceEl = document.querySelector(".product_del");
  const discountEl = document.querySelector(".product__charge");
  const descriptionEl = document.querySelector(".product__text");
  const thumbnailsEl = document.querySelector(".product__list");
  const mainImageEl = document.querySelector(".product__img_bg");
  const colorsEl = document.querySelector(".color__list");
  const sizesEl = document.querySelector(".size__list");

  if (!titleEl || !mainImageEl) return;

  const title = product.title || product.name || "Product";
  const images = getProductImages(product);
  const colors = normalizeList(product.colors);
  const sizes = normalizeList(product.size || product.sizes);
  const oldPrice = product.oldPrice || product.originalPrice;
  const discount = product.discount || product.discountPercentage;

  document.title = title;
  titleEl.textContent = title;
  ratingTextEl.innerHTML = `${product.rating || 5}/<span>5</span>`;
  priceEl.textContent = `$${product.price || 0}`;
  descriptionEl.textContent =
    product.description || "No description has been added for this product.";

  if (oldPrice) {
    oldPriceEl.textContent = `$${oldPrice}`;
    oldPriceEl.style.display = "";
  } else {
    oldPriceEl.style.display = "none";
  }

  if (discount) {
    discountEl.textContent = `-${discount}%`;
    discountEl.style.display = "";
  } else {
    discountEl.style.display = "none";
  }

  mainImageEl.src = images[0];
  mainImageEl.alt = title;
  thumbnailsEl.innerHTML = images
    .slice(0, 3)
    .map(
      (image) => `
        <li class="product__item">
          <img
            src="${image}"
            alt="${escapeHtml(title)}"
            width="152"
            height="167"
            class="product__img"
          />
        </li>`,
    )
    .join("");

  thumbnailsEl.querySelectorAll(".product__img").forEach((image) => {
    image.addEventListener("click", () => {
      mainImageEl.src = image.src;
    });
  });

  colorsEl.innerHTML = (colors.length ? colors : ["black", "gray", "white"])
    .map(
      (color) => `
        <li
          class="color__item"
          title="${escapeHtml(color)}"
          style="background-color: ${escapeHtml(color)}"
        ></li>`,
    )
    .join("");

  sizesEl.innerHTML = (sizes.length ? sizes : ["S", "M", "L", "XL"])
    .map((size) => `<li class="size__item">${escapeHtml(size)}</li>`)
    .join("");
}

async function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId || !document.querySelector(".product__inner")) return;

  try {
    const products = await getProducts();
    const product = products.find((item) => getProductId(item) === productId);

    if (!product) {
      console.log("Product topilmadi:", productId);
      return;
    }

    renderProductDetail(product);
  } catch (error) {
    console.log("Product detail render xatosi:", error.message);
  }
}

renderProductPage();

function showToast(type, message) {
  if (window.iziToast) {
    iziToast[type]({
      title: type === "success" ? "Success" : "Error",
      message,
      position: "topRight",
      timeout: 2500,
    });
    return;
  }

  console.log(message);
}

function initReviewModal() {
  const modal = document.querySelector("#reviewModal");
  const openBtn = document.querySelector(".rew__btn");
  const closeBtn = document.querySelector(".review__modal_close");
  const form = document.querySelector(".review__form");
  const submitBtn = document.querySelector(".review__submit");

  if (!modal || !openBtn || !closeBtn || !form) return;

  function openModal() {
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productId = new URLSearchParams(window.location.search).get("id");
    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const userRate = Number(formData.get("userRate"));
    const comment = formData.get("comment").trim();

    if (!productId) {
      showToast("error", "Product id topilmadi");
      return;
    }

    if (!name || !comment || userRate < 1 || userRate > 5) {
      showToast("error", "Name, rate va commentni to'g'ri to'ldiring");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const res = await fetch(`${PRODUCTS_API}/${productId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          userRate,
          comment,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.message || "Review yuborishda xatolik bor");
      }

      showToast("success", "Review yuborildi");
      form.reset();
      closeModal();
    } catch (error) {
      console.log("Review yuborish xatosi:", error);
      showToast("error", "Review yuborishda xatolik bor");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Review";
    }
  });
}

initReviewModal();
let userInfo = localStorage.getItem("userInfo");
let userParseInfo = userInfo ? JSON.parse(userInfo) : null;
const userClose = document.querySelector(".user__modal_del");
const userModal = document.querySelector(".user__modal_wrapper");
const user = document.querySelector(".user__pic");
const userInfoText = document.querySelector(".user__modal_text");
const userEmailText = document.querySelector(".user__modal_email");
user?.addEventListener("click", () => {
  if (userInfo) {
    window.location.href = "#";
    if (userModal && userInfoText && userEmailText && userClose) {
      userModal.style.display = "flex";
      userInfoText.textContent = userParseInfo.name;
      userEmailText.textContent = userParseInfo.email;
      userClose.addEventListener("click", () => {
        userModal.style.display = "none";
      });
    }
  } else {
    window.location.href = "/html/log-in.html";
  }
});
console.log(userParseInfo);
