import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "./globals.css";

export const metadata = {
  title: "Valigia Leggera · Dove ti porta il tuo budget?",
  description:
    "Scegli da dove parti, le date e quanto vuoi spendere a persona: Valigia Leggera ti mostra le mete in Italia, in Europa e nel mondo che stanno nel tuo budget.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
