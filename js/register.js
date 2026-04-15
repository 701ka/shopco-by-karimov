const elForm = document.querySelector(".register__form");
const firstNameInp = document.querySelector(".firstname__inp");
const lastNameInp = document.querySelector(".lastname__inp");
const emailInp = document.querySelector(".email__inp");
const passInp = document.querySelector(".password__inp");
const roleInp = document.querySelector(".role__inp");
const formBtn = document.querySelector(".form__btn");
const load = document.querySelector(".loader__wrapper");

emailInp.value = `aliyev${Number(Date.now()).toFixed(0) % 1000}@gmail.com`;

elForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstNameVal = firstNameInp.value.trim();
  let lastNameVal = lastNameInp.value.trim();
  let emailVal = emailInp.value.trim();
  let passVal = passInp.value.trim();
  let roleVal = roleInp.value.trim();

  if (
    firstNameVal === "" ||
    lastNameVal === "" ||
    emailVal === "" ||
    passVal === "" ||
    roleVal === ""
  )
    return iziToast.error({
      title: "Error",
      message: "Ma'lumotlarni to'ldiring",
      position: "topRight",
      timeout: 2000,
    });
  if (!emailVal.endsWith("@gmail.com"))
    return iziToast.error({
      title: "Error",
      message: "Emailni Tekshiring",
      position: "topRight",
      timeout: 2000,
    });
  if (passVal.length < 6)
    return iziToast.error({
      title: "Error",
      message: "Parol 6tadan kam bo'lmasin",
      position: "topRight",
      timeout: 2000,
    });

  regFunc(firstNameVal, lastNameVal, emailVal, passVal, roleVal);
  let userInfo = {
    email: emailInp.value,
    name: firstNameInp.value,
  };

  localStorage.setItem("userInfo", JSON.stringify(userInfo));
});

async function regFunc(firstname, lastname, email, pass, role) {
  load.style.display = "flex";
  try {
    const res = await fetch(
      "https://shop-co-backend-k5f0.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email: email,
          password: pass,
          role: role,
        }),
      },
    );
    const data = await res.json();
    console.log(data);
    if (data.message && data.message.includes("Email already in use")) {
      throw new Error("BU EMAIL ISHLATILINYAPTI");
    }
    if (!res.ok) {
      throw new Error("Xatolik, yana bir bor tekshirib koring");
    }
    iziToast.success({
      title: "Success",
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      position: "topRight",
      timeout: 2000,
    });
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: error.message,
      position: "topRight",
      timeout: 2000,
    });
  }
  load.style.display = "none";
}
