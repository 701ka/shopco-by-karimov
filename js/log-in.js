const emails = document.querySelector(".email__inp");
const pass = document.querySelector(".password__inp");
const form = document.querySelector(".register__form");
const load = document.querySelector(".loader__wrapper");
const names = document.querySelector(".name__inp");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  logIn(emails.value, pass.value);
});

async function logIn(email, pass) {
  load.style.display = "flex";

  try {
    if (pass === "" || email === "") {
      throw new Error(`Ma'lumotlarni toldiring`);
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      throw new Error("Emailni tekshirib koring");
      return;
    }

    const res = await fetch(
      "https://shop-co-backend-k5f0.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      },
    );
    if (!res.ok) {
      throw new Error("Xatolik yana bir bor tekshirib koring");
    }
    const data = await res.json();
    localStorage.removeItem("token");
    localStorage.setItem("token", data.token);
    iziToast.success({
      title: "Success",
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      position: "topRight",
      timeout: 2000,
      onClosing: function () {
        if (email == "admin@gmail.com" || pass == "admin123") {
          window.location.href = "/html/product-add.html";
        } else {
          window.location.href = "/index.html";
        }
      },
    });
    let userInfo = {
      email: data.user.email,
      name: data.user.firstName,
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    load.style.display = "none";
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: error.message,
      position: "topRight",
      timeout: 2000,
    });
  }
}
