import s from "@/components/viaggi.module.css";
import Link from "next/link";
import { PARTS, fmt, links } from "@/lib/viaggi/calcoli";
import { versoIndirizzo } from "@/lib/viaggi/parametri";

// Scheda di una meta, come il "biglietto" del prototipo
export default function PassCard({ r, over, budget, piggy }) {
  const { d, parts, total, pp, p } = r;
  const diff = pp - budget;
  const L = links(r);
  const ext = { target: "_blank", rel: "noopener noreferrer" };
  return (
    <article className={`${s.pass} ${over ? s.over : ""}`}>
      <div className={s.passMain}>
        <div className={s.passTop}>
          <h3>{d.name}</h3>
          <span className={s.tag}>{d.it ? "Italia" : d.cc}</span>
        </div>
        <p className={s.note}>{d.note}</p>
        <div className={s.bar} role="img" aria-label="Ripartizione dei costi">
          {PARTS.map(([k, , c]) => <b key={k} style={{ width: (parts[k] / total * 100).toFixed(1) + "%", background: c }} />)}
        </div>
        <ul className={s.legend}>
          {PARTS.map(([k, l, c]) => (
            <li key={k}>
              <i style={{ background: c }} />
              {k === "trav" ? (d.mode === "treno" ? "Treno/bus (~" + r.hrs + ")" : r.voloReale ? "Volo reale" : "Volo (~" + r.hrs + ", stima)") : l} {fmt(parts[k])}
            </li>
          ))}
        </ul>
        {r.note && <p className={s.fine}>{r.note}</p>}
        <div className={s.badges}>
          <span className={s.badgeAi}><svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0l1.8 5.2L15 7l-5.2 1.8L8 14l-1.8-5.2L1 7l5.2-1.8z" /></svg>Itinerario su misura</span>
          {piggy && piggy.monthly > 0 && (() => {
            const manca = Math.max(0, pp - piggy.saved);
            const mesi = Math.ceil(manca / piggy.monthly);
            return <span className={s.badgePig}>{manca === 0 ? "Salvadanaio: puoi già andarci" : `Salvadanaio: ci arrivi in ${mesi} ${mesi === 1 ? "mese" : "mesi"}`}</span>;
          })()}
        </div>
      </div>
      <div className={s.passStub}>
        <div className={s.pp}>{fmt(pp)}<small>a persona</small></div>
        {r.voloReale && (
          <div className={s.voloTag}>Volo vero da {fmt(r.voloReale.prezzo)} a/r{r.voloReale.tipo === "date_vicine" ? ", date vicine" : ""}</div>
        )}
        <div className={s.tot}>{fmt(total)} per {p.people} {p.people === 1 ? "persona" : "persone"}, {p.nights} notti</div>
        <div className={`${s.status} ${diff <= 0 ? s.ok : s.no}`}>{diff <= 0 ? "Dentro il budget" : "+" + fmt(diff) + " oltre il budget"}</div>
        <Link className={s.btn} href={`/meta/${d.id}?${versoIndirizzo(p)}`}>Dettagli e itinerario</Link>
        <div className={s.qlinks}>
          {L.voli.length > 0 && <a className={`${s.btn} ${s.ghost} ${s.sm}`} href={L.voli[0][1]} {...ext}>Voli</a>}
          {L.treni.length > 0 && <a className={`${s.btn} ${s.ghost} ${s.sm}`} href={L.treni[0][1]} {...ext}>Treni</a>}
          <a className={`${s.btn} ${s.ghost} ${s.sm}`} href={L.alloggi[0][1]} {...ext}>Alloggi</a>
        </div>
      </div>
    </article>
  );
}
