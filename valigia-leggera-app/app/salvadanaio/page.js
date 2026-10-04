import { redirect } from "next/navigation";
import Salvadanaio from "./Salvadanaio";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Salvadanaio · Valigia Leggera" };

export default async function SalvadanaioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/accedi?next=/salvadanaio");

  const [{ data: piggy }, { data: trips }, { data: profile }] = await Promise.all([
    supabase.from("piggy_bank").select("monthly, saved, target").eq("user_id", user.id).maybeSingle(),
    supabase.from("saved_trips").select("*"),
    supabase.from("profiles").select("default_profile").eq("id", user.id).maybeSingle(),
  ]);

  return (
    <Salvadanaio
      userId={user.id}
      initial={{ saved: Number(piggy?.saved) || 0, monthly: Number(piggy?.monthly) || 0, target: Number(piggy?.target) || 0 }}
      trips={trips || []}
      defaultProfile={profile?.default_profile || null}
    />
  );
}
