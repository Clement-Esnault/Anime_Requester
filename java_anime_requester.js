const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
const RAPIDAPI_KEY = "df5fe52db4msh6559a929065c42fp1446b6jsn3b2b1e0a9759"; 

function createCard(anime) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${anime.image}" alt="${anime.title}">
    <h2>${anime.title}</h2>
    <p><strong>Classement :</strong> ${anime.ranking}</p>
    <p><strong>Épisodes :</strong> ${anime.episodes}</p>
    <p><strong>Genres :</strong> ${anime.genres.join(", ")}</p>
    <p>${anime.synopsis}</p>
  `;
  return card;
}

async function fetchAnimes(query = "") {
  const url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&search=${encodeURIComponent(query)}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY
    }
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data.data || [];
}

async function main() {
  const resultsDiv = document.getElementById("results");
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resetBtn = document.getElementById("reset-btn");

  async function displayResults(query = "") {
    resultsDiv.innerHTML = "<p>Chargement...</p>";
    try {
      const animes = await fetchAnimes(query);
      resultsDiv.innerHTML = "";
      if (animes.length === 0) {
        resultsDiv.innerHTML = "<p>Aucun anime trouvé.</p>";
        return;
      }
      animes.forEach(anime => resultsDiv.appendChild(createCard(anime)));
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
    }
  }

  await displayResults(); 

  form.addEventListener("submit", e => {
    e.preventDefault();
    displayResults(input.value);
  });

  resetBtn.addEventListener("click", () => {
    input.value = "";
    displayResults();
  });
}

main();