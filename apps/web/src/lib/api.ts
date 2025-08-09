import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
