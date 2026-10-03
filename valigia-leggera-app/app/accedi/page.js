import { redirect } from "next/navigation";
import Brand from "@/components/Brand";
import LoginForm from "./LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Accedi · Valigia Leggera" };

export default async function AccediPage({ searchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/profilo");

  const params = await searchParams;
  const linkError = params?.errore === "link";

  return (
    <main className="card">
      <Brand />
      <h1>Accedi</h1>
      <p>
        Scrivi la tua email: ti mandiamo un link per entrare. Niente password da
        ricordare, e se è la prima volta l&apos;account si crea da solo.
      </p>
      {linkError && (
        <p className="alert" role="alert">
          Il link non è valido o è scaduto. Chiedine uno nuovo qui sotto, e aprilo
          nello stesso browser da cui lo richiedi.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
