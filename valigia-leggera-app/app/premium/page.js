import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import s from "@/components/viaggi.module.css";
import { createClient } from "@/lib/supabase/server";
import { GRATUITI } from "@/lib/itinerari/temi";
import Premium from "./Premium";

export const metadata = { title: "Premium · Valigia Leggera" };

// Premium: per ora si raccolgono le richieste; i pagamenti si attivano dopo il lancio
export default async function PremiumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let premium = false, richiesta = null, usati = 0;
  if (user) {
    const [pr, rq, cnt] = await Promise.all([
      supabase.from("premium").select("user_id").eq("user_id", user.id).maybeSingle(),
      supabase.from("premium_richieste").select("offerta").eq("user_id", user.id).maybeSingle(),
      supabase.from("itinerari").select("id", { count: "exact", head: true }),
    ]);
    premium = !!pr.data;
    richiesta = rq.data?.offerta || null;
    usati = cnt.count || 0;
  }
  return (
    <div className={s.page}>
      <TopBar />
      <section className={s.hero}>
        <h1>Itinerari su misura, senza limiti</h1>
        <p>
          Con l&apos;account hai {GRATUITI} itinerari su misura gratuiti. Con il premium ne crei quanti ne servono:
          per confrontare più mete, cambiare temi o rigenerare finché l&apos;itinerario non è quello giusto.
        </p>
      </section>
      <Premium loggedIn={!!user} premium={premium} richiestaIniziale={richiesta} usati={usati} gratuiti={GRATUITI} />
      <Footer />
    </div>
  );
}
