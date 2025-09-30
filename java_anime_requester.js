
import { fetchAnimes } from "api.js";
import { clearResults, showMessage, appendAnimeCard } from "ui.js";

const boutonRechercher = document.getElementById("Rechercher");
    const boutonEffacer = document.getElementById("Effacer");
    const zoneResultats = document.getElementById("resultats");
    const inputAnime = document.getElementById("animeName");

    const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
    const RAPIDAPI_KEY = "TA_CLE_API_ICI";

    boutonRechercher.addEventListener("click", async () => {
      const nom = inputAnime.value.trim();
      if (!nom) {
        zoneResultats.innerHTML = "<p>Veuillez saisir un nom d’anime.</p>";
        return;
      }

      const query = encodeURIComponent(nom);
      const url = `https://${RAPIDAPI_HOST}/anime?page=1&size=10&search=${query}`;

      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY
        }
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        zoneResultats.innerHTML = "";
        if (!data.data || data.data.length === 0) {
          zoneResultats.innerHTML = "<p>Aucun anime trouvé.</p>";
          return;
        }
        data.data.forEach(anime => {
          const card = document.createElement("div");
          card.classList.add("anime-card");
          card.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <div>
              <h3>${anime.title}</h3>
              <p>${anime.synopsis ? anime.synopsis.substring(0, 150) + "..." : "Pas de résumé."}</p>
              <p><strong>Genres :</strong> ${anime.genres.join(", ")}</p>
              <p><strong>Classement :</strong> ${anime.ranking}</p>
              <p><strong>Épisodes :</strong> ${anime.episodes}</p>
            </div>
          `;
          zoneResultats.appendChild(card);
        });
      } catch (error) {
        zoneResultats.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
      }
    });

    boutonEffacer.addEventListener("click", () => {
      inputAnime.value = "";
      zoneResultats.innerHTML = "";
    });