const BASE = "https://anime-db.p.rapidapi.com";

// If you run a proxy to hide your key, set USE_PROXY = true and set PROXY_BASE to your server endpoint.
const USE_PROXY = false;
const PROXY_BASE = "/api"; // exemple: '/api/anime' => ton serveur doit forwarder vers anime-db

/**
 * Build url for search.
 * @param {Object} opts {search, id, ranking, page, size}
 */
function buildUrl(opts = {}) {
  if (opts.id) {
    // endpoint by id (example)
    return `${BASE}/anime/by-id?id=${encodeURIComponent(opts.id)}`;
  }
  if (opts.ranking) {
    // search by ranking? depends on API: we attempt to query by ranking param.
    return `${BASE}/anime?limit=1&sortBy=ranking&sortOrder=asc&ranking=${encodeURIComponent(opts.ranking)}`;
  }
  const q = opts.search ? `search=${encodeURIComponent(opts.search)}` : "";
  const page = opts.page || 1;
  const size = opts.size || 10;
  return `${BASE}/anime?page=${page}&size=${size}&${q}`;
}

/**
 * Fetch wrapper. If USE_PROXY true, it hits PROXY_BASE and expects proxy to add headers.
 * Otherwise, you must supply RAPIDAPI_KEY (not recommended in public).
 *
 * @param {Object} opts same as buildUrl
 * @param {String} rapidapiKey optional (if USE_PROXY false)
 */
export async function fetchAnimes(opts = {}, rapidapiKey = "") {
  const url = buildUrl(opts);

  if (USE_PROXY) {
    // Proxy mode: POST to proxy with target url (or adjust to your proxy's API)
    const proxyUrl = `${PROXY_BASE}`;
    const resp = await fetch(proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!resp.ok) throw new Error(`Proxy error: ${resp.status}`);
    return resp.json();
  } else {
    // Direct call to RapidAPI (only for dev/testing; don't expose key on public repo)
    if (!rapidapiKey) throw new Error("RapidAPI key required for direct fetch (not recommended).");

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "anime-db.p.rapidapi.com",
        "x-rapidapi-key": rapidapiKey
      }
    });
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`HTTP ${resp.status} - ${txt}`);
    }
    return resp.json();
  }
}