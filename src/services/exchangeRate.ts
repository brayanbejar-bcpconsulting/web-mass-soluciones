export interface ExchangeRate {
  compra: number;
  venta: number;
}

const API_URL = process.env.MARKET_DOLLAR_API_URL || import.meta.env.MARKET_DOLLAR_API_URL;
const API_KEY = process.env.MARKET_DOLLAR_API_KEY || import.meta.env.MARKET_DOLLAR_API_KEY;

const URL_PATH = "/api/v1/exchange-rates";

export const getExchangeRate = async (): Promise<ExchangeRate> => {
  // Valores por defecto por seguridad si falla la API
  const defaultRates = { compra: 3.353, venta: 3.365 };

  if (!API_URL || !API_KEY) {
    console.error("Faltan variables de entorno para API del dólar");
    return defaultRates;
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
      console.error(`Error API (${response.status}): ${errorBody}`);
      return defaultRates;
    }

    const json = await response.json();

    // Verificamos si la respuesta tiene la estructura esperada: { success: true, data: { compra: "...", venta: "..." } }
    if (json.success && json.data) {
      return {
        compra: parseFloat(json.data.compra),
        venta: parseFloat(json.data.venta),
      };
    }

    // Fallback si la estructura no coincide pero podría venir plana
    const compra = Number(json.buy ?? json.compra ?? defaultRates.compra);
    const venta = Number(json.sell ?? json.venta ?? defaultRates.venta);

    return { compra, venta };
  } catch (error) {
    console.error("Error obteniendo tipo de cambio:", error);
    return defaultRates;
  }
};
