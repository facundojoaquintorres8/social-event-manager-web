export function buildGoogleMapsUrl(latitude?: number, longitude?: number): string {
  if (latitude == null || longitude == null) {
    return '#';
  }
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
