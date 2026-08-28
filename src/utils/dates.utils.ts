export function isExpiredDate(date: Date) {
  return date < new Date();
}

export function getDateExpirationMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function getDateExpirationDays(days: number) {
  return new Date(Date.now() + days);
}
