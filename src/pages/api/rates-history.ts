import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const API_URL = process.env.MARKET_DOLLAR_API_URL || import.meta.env.MARKET_DOLLAR_API_URL;
  const API_KEY = process.env.MARKET_DOLLAR_API_KEY || import.meta.env.MARKET_DOLLAR_API_KEY;

  const defaultResponse = {
    current: { compra: 3.7, venta: 3.8, updatedAt: new Date().toISOString() },
    history: [],
  };

  if (!API_URL || !API_KEY) {
    console.error("Faltan variables de entorno para historial");
    return new Response(JSON.stringify(defaultResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(API_URL + "/api/v1/rates-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY.trim(),
      },
    });

    if (!response.ok) {
      console.error(`Error API historial: ${response.status}`);
      return new Response(JSON.stringify(defaultResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await response.json();

    if (json.success && json.current && json.history) {
      const result = {
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

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return new Response(JSON.stringify(defaultResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return new Response(JSON.stringify(defaultResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};