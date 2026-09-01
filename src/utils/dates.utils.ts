export function isExpiredDate(date: Date): boolean {
  return date < new Date();
}

export function getMinutesMs(minutes: number): number {
  return minutes * 60 * 1000;
}

export function getDaysMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

export function getDateExpirationMinutes(minutes: number): Date {
  return new Date(Date.now() + getMinutesMs(minutes));
}

export function getDateExpirationDays(days: number): Date {
  return new Date(Date.now() + days);
}
