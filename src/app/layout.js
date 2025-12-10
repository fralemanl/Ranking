import "./globals.css";

export const metadata = {
  title: "Ranking de Pádel - Panamá",
  description: "Ranking oficial de jugadores de pádel en Panamá",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="header-content">
            <h1>Ranking de Pádel Panamá</h1>
            <p>Ranking oficial de jugadores</p>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>
            &copy; 2025 Ranking de Pádel Panamá. Todos los derechos reservados.
          </p>
        </footer>
      </body>
    </html>
  );
}
