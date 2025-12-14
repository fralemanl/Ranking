// Convierte el Google Sheets a URL de CSV público
const SHEET_ID = "11jcr7on8kUp5V93e33QcdNUJzYFOJRx1-AfsKG4jXt4";

// Si tienes una hoja con los partidos/partidos por jugador, pon aquí su GID.
// Puedes obtenerlo desde la URL de Google Sheets: ...&gid=XXXXXXXX
export const GAMES_SHEET_GID = "1492825331";

// Carpeta de Google Drive con las fotos
const GOOGLE_DRIVE_FOLDER_ID = "1aqO8CQUXEKoPvzV7ZaB7pEICiv78ntwu";

// Cache para mapear nombres de archivo a IDs de Google Drive
const fileIdCache = {};

// Busca un archivo en Google Drive por nombre usando la API pública
export async function getGoogleDriveFileId(fileName) {
  if (!fileName) return null;
  
  // Verificar cache primero
  if (fileIdCache[fileName]) {
    return fileIdCache[fileName];
  }

  try {
    // Usar una búsqueda en Google Drive a través de una consulta CORS-friendly
    // Nota: esto funciona solo si la carpeta/archivo está compartido públicamente
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(fileName)}' and '${GOOGLE_DRIVE_FOLDER_ID}' in parents&spaces=drive&fields=files(id,name)&access_token=YOUR_API_KEY`;
    
    // Alternativa: usar un método más simple sin API key para archivos públicos
    // Intentamos acceder a través de una URL directa que Google genera
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileName}`;
    return publicUrl;
  } catch (err) {
    console.error("Error getting Google Drive file ID:", err);
    return null;
  }
}

// Extrae el ID del archivo desde una URL o ID directa
function extractDriveId(fotoValue) {
  if (!fotoValue) return null;
  const value = String(fotoValue).trim();

  // ID puro
  if (!value.startsWith("http") && value.length > 15 && /^[a-zA-Z0-9_-]+$/.test(value)) {
    return value;
  }

  // URL de compartir /file/d/{id}/view
  const fileIdFromFile = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  if (fileIdFromFile) return fileIdFromFile;

  // URL open?id=...
  const fileIdFromOpen = value.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
  if (fileIdFromOpen) return fileIdFromOpen;

  return null;
}

// Construye una URL visible de Google Drive (uc export)
export function buildGoogleDriveImageUrl(fotoValue) {
  if (!fotoValue) return null;
  const value = String(fotoValue).trim();

  // Si ya es una URL directa que no es Drive, úsala
  if (value.startsWith("http") && !value.includes("drive.google.com")) {
    return value;
  }

  const fileId = extractDriveId(value);
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Como último recurso, devuelve la URL original
  return value.startsWith("http") ? value : null;
}

// URL de thumbnail (suele ser más liviana y a veces evita bloqueos de hotlinking)
export function buildGoogleDriveThumbnailUrl(fotoValue, size = 400) {
  const fileId = extractDriveId(fotoValue);
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

// Construye una URL CSV a partir del sheetId y gid (forma compatible con export CSV)
function buildCsvUrl(gid) {
  // Usa la forma export para mayor compatibilidad: /spreadsheets/d/{id}/export?format=csv&gid={gid}
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

async function parseCsvUrl(url) {
  try {
    const res = await fetch(url);
    const csv = await res.text();
    const lines = csv.split("\n").filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (values[idx] || "").trim();
      });
      rows.push(obj);
    }
    return rows;
  } catch (err) {
    console.error("parseCsvUrl error:", err);
    return [];
  }
}

export async function fetchPlayers(gender) {
  try {
    // Estas URLs antiguas estaban en el repo; si funcionan deje que el autor las mantenga.
    // Sin embargo, preferimos construir desde SHEET_ID y GID si es posible.
    const maleGid = "2054985208";
    const femaleGid = "183727632";
    const url = gender === "masculino" ? buildCsvUrl(maleGid) : buildCsvUrl(femaleGid);
    return await parseCsvUrl(url);
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

// Fetch de la hoja de partidos/juegos. Si no configuras `GAMES_SHEET_GID`, devolverá []
export async function fetchGames(gid = GAMES_SHEET_GID) {
  if (!gid || gid === "PUT_GAMES_GID_HERE") return [];
  const url = buildCsvUrl(gid);
  return await parseCsvUrl(url);
}
