// java_anime_requester.js

// Récupération des éléments du DOM
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resetBtn = document.getElementById("reset-btn");
const resultsDiv = document.getElementById("results");
const filterSelect = document.getElementById("filter-select");

// Fonction pour rechercher un anime
async function searchAnime(query, type = "") {
  try {
    resultsDiv.innerHTML = "<p>Chargement...</p>";

    // API Jikan (MyAnimeList)
    let url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;
    if (type && type !== "all") {
      url += `&type=${type}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de chargement");

    const data = await response.json();
    displayResults(data.data);
  } catch (error) {
    resultsDiv.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

// Affichage des résultats
function displayResults(animes) {
  if (animes.length === 0) {
    resultsDiv.innerHTML = "<p>Aucun résultat trouvé.</p>";
    return;
  }

  resultsDiv.innerHTML = ""; // reset

  animes.forEach((anime) => {
    const card = document.createElement("div");
    card.classList.add("anime-card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" width="120">
      <h3>${anime.title}</h3>
      <p><strong>Type :</strong> ${anime.type}</p>
      <p><strong>Épisodes :</strong> ${anime.episodes ?? "?"}</p>
      <p><strong>Note :</strong> ${anime.score ?? "?"}</p>
    `;

    resultsDiv.appendChild(card);
  });
}

// Événement recherche
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = input.value.trim();
  const type = filterSelect.value;

  if (query) {
    searchAnime(query, type);
  } else {
    resultsDiv.innerHTML = "<p style='color:orange;'>Veuillez entrer un nom d’anime.</p>";
  }
});

// Événement reset
resetBtn.addEventListener("click", () => {
  input.value = "";
  resultsDiv.innerHTML = "";
});

// Changement du filtre (menu déroulant)
filterSelect.addEventListener("change", () => {
  const query = input.value.trim();
  if (query) {
    searchAnime(query, filterSelect.value);
  }
});
