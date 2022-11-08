"use strict";

new WOW().init();

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem("login");

function toggleModal() {
  modal.classList.toggle("is-open")
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = "";

  if(modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function clearForm() {
  loginInput.style.borderColor = '';
  logInForm.reset();
}

function authorized() {

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

  function logIn(event) {
    event.preventDefault();

    if (loginInput.value.trim()) {
      login = loginInput.value;
      localStorage.setItem("login", login);
      toggleModalAuth();

      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);

      logInForm.reset();

      checkAuth();
    } else {
      loginInput.style.borderColor = "#ff0000";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", function(event) {
    if (event.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  })
}

function checkAuth() {
  if (login){
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant wow animate__animated animate__pulse" data-wow-delay="0.2s">
      <img src="img/pizza-plus/preview.jpg" alt="Image" class="card-image">
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            <img src="img/icon/rating.svg" class="rating-star">
            4.5
          </div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood() {
  const card = document.createElement("div");
  card.className = "card wow animate__animated animate__pulse";

  card.insertAdjacentHTML("beforeend", `
    <img src="img/food-band/pepperoni.jpg" alt="Image" class="card-image">
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пепперони</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Рис, угорь, соус унаги, кунжут, водоросли нори.</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary">
          <span class="button-card-text">В корзину</span>
          <img src="img/icon/shopping-cart-white.svg" alt="Cart" class="button-card-image">
        </button>
        <strong class="card-price-bold">250 ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card)
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");

    if (restaurant) {
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      cardsMenu.textContent = "";

      createCardGood();
      createCardGood();
      createCardGood();
    }
  } else {
    toggleModalAuth();
  }
}

cardsRestaurants.addEventListener("click", openGoods);
logo.addEventListener("click", function() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
})

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

buttonAuth.addEventListener("click", clearForm);

checkAuth();

createCardRestaurant();

// Slider

new Swiper(".swiper-container", {
  slidePerView: 1,
  loop: true,
  autoplay: true,
})
