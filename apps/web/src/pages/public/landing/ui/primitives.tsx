import { Link } from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('lp-eyebrow', className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('max-w-3xl space-y-4', align === 'center' && 'mx-auto text-center')}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="lp-section-title text-[var(--lp-text)]">{title}</h2>
      {subtitle ? (
        <div className={cn('lp-subtitle', align === 'center' && 'mx-auto')}>{subtitle}</div>
      ) : null}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'primary' | 'secondary';
};

export function LandingButton({
  asChild = false,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'lp-btn',
        variant === 'primary' ? 'lp-btn-primary' : 'lp-btn-secondary',
        className,
      )}
      {...props}
    />
  );
}

export function DeviceMockup({ className }: { className?: string }) {
  return (
    <div className={cn('lp-phone', className)} aria-hidden="true">
      <div className="flex h-full flex-col overflow-hidden bg-[#0e1311] pt-10">
        <div className="px-4 pb-3">
          <div className="h-2 w-16 rounded-full bg-white/15" />
          <div className="mt-3 h-5 w-28 rounded-md bg-[var(--lp-accent)]/80" />
          <div className="mt-2 h-2 w-full rounded-full bg-white/10" />
        </div>
        <div className="flex gap-2 overflow-hidden px-4">
          {['Todos', 'Burgers', 'Porções'].map((item, index) => (
            <span
              key={item}
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                index === 1 ? 'bg-[var(--lp-accent)] text-[#050706]' : 'bg-white/10 text-white/70',
              )}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-4 flex-1 space-y-3 overflow-hidden px-3 pb-4">
          {[0, 1].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage:
                    item === 0
                      ? 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=70)'
                      : 'url(https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=70)',
                }}
              />
              <div className="space-y-1.5 p-3">
                <div className="h-2.5 w-24 rounded bg-white/25" />
                <div className="h-2 w-16 rounded bg-[var(--lp-accent)]/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkipLink() {
  return (
    <a
      href="#conteudo-principal"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-[var(--lp-accent)] focus:px-4 focus:py-2 focus:text-[#050706]"
    >
      Ir para o conteúdo
    </a>
  );
}

export { Link };
