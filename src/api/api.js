// Indirizzo del finto server (json-server) che serve i dati dal file db.json.
export const API_URL = "http://localhost:3001";

// Funzione "centrale" che fa la chiamata al server con fetch.
// La uso ovunque così non riscrivo fetch ogni volta (principio DRY).
async function request(path, options = {}) {
  // await = aspetto la risposta del server (per questo la funzione è async).
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" }, // dico che mando/ricevo JSON
    ...options, // qui arrivano method (POST/PUT/...) e body se presenti
  });

  // Se la risposta NON è ok (es. 404), lancio un errore: lo catturerà il thunk.
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  // La DELETE non restituisce nulla, quindi gestisco il corpo vuoto.
  const text = await res.text();
  const data = text ? JSON.parse(text) : null; // da testo a oggetto JavaScript

  // L'header X-Total-Count contiene il numero totale di elementi:
  // mi serve per la paginazione (calcolare quante pagine ci sono).
  const totalCount = res.headers.get("X-Total-Count");
  return { data, totalCount: totalCount ? Number(totalCount) : null };
}

// Scorciatoie per i vari metodi HTTP: i thunk scrivono api.get("/movies") ecc.
export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
