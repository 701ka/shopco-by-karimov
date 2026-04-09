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
