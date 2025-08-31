export function ensureSessionId(): string {
  const key = 'ct_session_id';
  try {
    if (typeof window !== 'undefined') {
      const existing = window.localStorage.getItem(key);
      if (existing) return existing;
      const sid = crypto.randomUUID();
      window.localStorage.setItem(key, sid);
      return sid;
    }
  } catch {}
  // Fallback non-browser
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}


