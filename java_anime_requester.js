/* jshint esversion: 8 */
const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
//const RAPIDAPI_KEY = "c3f8c3c722msh4c20a842d8ebbe3p187c73jsned310e13e580";
//const RAPIDAPI_KEY = "df5fe52db4msh6559a929065c42fp1446b6jsn3b2b1e0a9759";

function getApiKey() {
  return sessionStorage.getItem("RAPIDAPI_KEY") || "";
}
document.getElementById("save-api-key").addEventListener("click", () => {
  const key = document.getElementById("api-key").value.trim();
  if (key) {
    sessionStorage.setItem("RAPIDAPI_KEY", key);
    alert("Clé API sauvegardée !");
    loadGenres();
  } else {
    alert("Veuillez entrer une clé API valide.");
  }
});

async function fetchApi(url, single = false) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": RAPIDAPI_HOST,
        "X-RapidAPI-Key": getApiKey()
      }
    });

    if (!response.ok) throw new Error("Erreur réseau : " + response.status);

    const data = await response.json();
    return single ? data : data.data;
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

async function loadGenres() {
  const genreList = document.getElementById("genre-list");
  const genreUrl = `https://${RAPIDAPI_HOST}/genre`;

  try {
    const data = await fetchApi(genreUrl, true);
    const genres = data.data || data;

    genreList.textContent = "";

    genres.forEach(g => {
      const label = document.createElement("label");
      label.style.display = "inline-block";
      label.style.margin = "5px";
      label.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = g._id || g.id || g;
      checkbox.name = "genre";

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + (g._id || g.name || g)));

      genreList.appendChild(label);
    });
  } catch (err) {
    console.error("Erreur lors du chargement des genres :", err);
    genreList.textContent = "Impossible de charger les genres.";
  }
}

async function displayResults(query, type) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.textContent = "Chargement...";

  try {
    let animes = [];
    let url;

    if (type === "name") {
      url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&search=${encodeURIComponent(query)}`;
      animes = await fetchApi(url);
    } 
    else if (type === "id") {
      url = `https://${RAPIDAPI_HOST}/anime/by-id/${encodeURIComponent(query)}`;
      const anime = await fetchApi(url, true);
      animes = [anime];
    } 
    else if (type === "ranking") {
      url = `https://${RAPIDAPI_HOST}/anime/by-ranking/${encodeURIComponent(query)}`;
      const anime = await fetchApi(url, true);
      animes = [anime];
    } 
    else if (type === "genre") {
      const selectedGenres = Array.from(document.querySelectorAll("input[name='genre']:checked"))
                                  .map(cb => cb.value);

      if (selectedGenres.length === 0) {
        resultsDiv.textContent = "Veuillez sélectionner au moins un genre.";
        return;
      }

      url = `https://${RAPIDAPI_HOST}/anime?page=1&size=50&genres=${encodeURIComponent(selectedGenres.join(","))}`;
      animes = await fetchApi(url);
      animes = animes.filter(anime => {
        if (!anime.genres) return false;
        return selectedGenres.every(g => anime.genres.includes(g));
      });

      if (animes.length === 0) {
        resultsDiv.textContent = "Aucun anime ne correspond à tous les genres sélectionnés.";
        return;
      }
    }

    resultsDiv.textContent = "";
    animes.forEach(anime => resultsDiv.appendChild(createCard(anime)));

  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Erreur lors de la récupération des données.";
  }
}

function initTheme() {
  const themeSelect = document.getElementById("theme");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.body.classList.toggle("dark", savedTheme === "dark");
  themeSelect.value = savedTheme;

  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;
    document.body.classList.toggle("dark", selectedTheme === "dark");
    localStorage.setItem("theme", selectedTheme);
  });
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

    if ((type !== "genre" && !query)) {
      document.getElementById("results").textContent = "Veuillez entrer une valeur.";
      return;
    }

    displayResults(query, type);
  });

  resetBtn.addEventListener("click", () => {
    input.value = "";
    document.getElementById("results").textContent = "";
    document.querySelectorAll("input[name='genre']").forEach(cb => cb.checked = false);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  if (getApiKey()) loadGenres();
});

main();