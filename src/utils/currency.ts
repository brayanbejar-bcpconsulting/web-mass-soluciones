// Formatea una fecha de ISO (2024-05-20) a formato corto (20 may)
export const formatDateForChart = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'short' 
  }).replace('.', '');
};

// Formatea un número al estándar de moneda local con 3 decimales
export const formatPEN = (amount: number): string => {
  return `S/ ${amount.toFixed(3)}`;
};