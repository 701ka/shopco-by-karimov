const btn = document.querySelector(".add__btn_modal");
const modal = document.getElementById("modal");
const form = document.querySelector(".add__form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
btn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  const isClickInsideModal = e.target.closest(".add__modal_content");
  const isOpenBtn = e.target.closest(".add__btn_modal");

  if (!isClickInsideModal && !isOpenBtn) {
    modal.classList.remove("active");
  }
});
const iconWrapper = document.querySelectorAll(".icon__inner");

iconWrapper.forEach((el) => {
  el.addEventListener("click", () => {
    alert("bosildi");
  });
});
