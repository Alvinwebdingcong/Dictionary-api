import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";

const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonyms = wrapper.querySelector(".synonyms .list"),
  antonyms = wrapper.querySelector(".antonyms .lists"),
  infoText = wrapper.querySelector(".info-text"),
  volumeIcon = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span");

let audio = new Audio();
// data function

function data(result, word) {
  if (result.title) {
    //if api returns the message of can't find the words
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    console.log(result);
    wrapper.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0],
      phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

    // let's pass the particular response data to a particular HTML element
    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText = definitions.example;
    audio = "https://" + result[0].phonetics[0].audio;

    if (definitions.example && definitions.example.length > 0) {
      example.parentElement.style.display = "block";
    } else {
      example.parentElement.style.display = "none";
    }

    if (definitions.synonyms && definitions.synonyms.length > 0) {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5 && i < definitions.synonyms.length; i++) {
        let synonym = definitions.synonyms[i];
        let synonymElement = document.createElement("span");
        synonymElement.textContent = synonym;
        synonymElement.addEventListener("click", () => {
          search(synonym);
        });
        synonyms.appendChild(synonymElement);
      }
    } else {
      synonyms.parentElement.style.display = "none";
    }
  }
}

function search(word) {
  searchInput.value = word;
  fetchApi(word);
}

function fetchApi(word) {
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word));
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});

volumeIcon.addEventListener("click", () => {
  if (audio instanceof HTMLAudioElement) {
    audio.play();
  }
});
removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
});
