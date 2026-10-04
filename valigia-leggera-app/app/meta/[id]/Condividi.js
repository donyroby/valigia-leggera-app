"use client";

import { useMemo, useRef, useState } from "react";
import s from "@/components/viaggi.module.css";
import { ALL } from "@/lib/viaggi/dati";
import { calc } from "@/lib/viaggi/calcoli";
import { versioni } from "@/lib/viaggi/condividi";

// Condividi e stampa la scheda della meta
export default function Condividi({ destId, params }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const taRef = useRef(null);

  const testi = useMemo(() => {
    if (!open) return null;
    const r = calc(ALL.find((x) => x.id === destId), params);
    const url = typeof window !== "undefined" ? window.location.href : "";
    const t = versioni(r, url);
    const enc = (x) => encodeURIComponent(x).length;
    // WhatsApp e le email hanno limiti di lunghezza: si usa la versione più completa che ci sta
    let wi = t.findIndex((x) => enc(x) <= 6000); if (wi < 0) wi = 3;
    let mi = t.findIndex((x) => enc(x) <= 1900); if (mi < 0) mi = 3;
    let nota = "Il testo contiene il link alla mappa di ogni luogo, i link per prenotare e il link a questa scheda.";
    if (wi === 1) nota = "Per WhatsApp il testo completo era troppo lungo: ho tolto i link per prenotare e tenuto quelli dei luoghi.";
    if (wi >= 2) nota = "Per WhatsApp ho accorciato il testo. Con Copia testo ottieni la versione completa.";
    if (mi > 0) nota += " Nell'email il testo è più corto: usa Copia testo per la versione completa.";
    return { full: t[0], wa: t[wi], mail: t[mi], nota, nome: r.d.name };
  }, [open, destId, params]);

  async function copia() {
    const v = testi.full;
    let ok = false;
    try { await navigator.clipboard.writeText(v); ok = true; } catch {
      try { taRef.current?.select(); ok = document.execCommand("copy"); } catch {}
    }
    setMsg(ok ? "Testo copiato." : "Non riesco a copiare in automatico: il testo è selezionato, usa Copia dal menu del telefono o Ctrl+C.");
  }

  async function condividiCon() {
    try { await navigator.share({ title: "Viaggio a " + testi.nome, text: testi.full }); } catch {}
  }

  const puoCondividere = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className={s.noprint}>
      <div className={s.saveRow}>
        <button type="button" className={`${s.btn} ${s.ghost}`} onClick={() => { setOpen((v) => !v); setMsg(""); }} aria-expanded={open}>
          {open ? "Chiudi condivisione" : "Condividi"}
        </button>
        <button type="button" className={`${s.btn} ${s.ghost}`} onClick={() => { try { window.print(); } catch {} }}>Stampa o salva PDF</button>
      </div>
      {open && testi && (
        <div className={s.sharePanel}>
          <textarea ref={taRef} className={s.shareTxt} rows={10} readOnly value={testi.full} aria-label="Testo da condividere" />
          <div className={s.links}>
            <a className={`${s.btn} ${s.sun}`} href={`https://wa.me/?text=${encodeURIComponent(testi.wa)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className={`${s.btn} ${s.sun}`} href={`mailto:?subject=${encodeURIComponent("Viaggio a " + testi.nome)}&body=${encodeURIComponent(testi.mail)}`}>Email</a>
            <button type="button" className={`${s.btn} ${s.ghost}`} onClick={copia}>Copia testo</button>
            {puoCondividere && <button type="button" className={`${s.btn} ${s.ghost}`} onClick={condividiCon}>Condividi con…</button>}
          </div>
          <p className={s.fine} role="status">{msg || testi.nota}</p>
        </div>
      )}
    </div>
  );
}
