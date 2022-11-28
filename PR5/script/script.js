document.addEventListener("DOMContentLoaded", function() {
  const btnOpenModal = document.querySelector("#btnOpenModal");
  const modalBlock =  document.querySelector("#modalBlock");
  const closeModal =  document.querySelector("#closeModal");
  const questionTitle =  document.querySelector("#question");
  const formAnswers =  document.querySelector("#formAnswers");
  const nextButton = document.querySelector("#next");
  const prevButton = document.querySelector("#prev");
  const sendButton = document.querySelector("#send");

  const firebaseConfig = {
    apiKey: "AIzaSyBDpCfQixdMwlynqBEDfasU-uufjYjPFR4",
    authDomain: "webpr-f260c.firebaseapp.com",
    databaseURL: "https://webpr-f260c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webpr-f260c",
    storageBucket: "webpr-f260c.appspot.com",
    messagingSenderId: "619579801013",
    appId: "1:619579801013:web:ce1eeacb39f93438b4adfc",
    measurementId: "G-PBP2YWW548"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const getData = () => {
    formAnswers.textContent = "LOAD";

    nextButton.classList.add("d-none");
    prevButton.classList.add("d-none");
    
    firebase.database().ref().child("questions").once("value")
    .then(snap => playTest(snap.val()));
  }

  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.add("d-block");
    getData();
  })

  closeModal.addEventListener("click", () => {
    modalBlock.classList.remove("d-block");
  })

  const playTest = (questions) => {
    const finalAnswers = [];
    let numberQuestion = 0;

    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement("div");

        answerItem.classList.add("answers-item", "d-flex", "justify-content-center");

        answerItem.innerHTML = `
          <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
          <label for="${answer.title}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${answer.url}" alt="burger">
            <span>${answer.title}</span>
          </label>
        `;
        formAnswers.appendChild(answerItem);
      })
    }

    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = "";

      switch (true) {
        case (numberQuestion === 0):
          questionTitle.textContent = `${questions[indexQuestion].question}`;
          renderAnswers(indexQuestion);
          prevButton.classList.add("d-none");
          break;
        case (numberQuestion === questions.length):
          nextButton.classList.add("d-none");
          prevButton.classList.add("d-none");
          sendButton.classList.remove("d-none");
          formAnswers.innerHTML = `
            <div class="form-group">
              <label for="numberPhone">Enter your number</label>
              <input type="phone" class="form-control" id="numberPhone">
            </div>
          `;
          break;
        case (numberQuestion === questions.length + 1):
          formAnswers.textContent = "Спасибо за пройденный тест!";
          setTimeout(() => {
            modalBlock.classList.remove("d-block");
          }, 2000)
          break;
        case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
          questionTitle.textContent = `${questions[indexQuestion].question}`;
          renderAnswers(indexQuestion);
          nextButton.classList.remove("d-none");
          prevButton.classList.remove("d-none");
          sendButton.classList.add("d-none");
          break;
      }

      // if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
      //   questionTitle.textContent = `${questions[indexQuestion].question}`;
      //   renderAnswers(indexQuestion);
      //   nextButton.classList.remove("d-none");
      //   prevButton.classList.remove("d-none");
      //   sendButton.classList.add("d-none");
      // }
      //
      // if (numberQuestion === 0) {
      //   prevButton.classList.add("d-none");
      // }
      //
      // if (numberQuestion === questions.length) {
      //   nextButton.classList.add("d-none");
      //   prevButton.classList.add("d-none");
      //   sendButton.classList.remove("d-none");
      //   formAnswers.innerHTML = `
      //     <div class="form-group">
      //       <label for="numberPhone">Enter your number</label>
      //       <input type="phone" class="form-control" id="numberPhone">
      //     </div>
      //   `;
      // }
      //
      // if (numberQuestion === questions.length + 1) {
      //   formAnswers.textContent = "Спасибо за пройденный тест!";
      //   setTimeout(() => {
      //     modalBlock.classList.remove("d-block");
      //   }, 2000)
      // }
    }
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const obj = {};
      const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === "numberPhone");

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }
        if (numberQuestion === questions.length) {
          obj["Номер телефона"] = input.value;
        }
      })

      finalAnswers.push(obj);
    }

    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    }

    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    }

    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      firebase
      .database()
      .ref()
      .child("contacts")
      .push(finalAnswers)
    }
  }
})
