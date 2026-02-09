export interface PriceHistoryItem {
  compra: number;
  venta: number;
  fecha: string; // ISO date string
}

export interface PriceHistoryResponse {
  current: {
    compra: number;
    venta: number;
    updatedAt: string;
  };
  history: PriceHistoryItem[];
}

const API_URL = process.env.MARKET_DOLLAR_API_URL || import.meta.env.MARKET_DOLLAR_API_URL;
const API_KEY = process.env.MARKET_DOLLAR_API_KEY || import.meta.env.MARKET_DOLLAR_API_KEY;

const URL_PATH = "/api/v1/rates-history";

// ============ CACHÉ EN MEMORIA ============
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

let cachedData: PriceHistoryResponse | null = null;
let cacheTimestamp: number = 0;

function isCacheValid(): boolean {
  return cachedData !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;
}
// ==========================================

export const getPriceHistory = async (): Promise<PriceHistoryResponse> => {
  const defaultResponse: PriceHistoryResponse = {
    current: { compra: 3.7, venta: 3.8, updatedAt: new Date().toISOString() },
    history: [],
  };

  // Retornar caché si es válido
  if (isCacheValid()) {
    return cachedData!;
  }

  if (!API_URL || !API_KEY) {
    console.error("Faltan variables de entorno para API de historial");
    return defaultResponse;
  }

  try {
    const response = await fetch(API_URL + URL_PATH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PostmanRuntime/7.26.8",
        "x-api-key": API_KEY.trim(),
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error API historial (${response.status}): ${errorBody}`);
      return cachedData ?? defaultResponse;
    }

    const json = await response.json();

    if (json.success && json.current && json.history) {
      const result: PriceHistoryResponse = {
        current: {
          compra: parseFloat(json.current.compra),
          venta: parseFloat(json.current.venta),
          updatedAt: json.current.updatedAt,
        },
        history: json.history.map((item: any) => ({
          compra: parseFloat(item.compra),
          venta: parseFloat(item.venta),
          fecha: item.fecha_cambio || item.fecha_actualizacion,
        })),
      };

      // Guardar en caché
      cachedData = result;
      cacheTimestamp = Date.now();

      return result;
    }

    return defaultResponse;
  } catch (error) {
    console.error("Error obteniendo historial de precios:", error);
    return cachedData ?? defaultResponse;
  }
};
