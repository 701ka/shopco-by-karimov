const btn = document.querySelector(".add__btn_modal");
const modal = document.getElementById("modal");

btn.addEventListener("click", () => {
  modal.classList.toggle("active");
});
