import type { MiddlewareHandler } from 'hono';

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: {
  limit: number;
  windowMs: number;
}): MiddlewareHandler {
  return async (c, next) => {
    const key = `${c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'local'}:${c.req.path}`;
    const now = Date.now();
    const current = hits.get(key);
    if (!current || current.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      await next();
      return;
    }
    if (current.count >= options.limit) {
      return c.json({ error: 'Muitas requisições' }, 429);
    }
    current.count += 1;
    await next();
  };
}
