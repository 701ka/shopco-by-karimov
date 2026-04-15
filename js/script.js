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
let userInfo = localStorage.getItem("userInfo");
let userParseInfo = JSON.parse(userInfo);
const userClose = document.querySelector(".user__modal_del");
const userModal = document.querySelector(".user__modal_wrapper");
const user = document.querySelector(".user__pic");
const userInfoText = document.querySelector(".user__modal_text");
const userEmailText = document.querySelector(".user__modal_email");
user.addEventListener("click", () => {
  if (userInfo) {
    window.location.href = "#";
    userModal.style.display = "flex";
    userInfoText.textContent = userParseInfo.name;
    userEmailText.textContent = userParseInfo.email;
    userClose.addEventListener("click", () => {
      userModal.style.display = "none";
    });
  } else {
    window.location.href = "/html/log-in.html";
  }
});
console.log(userParseInfo);
