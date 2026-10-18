import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import sv from "@/components/viaggi.module.css";
import ProfileForm from "./ProfileForm";
import IMieiDati from "./IMieiDati";
import { createClient } from "@/lib/supabase/server";
import { GRATUITI } from "@/lib/itinerari/temi";

export const metadata = { title: "Il tuo profilo · Valigia Leggera" };

export default async function ProfiloPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/accedi");

  const [{ data: profile }, { data: prem }, { count: usati }] = await Promise.all([
    supabase.from("profiles").select("display_name, default_profile").eq("id", user.id).maybeSingle(),
    supabase.from("premium").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase.from("itinerari").select("id", { count: "exact", head: true }),
  ]);
  const restanti = Math.max(0, GRATUITI - (usati || 0));

  return (
    <>
    <div className={sv.page}><TopBar /></div>
    <main className="card">
      <h1>Il tuo profilo</h1>
      <p>
        Hai fatto l&apos;accesso come <strong>{user.email}</strong>.
      </p>
      {prem ? (
        <p className="piano piano-premium"><strong>✦ Il tuo piano: Premium</strong><br />Itinerari su misura senza il limite dei {GRATUITI} gratuiti.</p>
      ) : (
        <p className="piano">
          <strong>Il tuo piano: Gratuito</strong><br />
          {restanti === 1 ? "Ti resta 1 itinerario su misura" : `Ti restano ${restanti} itinerari su misura`} su {GRATUITI}. <Link href="/premium">Scopri il premium</Link>
        </p>
      )}
      <ProfileForm
        userId={user.id}
        initialName={profile?.display_name ?? ""}
        initialProfile={profile?.default_profile ?? "coppia"}
        isNew={!profile}
      />
      <p className="account-line">
        <Link href="/viaggi">I miei viaggi salvati</Link> · <Link href="/salvadanaio">Salvadanaio</Link> · <Link href="/premium">Premium</Link> · <Link href="/">Cerca un viaggio</Link>
      </p>
      <IMieiDati email={user.email} />
      <form action="/auth/esci" method="post" className="logout">
        <button type="submit" className="link-button">
          Esci dall&apos;account
        </button>
      </form>
    </main>
    <Footer />
    </>
  );
}
