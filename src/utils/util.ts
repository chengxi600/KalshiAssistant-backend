export function getCurrentNBASeason(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  let seasonStartYear: number;

  if (month >= 10) {
    // October, November, December
    seasonStartYear = year;
  } else {
    // January–September
    seasonStartYear = year - 1;
  }

  const seasonEndYearShort = (seasonStartYear + 1).toString().slice(-2);
  return `${seasonStartYear}-${seasonEndYearShort}`;
}
