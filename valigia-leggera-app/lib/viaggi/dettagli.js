// Aggiunge a una meta completa i suoi luoghi, le serate e la gita (solo per la scheda della meta).
// Le voci generiche ("Cena di pesce", "Tè alla menta") sono segnate con gen: niente link alla mappa.
import { ITINERARI } from "./mete-itinerari";

const GENERICHE = "Cena Pranzo Colazione Tè Caffè Aperitivo Birra Birreria Birrificio Bar Vino Degustazione Locali Locale Musica Cocktail Narghilè Street Spettacolo Serata Passeggiata Tramonto Cielo Pesce Fonduta Hammam Massaggio Concerto Fiaccolata Comedy Blues Rooftop Cucina Formaggio Salumi Ostriche Cozze Liquore Rum Fish Hot Gelato Lezione Escursione Corso Giro Caccia Foto Incontro Sauna".split(" ");
const generica = (n) => GENERICHE.includes(n.split(/[\s']/)[0]) && !/[A-ZÀ-Ý]/.test(n.slice(1));
const voci = (s) => s.split(";").map((x) => { const [n, c] = x.split("|"); const v = { n, c: parseFloat(c) }; if (generica(n)) v.gen = true; return v; });

export function conDettagli(d) {
  if (!d || d.day) return d;
  const x = ITINERARI[d.id];
  if (!x) return d;
  return { ...d, day: voci(x[0]), eve: voci(x[1]), gita: x[2] };
}
