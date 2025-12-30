// star
document.querySelectorAll(".rating").forEach((rating) => {
  const stars = rating.querySelectorAll(".star");
  let currentRating = -1;

  stars.forEach((star, index) => {
    // ⭐ HOVER
    star.addEventListener("mouseenter", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i <= index);
      });
    });

    // 🔄 HOVER CHIQGANDA (oldingi holatga qaytadi)
    rating.addEventListener("mouseleave", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i <= currentRating);
      });
    });

    // ⭐ CLICK (tanlab qo‘yish)
    star.addEventListener("click", () => {
      currentRating = index;
    });
  });
});

