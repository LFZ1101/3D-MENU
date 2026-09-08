import { cn } from '@/lib/utils';

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-start gap-3 border-y border-line py-10', className)}>
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      {description ? <p className="max-w-md text-sm leading-relaxed text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
