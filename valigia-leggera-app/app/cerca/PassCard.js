import s from "@/components/viaggi.module.css";
import Link from "next/link";
import { PARTS, fmt, links } from "@/lib/viaggi/calcoli";
import { versoIndirizzo } from "@/lib/viaggi/parametri";

// Scheda di una meta, come il "biglietto" del prototipo
export default function PassCard({ r, over, budget }) {
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
              {k === "trav" ? (d.mode === "treno" ? "Treno/bus" : "Volo") + " (~" + r.hrs + ")" : l} {fmt(parts[k])}
            </li>
          ))}
        </ul>
        {r.note && <p className={s.fine}>{r.note}</p>}
      </div>
      <div className={s.passStub}>
        <div className={s.pp}>{fmt(pp)}<small>a persona</small></div>
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
