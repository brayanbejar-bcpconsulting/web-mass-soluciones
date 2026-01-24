import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const days = url.searchParams.get('days') || '30';
  
  try {
    const response = await fetch(
      `https://dolar.pe/api/public/series?pair=USD-PEN&days=${days}`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok) throw new Error('Error al consultar API externa');

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600' // Datos cacheados por 1 hora
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fallo al obtener datos' }), { status: 500 });
  }
};