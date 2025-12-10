// Convierte el Google Sheets a URL de CSV público
const SHEET_ID = "11jcr7on8kUp5V93e33QcdNUJzYFOJRx1-AfsKG4jXt4";
const MALE_SHEET_GID = "0"; // GID de df_player_masculino (generalmente 0)
const FEMALE_SHEET_GID = "1"; // GID de df_player_femenino (generalmente 1)

export const MALE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSaib_jooip3zcBC_I3fganTovf8KFZFBxYqiEygsXMJ0zaUxwBhJmF07uRQgs6VjAtLuTaImyXzHBK/pub?gid=2054985208&single=true&output=csv`;
export const FEMALE_CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSaib_jooip3zcBC_I3fganTovf8KFZFBxYqiEygsXMJ0zaUxwBhJmF07uRQgs6VjAtLuTaImyXzHBK/pub?gid=183727632&single=true&output=csv`;

export async function fetchPlayers(gender) {
  try {
    const url = gender === "masculino" ? MALE_CSV_URL : FEMALE_CSV_URL;
    const response = await fetch(url);
    const csv = await response.text();

    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const players = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(",").map((v) => v.trim());
      const player = {};

      headers.forEach((header, index) => {
        player[header] = values[index] || "";
      });

      players.push(player);
    }

    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}
