const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
const RAPIDAPI_KEY = "c3f8c3c722msh4c20a842d8ebbe3p187c73jsned310e13e580";

async function fetchAnimesByName(query) {
  const url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&search=${encodeURIComponent(query)}`;
  return fetchApi(url);
}

async function fetchAnimeById(id) {
  const url = `https://${RAPIDAPI_HOST}/anime/by-id/${encodeURIComponent(id)}`;
  return fetchApi(url, true);
}

async function fetchAnimeRanking(ranking) {
  const url = `https://${RAPIDAPI_HOST}/anime/by-ranking/${encodeURIComponent(ranking)}`;
  return fetchApi(url,true);
}

async function fetchApi(url, single = false) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "X-RapidAPI-Key": RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      throw new Error("Erreur réseau : " + response.status);
    }

    const data = await response.json();

    if (single === true) {
      return data;
    } else {
      return data.data;
    }
  } catch (error) {
    console.error("Erreur dans fetchApi :", error);
    throw error;
  }
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
    let anime;

    if (type === "name") {
      animes = await fetchAnimesByName(query);
      resultsDiv.textContent = "";
      animes.forEach(anime => resultsDiv.appendChild(createCard(anime)));
    } else if (type === "id") {
      anime = await fetchAnimeById(query);
      resultsDiv.textContent = "";
      resultsDiv.appendChild(createCard(anime));
    } else if (type === "ranking") {
      anime = await fetchAnimeRanking(query);
      resultsDiv.textContent = "";
      resultsDiv.appendChild(createCard(anime))
    }

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
      displayResults(query, type);
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
