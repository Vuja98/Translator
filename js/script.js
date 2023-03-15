const fromText = document.querySelector(".from-text");
let toText = document.querySelector(".to-text");
let exchangeIcon = document.querySelector(".exchange");
let select = document.querySelectorAll("select");
let icons = document.querySelectorAll(" .row i ");

const translateBtn = document.querySelector("button");

select.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected;
    if (id === 0 && country_code == "en-GB") selected = "selected";
    else if (id === 1 && country_code === "sr-RS") selected = "selected";

    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  tempLang = select[0].value;
  fromText.value = toText.value;
  toText.value = tempText;

  select[0].value = select[1].value;
  select[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) toText.value = "";
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = select[0].value;
  let translateTo = select[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) toText.value = data.translation;
      });

      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    console.log(e.target);
    if (!fromText.value || !toText.value) return;
    if (e.target.classList.contains("fa-copy")) {
      console.log(e.target);
      if (e.target.id === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterence;
      if (e.target.id == "from") {
        utterence = new SpeechSynthesisUtterance(fromText.value);
        utterence.lang = select[0].value;
      } else {
        utterence = new SpeechSynthesisUtterance(toText.value);
        utterence.lang = select[1].value;
      }

      speechSynthesis.speak(utterence);
    }
  });
});
