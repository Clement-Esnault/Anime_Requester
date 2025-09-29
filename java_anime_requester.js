const boutonRechercher = document.getElementById("Rechercher");
const boutonEffacer = document.getElementById("Effacer");
const zoneResultats = document.getElementById("resultats");
const inputAnime = document.getElementById("animeName");

const RAPIDAPI_HOST = "anime-db.p.rapidapi.com";
const RAPIDAPI_KEY = "df5fe52db4msh6559a929065c42fp1446b6jsn3b2b1e0a9759";

boutonRechercher.addEventListener("click", async () => {
    const nom = inputAnime.value.trim();
    if (!nom) {
        zoneResultats.innerHTML = "<p>Veuillez saisir un nom d’anime.</p>";
        return;
    }

    const query = encodeURIComponent(nom);
    const url = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${query}&genres=Fantasy,Drama&sortBy=ranking&sortOrder=asc`;

    const options = {
        method: "GET",
        headers: {
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();


        console.log("Réponse API :", data);

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
                    <p>${anime.synopsis ? anime.synopsis.substring(0, 150) + "..." : "Pas de résumé disponible."}</p>
                </div>
            `;

            zoneResultats.appendChild(card);
        });

    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        zoneResultats.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
    }
});

boutonEffacer.addEventListener("click", () => {
    inputAnime.value = "";
    zoneResultats.innerHTML = "";
})

