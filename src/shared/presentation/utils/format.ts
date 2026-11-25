const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormat = new Intl.DateTimeFormat('es-CO', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatDate(value: Date): string {
  return Number.isNaN(value.getTime()) ? '—' : dateFormat.format(value);
}
