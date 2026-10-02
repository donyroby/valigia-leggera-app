import "./globals.css";

export const metadata = {
  title: "Valigia Leggera",
  description:
    "Valigia Leggera: viaggi in Italia e in Europa dentro il tuo budget. La versione vera è in costruzione.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
