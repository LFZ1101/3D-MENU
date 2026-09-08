import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-gradient-to-r from-line via-white to-line bg-[length:200%_100%]',
        className,
      )}
      aria-hidden
    />
  );
}
