
import { fetchAnimes } from "api.js";
import { clearResults, showMessage, appendAnimeCard } from "ui.js";

const form = document.getElementById("searchForm");
const btnEffacer = document.getElementById("Effacer");
const zoneResultats = document.getElementById("resultats");
const inputName = document.getElementById("animeName");
const inputId = document.getElementById("animeId");
const inputRanking = document.getElementById("ranking");

const RAPIDAPI_KEY = ""; 

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  clearResults(zoneResultats);

  const name = inputName.value.trim();
  const id = inputId.value.trim();
  const ranking = inputRanking.value.trim();

  if (!name && !id && !ranking) {
    showMessage(zoneResultats, "Veuillez saisir un titre, un identifiant ou un classement.");
    return;
  }

  try {
    showMessage(zoneResultats, "Recherche en cours...");

    const opts = {};
    if (id) opts.id = id;
    else if (ranking) opts.ranking = ranking;
    else opts.search = name;

    const data = await fetchAnimes(opts, RAPIDAPI_KEY);

    const results = Array.isArray(data.data) ? data.data : (data.anime ? data.anime : []);

    clearResults(zoneResultats);

    if (!results || results.length === 0) {
      showMessage(zoneResultats, "Aucun anime trouvé.");
      return;
    }

    if (id || ranking) {
      appendAnimeCard(zoneResultats, results[0]);
    } else {
      const max = Math.min(results.length, 10);
      for (let i=0;i<max;i++) appendAnimeCard(zoneResultats, results[i]);
    }

  } catch (err) {
    console.error(err);
    showMessage(zoneResultats, "Erreur lors de la récupération des données.");
  }
});

btnEffacer.addEventListener("click", () => {
  inputName.value = "";
  inputId.value = "";
  inputRanking.value = "";
  clearResults(zoneResultats);
});