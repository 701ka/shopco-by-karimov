const btn = document.querySelector(".add__btn_modal");
const modal = document.getElementById("modal");
const form = document.querySelector(".add__form");
const iconWrapper = document.querySelectorAll(".icon__inner");
const ProductList = document.querySelector(".add__product");
const delteModal = document.querySelector(".delete__alert");
const modalYes = document.querySelector("#delete");
const modalNo = document.querySelector("#noDelete");
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
  if (e.target.closest(".icon__inner")) {
    delteModal.style.display = "flex  ";
  }
});
modalNo.addEventListener("click", () => {
  delteModal.style.display = "none";
});
