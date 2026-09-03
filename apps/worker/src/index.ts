import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { analyticsEventSchema, UPLOAD_LIMITS, ALLOWED_IMAGE_MIME, ALLOWED_MODEL_MIME } from '@menuar/shared';
import { rateLimit } from './middleware/rate-limit';
import { createLogger } from './services/logger';

type Bindings = {
  MEDIA_BUCKET: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  R2_PUBLIC_BASE_URL?: string;
  APP_NAME?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
const logger = createLogger('menuar-worker');

app.use('*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/health', (c) =>
  c.json({
    ok: true,
    app: c.env?.APP_NAME || 'MenuAR',
    timestamp: new Date().toISOString(),
  }),
);

app.post('/api/analytics/events', rateLimit({ limit: 60, windowMs: 60_000 }), async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    logger.warn('analytics_rejected', { issues: parsed.error.issues.length });
    return c.json({ error: 'Evento inválido' }, 400);
  }

  // Persistência real via Supabase service role quando configurada.
  if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
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

  const body = await c.req.json().catch(() => null) as {
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
  if (!(allowlist as readonly string[]).includes(body.contentType) && body.contentType !== 'application/octet-stream') {
    return c.json({ error: 'MIME type não permitido' }, 400);
  }

  const max = body.kind === 'image' ? UPLOAD_LIMITS.imageMaxBytes : UPLOAD_LIMITS.modelMaxBytes;
  if (body.sizeBytes <= 0 || body.sizeBytes > max) {
    return c.json({ error: 'Arquivo excede o limite' }, 400);
  }

  if (!body.key.startsWith(`restaurants/${body.restaurantId}/`)) {
    return c.json({ error: 'Chave de armazenamento inválida' }, 400);
  }

  // Em produção, gerar URL assinada real do R2.
  // Aqui retornamos um contrato estável para o front-end.
  const uploadUrl = `https://upload.local/${body.key}?signature=dev`;
  return c.json({
    uploadUrl,
    publicUrl: c.env.R2_PUBLIC_BASE_URL
      ? `${c.env.R2_PUBLIC_BASE_URL}/${body.key}`
      : null,
    expiresIn: 120,
  });
});

app.notFound((c) => c.json({ error: 'Não encontrado' }, 404));

app.onError((err, c) => {
  logger.error('unhandled_error', { message: err.message });
  return c.json({ error: 'Erro interno' }, 500);
});

export default app;
