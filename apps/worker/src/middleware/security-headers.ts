import type { MiddlewareHandler } from 'hono';

export function securityHeaders(): MiddlewareHandler {
  return async (c, next) => {
    await next();
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    c.header('Cross-Origin-Resource-Policy', 'same-site');
    // CSP permissiva o suficiente para model-viewer CDN no front; API só JSON.
    c.header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  };
}
