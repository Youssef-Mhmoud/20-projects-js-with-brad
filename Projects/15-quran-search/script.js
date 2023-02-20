const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.alquran.cloud/v1";

let data1 = [];

let page = 1;
let start = 0;
let end = 2;

// Set direction HTML
function dirHTML(direction) {
  const html = document.querySelector("html");
  html.setAttribute("dir", direction);
}

// Search by surah
async function searchSurah(term) {
  const res = await fetch(`${apiURL}/juz/${term}`);
  const data = await res.json();

  dirHTML("ltr");

  page = 1;
  start = 0;
  end = 2;

  data1 = data;
  showData(data1);
}

// Show Juz in DOM
function showData(data = data1) {
  const numPages = Math.ceil(Object.keys(data.data.surahs).length / 2);
  start = (page - 1) * 2; // 0
  end = page * 2; // 2
  pagKeys = Object.keys(data.data.surahs).slice(start, end);

  result.innerHTML = `
    <ul class="surahs">
      ${pagKeys
        .map(
          (key) =>
            `
          <li>
            <span>
              <strong>${data.data.surahs[key].englishName}</strong> - ${data.data.surahs[key].name}
            </span>
            <button
              class="btn"
              data-surah-number="${data.data.surahs[key].number}"
              data-surah-name="${data.data.surahs[key].name}"
            >
              Get Ayahs
            </button>
          </li>
        `
        )
        .join("")}
    </ul>
  `;

  if (numPages === 1) more.innerHTML = ``;
  // // Pagination
  if (page === 1 && numPages > 1) {
    more.innerHTML = `
      <button  class="btn pag-next">
        Next
      </button>
    `;
  }

  if (page === numPages && numPages > 1 && page > 0) {
    more.innerHTML = `
      <button  class="btn pag-prev">
        Prev
      </button>
    `;
  }

  if (page < numPages && page > 0) {
    more.innerHTML = `
    ${
      page - 1 === 0
        ? ""
        : `
    <button  class="btn pag-prev">
      Prev
    </button>
    `
    }

    ${
      page === numPages
        ? ""
        : `
    <button  class="btn pag-next">
      Next
    </button>
    `
    }
    `;
  }
}

// // Next more surahs
function nextData() {
  page++;

  showData();
}

// // Prev
function prevData() {
  if (page <= 1) return;

  page--;

  showData();
}

// Get Ayahs
async function getAyahs(number, name) {
  const res = await fetch(`${apiURL}/surah/${number}`);
  const data = await res.json();

  dirHTML("rtl");

  result.innerHTML = `
  <h2 dir="rtl"><strong>${name}</strong></h2>
  ${data.data.ayahs
    .map(
      (ayah, i) =>
        `<span dir="rtl" class="ayah">
          ${ayah.text}
        </span>
        <span class="number">
          ${i + 1}
        </span>`
    )
    .join("")}
  `;

  more.innerHTML = "";
}

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSurah(searchTerm);
  }
});

///////////////////////////
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("pag-next")) nextData();
  if (e.target.classList.contains("pag-prev")) prevData();
});

// Get ayahs
result.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const numberSurah = clickedEl.getAttribute("data-surah-number");
    const nameSurah = clickedEl.getAttribute("data-surah-name");

    getAyahs(numberSurah, nameSurah);
  }
});
