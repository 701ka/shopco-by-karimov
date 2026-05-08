const btn = document.querySelector(".add__btn_modal");
const modal = document.getElementById("modal");
const modalClose = document.querySelector(".add__modal_close");
const form = document.querySelector(".add__form");
const ProductList = document.querySelector(".add__product");
const delteModal = document.querySelector(".delete__alert");
const modalYes = document.querySelector("#delete");
const modalNo = delteModal.querySelector("#noDelete");
const uploadButtons = document.querySelectorAll(".add__upload");
const fileInputs = document.querySelectorAll(".add__file");
const submitBtn = document.querySelector(".add__submit");
const API_URL = "https://shop-co-backend-k5f0.onrender.com/api/products";
const CREATE_PRODUCT_URL = `${API_URL}/with-images`;
const API_ORIGIN = "https://shop-co-backend-k5f0.onrender.com";
const FALLBACK_IMAGE =
  "https://i.pinimg.com/736x/73/c5/e8/73c5e8348e8dbd832edaff69a1628497.jpg";

function normalizeCommaText(value) {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .join(",");
}

function isValidSizeList(value) {
  const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizes = value.split(",").map((item) => item.trim().toUpperCase());

  return sizes.every((item) => allowedSizes.includes(item));
}

function getTokenPayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch (error) {
    return null;
  }
}

function getAuthToken() {
  let token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    token = prompt("Postman'dagi Bearer tokenni kiriting");

    if (token) {
      token = token.replace(/^Bearer\s+/i, "").trim();
      localStorage.setItem("token", token);
    }
  }

  return token;
}

function showError(message) {
  iziToast.error({
    title: "Error",
    message,
    position: "topRight",
    timeout: 2500,
  });
}

function showSuccess(message) {
  iziToast.success({
    title: "Success",
    message,
    position: "topRight",
    timeout: 2500,
  });
}

const addTitle = document
  .querySelector(".add__title")
  .addEventListener("click", () => {
    window.location.href = "/index.html";
  });
// list
const productListEl = document.querySelector(".add__product__list");
let products = [];
let productForDelete = null;

async function readResponse(res) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.log("API JSON qaytarmadi:", text);
    return {
      message: `API JSON qaytarmadi. Status: ${res.status}. Console'da response text bor.`,
      raw: text,
    };
  }
}

async function getProduct() {
  try {
    const res = await fetch(API_URL);
    const data = await readResponse(res);
    products = Array.isArray(data) ? data : data.products || data.data || [];
    productsRender(products, productListEl);
  } catch (error) {
    showError("Productlarni olishda xatolik bor");
  }
}
getProduct();

function getImageUrl(product) {
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

function productsRender(arr, list) {
  list.innerHTML = arr
    .map(
      (el, index) => `
     <li class="add__product__item">
            <p class="add__product__number">${index + 1}</p>
            <img
              src="${getImageUrl(el)}"
              width="100"
              height="88"
              alt="${el.title || "Product"}"
              class="add__product__img"
            />
            <p class="add__product__name">${el.title}</p>
            <p class="add__product__price">${el.price}$</p>
            <p class="add__product__discount">-${el.discount || el.discountPercentage || 0}%</p>
            <div class="add__product__star_wrapper">
              <p class="add__product__star_counter">${el.rating || 5}</p>
              <i class="fa-solid fa-star add__product__star_icon"></i>
            </div>
            <div class="add__product_icon_wrapper">
              <div class="icon__inner">
                <i class="fa-solid fa-pencil add__product_icon pencil"></i>
              </div>
              <div class="icon__inner trash_wrapper icon__delete">
                <i class="fa-solid fa-trash add__product_icon trash"></i>
              </div>
            </div>
          </li>`,
    )
    .join("");
}

function openModal() {
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

btn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);

uploadButtons.forEach((upload) => {
  upload.addEventListener("click", () => {
    upload.querySelector(".add__file").click();
  });
});

fileInputs.forEach((input) => {
  input.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  input.addEventListener("change", () => {
    const file = input.files[0];
    const upload = input.closest(".add__upload");

    if (!file) return;

    upload.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
    upload.style.backgroundSize = "cover";
    upload.style.backgroundPosition = "center";
    upload.querySelector(".add__upload_text").textContent = "Selected";
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formValues = new FormData(form);
  const title = formValues.get("title").trim();
  const description = formValues.get("description").trim();
  const price = formValues.get("price").trim();
  const discount = formValues.get("discount").trim();
  const type = formValues.get("type").trim().toLowerCase();
  const category = formValues.get("category").trim().toLowerCase();
  const colors = normalizeCommaText(formValues.get("colors").trim());
  const size = normalizeCommaText(formValues.get("size").trim()).toUpperCase();
  const images = [...fileInputs].map((input) => input.files[0]).filter(Boolean);

  if (
    !title ||
    !description ||
    !price ||
    !type ||
    !category ||
    !colors ||
    !size ||
    images.length < 2
  ) {
    showError("Hamma maydonlarni toldiring va kamida 2 ta rasm tanlang");
    return;
  }

  if (title.length < 3 || description.length < 10) {
    showError("Title kamida 3 ta, description kamida 10 ta belgi bo'lsin");
    return;
  }

  if (Number(price) <= 0) {
    showError("Price 0 dan katta bo'lishi kerak");
    return;
  }

  if (!isValidSizeList(size)) {
    showError("Size faqat XS,S,M,L,XL,XXL formatida bo'lsin. Masalan: S,M,L");
    return;
  }

  const productData = new FormData();
  images.forEach((image) => {
    productData.append("images", image);
  });
  productData.append("title", title);
  productData.append("description", description);
  productData.append("price", price);
  productData.append("type", type);
  productData.append("category", category);
  productData.append("colors", colors);
  productData.append("size", size);

  console.log("Product form-data:", {
    images: images.map((image) => image.name),
    title,
    description,
    price,
    type,
    category,
    colors,
    size,
  });

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    const token = getAuthToken();

    if (!token || token === "undefined" || token === "null") {
      throw new Error(
        "Token topilmadi. Avval admin account bilan login qiling",
      );
    }

    console.log("Token payload:", getTokenPayload(token));

    const res = await fetch(CREATE_PRODUCT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: productData,
    });

    const data = await readResponse(res);

    if (!res.ok) {
      throw new Error(data.message || "Product qo'shishda xatolik bor");
    }

    await getProduct();
    form.reset();
    resetUploads();
    closeModal();
    showSuccess("Product muvaffaqiyatli qo'shildi");
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "+ Add product";
  }
});

function resetUploads() {
  uploadButtons.forEach((upload) => {
    upload.style.backgroundImage = "";
    upload.querySelector(".add__upload_text").textContent = "Upload";
  });

  fileInputs.forEach((input) => {
    input.value = "";
  });
}

document.addEventListener("click", (e) => {
  if (!modal.classList.contains("active")) return;

  const modalIn = e.target.closest(".add__modal_content");
  const modalBtn = e.target.closest(".add__btn_modal");

  if (!modalIn && !modalBtn) {
    modal.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    delteModal.style.display = "none";
  }
});

ProductList.addEventListener("click", (e) => {
  if (e.target.closest(".icon__delete")) {
    productForDelete = e.target.closest(".add__product__item");
    delteModal.style.display = "flex";
  }
});
modalNo.addEventListener("click", () => {
  delteModal.style.display = "none";
});
modalYes.addEventListener("click", () => {
  productForDelete?.remove();
  productForDelete = null;
  delteModal.style.display = "none";
});
