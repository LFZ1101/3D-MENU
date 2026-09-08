import { useCallback } from 'react';
import type { AnalyticsEventName } from '@menuar/shared';
import { analyticsRepository } from '@/services/repositories';
import { detectDeviceMeta, getAnonymousSessionId } from '@/lib/session';

export function useAnalytics() {
  const track = useCallback(
    async (
      eventName: AnalyticsEventName,
      payload: {
        restaurantId: string;
        productId?: string | null;
        qrCodeId?: string | null;
        unitId?: string | null;
        source?: string | null;
        tableLabel?: string | null;
        durationMs?: number | null;
        errorCode?: string | null;
        metadata?: Record<string, string | number | boolean | null>;
      },
    ) => {
      const device = detectDeviceMeta();
      await analyticsRepository.track({
        eventName,
        restaurantId: payload.restaurantId,
        productId: payload.productId,
        qrCodeId: payload.qrCodeId,
        unitId: payload.unitId,
        source: payload.source,
        tableLabel: payload.tableLabel,
        durationMs: payload.durationMs,
        errorCode: payload.errorCode,
        metadata: payload.metadata,
        anonymousSessionId: getAnonymousSessionId(),
        deviceType: device.deviceType,
        browserFamily: device.browserFamily,
        osFamily: device.osFamily,
        occurredAt: new Date().toISOString(),
      });
    },
    [],
  );

  return { track };
}
