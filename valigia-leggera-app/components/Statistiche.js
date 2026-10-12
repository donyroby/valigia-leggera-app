"use client";
// Statistiche visite con GoatCounter: niente cookie, niente dati personali, solo conteggi.
// Si conta il percorso della pagina (es. /meta/par); dai parametri GoatCounter legge solo quelli di campagna (utm, ref).
// Per escludere le proprie visite: aprire una volta valigialeggera.it/#toggle-goatcounter
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CONTA = "https://valigialeggera.goatcounter.com/count";
const sitoVero = () => window.location.hostname.endsWith("valigialeggera.it");

export default function Statistiche() {
  const path = usePathname();
  useEffect(() => {
    if (!sitoVero()) return;
    const conta = () => window.goatcounter.count({ path });
    if (window.goatcounter?.count) { conta(); return; }
    // Prima visita: lo script si sta ancora caricando
    const t = setInterval(() => { if (window.goatcounter?.count) { clearInterval(t); conta(); } }, 250);
    const stop = setTimeout(() => clearInterval(t), 10000);
    return () => { clearInterval(t); clearTimeout(stop); };
  }, [path]);
  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={CONTA}
      data-goatcounter-settings='{"no_onload": true}'
      strategy="afterInteractive"
    />
  );
}
