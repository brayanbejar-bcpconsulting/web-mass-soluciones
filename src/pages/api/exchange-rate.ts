import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const API_URL = process.env.MARKET_DOLLAR_API_URL || import.meta.env.MARKET_DOLLAR_API_URL;
  const API_KEY = process.env.MARKET_DOLLAR_API_KEY || import.meta.env.MARKET_DOLLAR_API_KEY;

  const defaultRates = { compra: 3.354, venta: 3.365 };

  if (!API_URL || !API_KEY) {
    console.error(" FALTA ENV - API_URL:", !!API_URL, "API_KEY:", !!API_KEY);
    return new Response(JSON.stringify(defaultRates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(API_URL + "/api/v1/exchange-rates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY.trim(),
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error API (${response.status}): ${errorBody}`);
      return new Response(JSON.stringify(defaultRates), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await response.json();

    if (json.success && json.data) {
      const rates = {
        compra: parseFloat(json.data.compra),
        venta: parseFloat(json.data.venta),
      };

      return new Response(JSON.stringify(rates), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const compra = Number(json.buy ?? json.compra ?? defaultRates.compra);
    const venta = Number(json.sell ?? json.venta ?? defaultRates.venta);

    return new Response(JSON.stringify({ compra, venta }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error obteniendo tipo de cambio:", error);
    return new Response(JSON.stringify(defaultRates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};