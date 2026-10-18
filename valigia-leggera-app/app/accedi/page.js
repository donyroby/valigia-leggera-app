import { redirect } from "next/navigation";
import Brand from "@/components/Brand";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import sv from "@/components/viaggi.module.css";
import LoginForm from "./LoginForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Accedi · Valigia Leggera" };

export default async function AccediPage({ searchParams }) {
  const params = await searchParams;
  const nextRaw = typeof params?.next === "string" ? params.next : "";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/profilo";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  const linkError = params?.errore === "link";
  const eliminato = params?.account === "eliminato";

  return (
    <>
    <div className={sv.page}><TopBar /></div>
    <main className="card">
      <Brand />
      <h1>Accedi</h1>
      <p>
        Scrivi la tua email: ti mandiamo un link per entrare. Niente password da
        ricordare, e se è la prima volta l&apos;account si crea da solo.
      </p>
      {eliminato && (
        <p className="ok" role="status">
          Il tuo account e tutti i tuoi dati sono stati eliminati. Grazie di aver provato Valigia Leggera.
        </p>
      )}
      {linkError && (
        <p className="alert" role="alert">
          Il link è scaduto o è già stato usato: ogni link vale una volta sola e per poco tempo.
          Scrivi qui sotto la tua email per riceverne uno nuovo, e apri sempre l&apos;ultima email arrivata.
        </p>
      )}
      <LoginForm next={next} />
    </main>
    <Footer />
    </>
  );
}
