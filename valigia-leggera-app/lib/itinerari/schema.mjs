// Senza import: lo usa la funzione Netlify in background.
// Schema per gli "structured outputs" di Anthropic: la risposta è solo JSON valido, senza brutta copia prima.
// (Senza schema Sonnet 5.5 ragiona per esteso nel testo e scrive il JSON alla fine: ~9000 token e ~60 s.)
const testo = { type: "string" };
export const SCHEMA_ITINERARIO = {
  type: "object", additionalProperties: false, required: ["days", "food"],
  properties: {
    days: { type: "array", items: {
      type: "object", additionalProperties: false, required: ["title", "items", "tip"],
      properties: {
        title: testo, tip: testo,
        items: { type: "array", items: {
          type: "object", additionalProperties: false, required: ["slot", "kind", "name", "area", "what", "dish", "cost"],
          properties: { slot: testo, kind: { type: "string", enum: ["visita", "cibo"] }, name: testo, area: testo, what: testo, dish: testo, cost: { type: ["integer", "null"] } },
        } },
      },
    } },
    food: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "what"], properties: { name: testo, what: testo } } },
  },
};

