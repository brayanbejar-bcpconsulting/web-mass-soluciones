/**
 * Utilidades para manejar parámetros UTM y query strings
 * Propaga UTMs desde la landing hacia app.market-dollar.com
 */

/**
 * Obtiene los parámetros UTM de la URL actual
 */
export function getUTMParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  
  const params = new URLSearchParams(window.location.search);
  const utmParams = new URLSearchParams();
  
  // Capturar todos los parámetros que empiecen con 'utm_'
  params.forEach((value, key) => {
    if (key.startsWith('utm_')) {
      utmParams.set(key, value);
    }
  });
  
  return utmParams;
}

/**
 * Construye una URL con los parámetros UTM preservados
 */
export function buildURLWithUTM(baseUrl: string): string {
  const utmParams = getUTMParams();
  
  if (utmParams.toString() === '') {
    return baseUrl;
  }
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${utmParams.toString()}`;
}
