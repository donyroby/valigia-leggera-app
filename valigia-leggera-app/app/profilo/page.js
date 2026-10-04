import Link from "next/link";
import { redirect } from "next/navigation";
import Brand from "@/components/Brand";
import ProfileForm from "./ProfileForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Il tuo profilo · Valigia Leggera" };

export default async function ProfiloPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/accedi");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, default_profile")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="card">
      <Brand />
      <h1>Il tuo profilo</h1>
      <p>
        Hai fatto l&apos;accesso come <strong>{user.email}</strong>.
      </p>
      <ProfileForm
        userId={user.id}
        initialName={profile?.display_name ?? ""}
        initialProfile={profile?.default_profile ?? "coppia"}
        isNew={!profile}
      />
      <p className="account-line">
        <Link href="/viaggi">I miei viaggi salvati</Link> · <Link href="/salvadanaio">Salvadanaio</Link> · <Link href="/">Cerca un viaggio</Link>
      </p>
      <form action="/auth/esci" method="post" className="logout">
        <button type="submit" className="link-button">
          Esci dall&apos;account
        </button>
      </form>
    </main>
  );
}
