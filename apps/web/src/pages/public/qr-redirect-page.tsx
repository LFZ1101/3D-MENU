import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { menuRepository } from '@/services/repositories';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useAnalytics } from '@/hooks/useAnalytics';

export function QrRedirectPage() {
  const { qrCode = '' } = useParams();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['qr', qrCode],
    queryFn: () => menuRepository.resolveQr(qrCode),
  });

  useEffect(() => {
    if (!data) return;
    void track('qr_scanned', {
      restaurantId: data.restaurant.id,
      qrCodeId: data.qr.id,
      tableLabel: data.qr.tableLabel,
      source: data.qr.sourceType,
    }).then(() => {
      const params = new URLSearchParams();
      params.set('src', data.qr.sourceType);
      if (data.qr.tableLabel) params.set('mesa', data.qr.tableLabel);
      params.set('qr', data.qr.id);
      navigate(`${data.qr.destinationPath}?${params.toString()}`, { replace: true });
    });
  }, [data, navigate, track]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <EmptyState
          title="QR Code inválido"
          description="Este código não está ativo ou não foi encontrado."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center text-muted">
      Redirecionando para o cardápio…
    </div>
  );
}
