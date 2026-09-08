const SESSION_KEY = 'menuar_anonymous_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function getAnonymousSessionId(): string {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { id: string; expiresAt: number };
      if (parsed.expiresAt > Date.now()) return parsed.id;
    }
    const id = createId();
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id, expiresAt: Date.now() + SESSION_TTL_MS }),
    );
    return id;
  } catch {
    return createId();
  }
}

export function detectDeviceMeta() {
  const ua = navigator.userAgent;
  const deviceType = /Mobi|Android/i.test(ua) ? 'mobile' : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
  const browserFamily = /Edg\//.test(ua)
    ? 'Edge'
    : /Chrome\//.test(ua)
      ? 'Chrome'
      : /Safari\//.test(ua)
        ? 'Safari'
        : /Firefox\//.test(ua)
          ? 'Firefox'
          : 'Other';
  const osFamily = /Android/.test(ua)
    ? 'Android'
    : /iPhone|iPad|iOS/.test(ua)
      ? 'iOS'
      : /Mac OS/.test(ua)
        ? 'macOS'
        : /Windows/.test(ua)
          ? 'Windows'
          : 'Other';
  return { deviceType, browserFamily, osFamily };
}
