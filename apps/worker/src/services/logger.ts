type LogLevel = 'info' | 'warn' | 'error';

export function createLogger(scope: string) {
  function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const payload = {
      level,
      scope,
      message,
      meta: meta ?? {},
      at: new Date().toISOString(),
    };
    // Nunca registrar tokens ou URLs assinadas completas.
    console[level === 'info' ? 'log' : level](JSON.stringify(payload));
  }

  return {
    info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
    error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
  };
}
