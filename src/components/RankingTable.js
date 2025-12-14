"use client";

import Link from "next/link";
import { buildGoogleDriveImageUrl, buildGoogleDriveThumbnailUrl } from "@/lib/sheets";

export default function RankingTable({ players, scoreType }) {
  const scoreLabel = {
    SUM_OF_POINTS_HISTORICO: "Puntaje Histórico",
    SUM_OF_POINTS_GLOBAL: "Puntaje Global",
    SUM_OF_POINTS_RACE: "Puntaje Race",
  }[scoreType];

  const getFoto = (p) => (p?.FOTO || p?.Foto || p?.foto || "").trim();

  const tournamentKey = scoreType.replace(
    "SUM_OF_POINTS",
    "SUM_OF_TOURNAMENTS"
  );

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = parseFloat(a[scoreType]) || 0;
    const scoreB = parseFloat(b[scoreType]) || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="ranking-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>{scoreLabel}</th>
            <th>Promedio</th>
            <th>Torneos</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const averageKey = scoreType.replace(
              "SUM_OF_POINTS",
              "AVERAGE_OF_POINTS"
            );
            const fotoValue = getFoto(player);
            const fotoSrc =
              buildGoogleDriveImageUrl(fotoValue) ||
              buildGoogleDriveThumbnailUrl(fotoValue, 120);
            return (
              <tr key={player.INDEX || index}>
                <td className="rank">{index + 1}</td>
                <td style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {fotoSrc && (
                    <img
                      src={fotoSrc}
                      alt={player.NAME}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const thumb = buildGoogleDriveThumbnailUrl(fotoValue, 120);
                        if (thumb && e.currentTarget.src !== thumb) {
                          e.currentTarget.src = thumb;
                          return;
                        }
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <Link
                    href={`/player/${encodeURIComponent(player.NAME)}?gender=${
                      player.gender
                    }`}
                    style={{ textDecoration: "none", color: "#667eea" }}
                  >
                    {player.NAME}
                  </Link>
                </td>
                <td>{player.CATEGORY || "-"}</td>
                <td>
                  <strong>{player[scoreType] || 0}</strong>
                </td>
                <td>{parseFloat(player[averageKey] || 0).toFixed(2)}</td>
                <td>{player[tournamentKey] || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
