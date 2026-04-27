const btn = document.querySelector(".add__btn_modal");
const modal = document.getElementById("modal");
const form = document.querySelector(".add__form");
const iconWrapper = document.querySelectorAll(".icon__inner");
const ProductList = document.querySelector(".add__product");
const delteModal = document.querySelector(".delete__alert");
const modalYes = document.querySelector("#delete");
const modalNo = delteModal.querySelector("#noDelete");

// list
const productListEl = document.querySelector(".add__product__list");

async function getProduct() {
  const res = await fetch(
    "https://shop-co-backend-k5f0.onrender.com/api/products",
  );
  const data = await res.json();
  productsRender(data, productListEl);
}
getProduct();
function productsRender(arr, list) {
  list.innerHTML = arr
    .map(
      (el, index) => `
     <li class="add__product__item">
            <p class="add__product__number">${index + 1}</p>
            <img
              src="${el.images && el.images.length > 0 ? el.images[0].trim() : "https://i.pinimg.com/736x/73/c5/e8/73c5e8348e8dbd832edaff69a1628497.jpg"}"
              width="100"
              height="88"
              alt=""
              class="add__product__img"
            />
            <p class="add__product__name">${el.title}</p>
            <p class="add__product__price">${el.price}</p>
            <p class="add__product__discount">-20%</p>
            <div class="add__product__star_wrapper">
              <p class="add__product__star_counter">5</p>
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
btn.addEventListener("click", () => {
  modal.classList.add("active");
});

document.addEventListener("click", (e) => {
  const modalIn = e.target.closest(".add__modal_content");
  const modalBtn = e.target.closest(".add__btn_modal");

  if (!modalIn && !modalBtn) {
    modal.classList.remove("active");
  }
});
ProductList.addEventListener("click", (e) => {
  if (e.target.closest(".icon__delete")) {
    delteModal.style.display = "flex  ";
  }
});
modalNo.addEventListener("click", () => {
  delteModal.style.display = "none";
});
