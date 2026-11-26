/** Precio con el formato que ya usa la tienda: $59.99 */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

const calendarDateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

/**
 * Fechas sin hora (como "2025-01-15"). JavaScript las interpreta como medianoche UTC,
 * así que se formatean en UTC para que no se corran un día por la zona horaria.
 */
export function formatCalendarDate(date: Date): string {
  return calendarDateFormatter.format(date);
}