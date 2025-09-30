const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
const RAPIDAPI_KEY = "df5fe52db4msh6559a929065c42fp1446b6jsn3b2b1e0a9759";

async function fetchAnimesByName(query) {
  const url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&search=${encodeURIComponent(query)}`;
  return fetchApi(url);
}

async function fetchAnimeById(id) {
  const url = `https://${RAPIDAPI_HOST}/anime/by-id/${encodeURIComponent(id)}`;
  return fetchApi(url, true);
}

async function fetchTopRanking() {
  const url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&sortBy=ranking&sortOrder=asc`;
  return fetchApi(url, true);
}

async function fetchApi(url, single = false) {
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
  return single ? [data] : data.data || [];
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

  if (anime.ranking) {
    const ranking = document.createElement("p");
    ranking.textContent = `Classement : ${anime.ranking}`;
    card.appendChild(ranking);
  }

  if (anime.episodes) {
    const episodes = document.createElement("p");
    episodes.textContent = `Épisodes : ${anime.episodes}`;
    card.appendChild(episodes);
  }

  if (anime.genres) {
    const genres = document.createElement("p");
    genres.textContent = `Genres : ${anime.genres.join(", ")}`;
    card.appendChild(genres);
  }

  const synopsis = document.createElement("p");
  synopsis.textContent = anime.synopsis || "Pas de synopsis disponible.";
  card.appendChild(synopsis);

  return card;
}

async function displayResults(query, type) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.textContent = "Chargement...";

  try {
    let animes = [];

    if (type === "name") {
      animes = await fetchAnimesByName(query);
    } else if (type === "id") {
      animes = await fetchAnimeById(query);
    } else if (type === "ranking") {
      animes = await fetchTopRanking();
    }

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
  const select = document.getElementById("search-type");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const query = input.value.trim();
    const type = select.value;

    if (type === "ranking") {
      displayResults("", type);
    } else if (query) {
      displayResults(query, type);
    } else {
      document.getElementById("results").textContent = "Veuillez entrer une valeur.";
    }
  });

  resetBtn.addEventListener("click", () => {
    input.value = "";
    document.getElementById("results").textContent = "";
  });
}

main();
