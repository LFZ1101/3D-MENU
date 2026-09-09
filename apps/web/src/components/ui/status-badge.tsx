import { cn } from '@/lib/utils';

const toneClass: Record<string, string> = {
  success: 'bg-jade-soft text-jade-dark',
  warning: 'bg-warning/15 text-[#8a5a10]',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-paper text-muted',
  neutral: 'bg-paper text-ink',
};

export function StatusBadge({
  label,
  tone = 'neutral',
  className,
}: {
  label: string;
  tone?: keyof typeof toneClass;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
        toneClass[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
