export function clearResults(container){
  container.innerHTML = "";
}

export function showMessage(container, message){
  clearResults(container);
  const p = document.createElement("p");
  p.textContent = message;
  container.appendChild(p);
}

/**
 * Create and append a card for one anime object (structure dépend de l'API)
 * expected fields: title, image, synopsis, genres, ranking, episodes
 */
export function appendAnimeCard(container, anime) {
  const card = document.createElement("article");
  card.className = "anime-card";
  card.tabIndex = 0;
  // image
  const img = document.createElement("img");
  img.alt = anime.title ?? "Affiche anime";
  img.src = anime.image ?? "";
  img.loading = "lazy";

  const info = document.createElement("div");
  info.className = "info";

  const title = document.createElement("h3");
  title.textContent = anime.title ?? "Titre inconnu";

  const synopsis = document.createElement("p");
  synopsis.textContent = anime.synopsis ? (anime.synopsis.length > 300 ? anime.synopsis.slice(0,300) + "..." : anime.synopsis) : "Résumé indisponible.";

  const meta = document.createElement("div");
  meta.className = "meta";
  const genres = Array.isArray(anime.genres) ? anime.genres.join(", ") : (anime.genres || "—");
  const rank = anime.ranking ? `Classement: ${anime.ranking}` : "";
  const eps = anime.episodes ? `Episodes: ${anime.episodes}` : "";

  meta.textContent = [genres, rank, eps].filter(Boolean).join(" • ");

  info.appendChild(title);
  info.appendChild(synopsis);
  info.appendChild(meta);

  card.appendChild(img);
  card.appendChild(info);
  container.appendChild(card);
}