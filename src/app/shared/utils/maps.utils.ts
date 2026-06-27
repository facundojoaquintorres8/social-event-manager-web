export function buildGoogleMapsUrl(lat: number, lng: number): string {
  if (lat == null || lng == null) {
    return '#';
  }
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
