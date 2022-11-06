// Modal
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open")
}

// Initialize WOW.js
new WOW().init();

// Auth
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");

let login = localStorage.getItem("login");

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function authorized() {
  console.log("Авторизован");

  function logOut() {
    login = null;
    localStorage.removeItem("login");

    buttonAuth.style.display = "block";
    userName.style.display = "none";
    buttonOut.style.display = "none";
    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";

  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    toggleModalAuth();

    localStorage.setItem("login", login);

    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    logInForm.removeEventListener("submit", logIn);

    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login){
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();