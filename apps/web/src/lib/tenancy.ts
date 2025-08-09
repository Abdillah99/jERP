export function getTenant() {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  return host.split('.')[0];
}
