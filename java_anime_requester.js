const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
const RAPIDAPI_KEY = "df5fe52db4msh6559a929065c42fp1446b6jsn3b2b1e0a9759";

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
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  const data = await response.json();
  return data.data || [];
}

function createCard(anime) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = anime.image;
  img.alt = anime.title;
  card.appendChild(img);

  const title = document.createElement("h2");
  title.textContent = anime.title;
  card.appendChild(title);

  const ranking = document.createElement("p");
  ranking.textContent = `Classement : ${anime.ranking}`;
  card.appendChild(ranking);

  const episodes = document.createElement("p");
  episodes.textContent = `Épisodes : ${anime.episodes}`;
  card.appendChild(episodes);

  const genres = document.createElement("p");
  genres.textContent = `Genres : ${anime.genres.join(", ")}`;
  card.appendChild(genres);

  const synopsis = document.createElement("p");
  synopsis.textContent = anime.synopsis || "Pas de synopsis disponible.";
  card.appendChild(synopsis);

  return card;
}

async function displayResults(query) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.textContent = "Chargement...";
  try {
    const animes = await fetchAnimes(query);
    resultsDiv.textContent = "";
    if (animes.length === 0) {
      resultsDiv.textContent = "Aucun anime trouvé.";
      return;
    }
    animes.forEach(anime => resultsDiv.appendChild(createCard(anime)));
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Erreur lors de la récupération des données.";
  }
}

function main() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resetBtn = document.getElementById("reset-btn");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      displayResults(query);
    }
  });

  resetBtn.addEventListener("click", () => {
    input.value = "";
    const resultsDiv = document.getElementById("results");
    resultsDiv.textContent = "";
  });
}

main();