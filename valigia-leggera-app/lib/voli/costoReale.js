// Costo "misto": il volo reale al posto della stima del trasporto, il resto resta stimato.
// Il prezzo del volo è a persona: lo moltiplichiamo per tutte le persone (i bambini spesso pagano
// poco meno, quindi è una stima prudente).
export function conVoloReale(r, volo) {
  if (!volo) return r;
  const trav = volo.prezzo * r.p.people;
  const parts = { ...r.parts, trav };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return { ...r, parts, total, pp: Math.round(total / r.p.people), voloReale: volo };
}
