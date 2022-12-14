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
const restaurantTitle = document.querySelector("section.menu > div.section-heading > h2.section-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");
const modalMakeOrderButton = document.querySelector(".make-order");

let login = localStorage.getItem("login");

const cart = [];

const getData = async function(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }

  return response.json();
};

getData("./db/partners.json");

function toggleModal() {
  modal.classList.toggle("is-open");
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
    cartButton.style.display = "";

    buttonOut.removeEventListener("click", logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";

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

function createCardRestaurant({ image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery }) {

  const cardRestaurant = document.createElement("a");
  cardRestaurant.className = "card card-restaurant wow animate__animated animate__pulse";
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
    <img src=${image} alt=${name} class="card-image">
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery}</span>
      </div>
      <div class="card-info">
        <div class="rating">
          <img src="img/icon/rating.svg" class="rating-star">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;

  cardRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);

}

function createCardGood({ description, image, id, name, price }) {

  const card = document.createElement("div");
  card.className = "card wow animate__animated animate__pulse";

  card.insertAdjacentHTML("beforeend", `
    <img src=${image} alt=${name} class="card-image">
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <img src="img/icon/shopping-cart-white.svg" alt="Cart" class="button-card-image">
        </button>
        <strong class="card-price-bold card-price">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");

    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function(data) {
        data.forEach(createCardGood);
      })
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item) {
      return item.id === id
    })

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = "";

  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button type="button" class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button type="button" class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });

  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + " ₽";
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    };
    if (target.classList.contains("counter-plus")) {
      food.count++;
    };
    renderCart();
  }
}

function init() {
  getData("./db/partners.json").then(function(data) {
    data.forEach(createCardRestaurant);
  });

  buttonAuth.addEventListener("click", clearForm);

  cardsMenu.addEventListener("click", addToCart);

  cartButton.addEventListener("click", function() {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function() {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener("click", changeCount);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);
  logo.addEventListener("click", function() {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  })

  modalMakeOrderButton.addEventListener("click", function(event) {
    const items = { ...localStorage };
    let count_of_orders = 1;
    let order = {}

    for (const item in items) {
      if (item.startsWith('Order_')) {
        count_of_orders += 1;
      } else if (item.startsWith("login")) {
        order.user = items[item];
      }
    }

    order.cart = cart

    localStorage.setItem(`Order_${count_of_orders}`, JSON.stringify(order));

    cart.length = 0;
    renderCart();
    toggleModal();
  });

  checkAuth();

  inputSearch.addEventListener("keypress", function(event) {
    if (event.charCode === 13) {
      const value = event.target.value.trim();

      if (!value) {
        event.target.style.borderColor = "#ff0000";
        event.target.value = "";
        setTimeout(function() {
          event.target.style.borderColor = "";
        }, 1500);
        return;
      }

      getData("./db/partners.json")
      .then(function (data) {
        return data.map(function(partner) {
          return partner.products;
        })
      })
      .then(function (linksProduct) {
        cardsMenu.textContent = "";

        linksProduct.forEach(function(link) {
          getData(`./db/${link}`)
          .then(function(data) {

            const resultSearch = data.filter(function(item) {
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase());
            })

            containerPromo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            restaurantTitle.textContent = "Результат поиска";
            restaurantRating.textContent = "";
            restaurantPrice.textContent = "";
            restaurantCategory.textContent = "";
            resultSearch.forEach(createCardGood);
          })
        })
      })
    }
  })
}

init();


// Slider

new Swiper(".swiper-container", {
  slidePerView: 1,
  loop: true,
  autoplay: true,
})
