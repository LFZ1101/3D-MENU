import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  analyticsEventSchema,
  UPLOAD_LIMITS,
  ALLOWED_IMAGE_MIME,
  ALLOWED_MODEL_MIME,
  qrRedirectSchema,
} from '@menuar/shared';
import { rateLimit } from './middleware/rate-limit';
import { securityHeaders } from './middleware/security-headers';
import { createLogger } from './services/logger';

type Bindings = {
  MEDIA_BUCKET?: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  R2_PUBLIC_BASE_URL?: string;
  APP_NAME?: string;
  APP_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const logger = createLogger('menuar-worker');

app.use('*', securityHeaders());
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/health', (c) =>
  c.json({
    ok: true,
    app: c.env?.APP_NAME || 'MenuAR',
    timestamp: new Date().toISOString(),
  }),
);

app.get('/api/qr/:shortCode', rateLimit({ limit: 120, windowMs: 60_000 }), async (c) => {
  const parsed = qrRedirectSchema.safeParse({ shortCode: c.req.param('shortCode') });
  if (!parsed.success) return c.json({ error: 'Código inválido' }, 400);

  if (c.env?.SUPABASE_URL && c.env?.SUPABASE_SERVICE_ROLE_KEY) {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/qr_codes?short_code=eq.${encodeURIComponent(parsed.data.shortCode)}&active=eq.true&select=*,restaurants(*)`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );
    if (!response.ok) {
      logger.error('qr_lookup_failed', { status: response.status });
      return c.json({ error: 'Falha ao resolver QR' }, 502);
    }
    const rows = (await response.json()) as Array<Record<string, unknown>>;
    if (!rows[0]) return c.json({ error: 'QR não encontrado' }, 404);
    return c.json({ qr: rows[0] });
  }

  // Fallback de desenvolvimento: contrato estável para o front mock.
  return c.json({
    qr: {
      short_code: parsed.data.shortCode,
      destination_path: '/r/casa-fogo',
      source_type: 'table',
      active: true,
      mock: true,
    },
  });
});

app.get('/api/menu/:slug', rateLimit({ limit: 120, windowMs: 60_000 }), async (c) => {
  const slug = c.req.param('slug');
  if (!slug || slug.length < 2) return c.json({ error: 'Slug inválido' }, 400);

  if (!(c.env?.SUPABASE_URL && c.env?.SUPABASE_SERVICE_ROLE_KEY)) {
    return c.json({
      mock: true,
      message: 'Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para servir menu real.',
      slug,
    });
  }

  const restaurantRes = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/restaurants?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=*`,
    {
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!restaurantRes.ok) return c.json({ error: 'Falha ao buscar restaurante' }, 502);
  const restaurants = (await restaurantRes.json()) as Array<Record<string, unknown>>;
  if (!restaurants[0]) return c.json({ error: 'Restaurante não encontrado' }, 404);

  return c.json({ restaurant: restaurants[0] });
});

app.post('/api/analytics/events', rateLimit({ limit: 60, windowMs: 60_000 }), async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    logger.warn('analytics_rejected', { issues: parsed.error.issues.length });
    return c.json({ error: 'Evento inválido' }, 400);
  }

  if (c.env?.SUPABASE_URL && c.env?.SUPABASE_SERVICE_ROLE_KEY) {
    const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        event_name: parsed.data.eventName,
        restaurant_id: parsed.data.restaurantId,
        unit_id: parsed.data.unitId ?? null,
        product_id: parsed.data.productId ?? null,
        qr_code_id: parsed.data.qrCodeId ?? null,
        anonymous_session_id: parsed.data.anonymousSessionId,
        source: parsed.data.source ?? null,
        table_label: parsed.data.tableLabel ?? null,
        device_type: parsed.data.deviceType ?? null,
        browser_family: parsed.data.browserFamily ?? null,
        os_family: parsed.data.osFamily ?? null,
        occurred_at: parsed.data.occurredAt ?? new Date().toISOString(),
        duration_ms: parsed.data.durationMs ?? null,
        error_code: parsed.data.errorCode ?? null,
        metadata: parsed.data.metadata ?? {},
      }),
    });

    if (!response.ok) {
      logger.error('analytics_persist_failed', { status: response.status });
      return c.json({ error: 'Falha ao registrar evento' }, 502);
    }
  } else {
    logger.info('analytics_mock_accepted', { event: parsed.data.eventName });
  }

  return c.json({ ok: true });
});

app.post('/api/uploads/sign', rateLimit({ limit: 20, windowMs: 60_000 }), async (c) => {
  const auth = c.req.header('Authorization');
  if (!auth) return c.json({ error: 'Não autorizado' }, 401);

  const body = (await c.req.json().catch(() => null)) as {
    restaurantId?: string;
    key?: string;
    contentType?: string;
    sizeBytes?: number;
    kind?: 'image' | 'model';
  } | null;

  if (!body?.restaurantId || !body.key || !body.contentType || !body.sizeBytes || !body.kind) {
    return c.json({ error: 'Payload incompleto' }, 400);
  }

  const allowlist = body.kind === 'image' ? ALLOWED_IMAGE_MIME : ALLOWED_MODEL_MIME;
  if (
    !(allowlist as readonly string[]).includes(body.contentType) &&
    body.contentType !== 'application/octet-stream'
  ) {
    return c.json({ error: 'MIME type não permitido' }, 400);
  }

  const max = body.kind === 'image' ? UPLOAD_LIMITS.imageMaxBytes : UPLOAD_LIMITS.modelMaxBytes;
  if (body.sizeBytes <= 0 || body.sizeBytes > max) {
    return c.json({ error: 'Arquivo excede o limite' }, 400);
  }

  if (!body.key.startsWith(`restaurants/${body.restaurantId}/`)) {
    return c.json({ error: 'Chave de armazenamento inválida' }, 400);
  }

  const uploadUrl = `https://upload.local/${body.key}?signature=dev`;
  return c.json({
    uploadUrl,
    publicUrl: c.env?.R2_PUBLIC_BASE_URL ? `${c.env.R2_PUBLIC_BASE_URL}/${body.key}` : null,
    expiresIn: 120,
  });
});

app.post('/api/uploads/confirm', rateLimit({ limit: 20, windowMs: 60_000 }), async (c) => {
  const auth = c.req.header('Authorization');
  if (!auth) return c.json({ error: 'Não autorizado' }, 401);

  const body = (await c.req.json().catch(() => null)) as {
    restaurantId?: string;
    key?: string;
    sizeBytes?: number;
    mimeType?: string;
  } | null;

  if (!body?.restaurantId || !body.key || !body.sizeBytes || !body.mimeType) {
    return c.json({ error: 'Payload incompleto' }, 400);
  }

  if (!body.key.startsWith(`restaurants/${body.restaurantId}/`)) {
    return c.json({ error: 'Chave inválida' }, 400);
  }

  logger.info('upload_confirmed', {
    restaurantId: body.restaurantId,
    sizeBytes: body.sizeBytes,
    mimeType: body.mimeType,
  });

  return c.json({
    ok: true,
    storageKey: body.key,
    publicUrl: c.env?.R2_PUBLIC_BASE_URL ? `${c.env.R2_PUBLIC_BASE_URL}/${body.key}` : null,
  });
});

app.notFound((c) => c.json({ error: 'Não encontrado' }, 404));

app.onError((err, c) => {
  logger.error('unhandled_error', { message: err.message });
  return c.json({ error: 'Erro interno' }, 500);
});

export default app;
