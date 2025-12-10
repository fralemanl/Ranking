import Link from "next/link";

export default function PlayerPage({ params, searchParams }) {
  const playerName = decodeURIComponent(params.id);
  const gender = searchParams?.gender || "masculino";

  // Nota: Para mostrar datos reales, necesitaríamos un API route que devuelva
  // el objeto del jugador. Por ahora mostramos una página placeholder
  // que el cliente puede mejorar con fetch cliente-side.

  return (
    <div className="player-card">
      <Link href="/" className="back-button">
        ← Volver al ranking
      </Link>
      <h2>{playerName}</h2>
      <p>
        <strong>Género:</strong>{" "}
        {gender === "femenino" ? "Femenino" : "Masculino"}
      </p>
      <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "1rem" }}>
        Para ver más detalles del jugador, abre desde la tabla de ranking.
      </p>
    </div>
  );
}
