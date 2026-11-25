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