import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'urgent' | 'success' | 'info';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  urgent: 'bg-amber-100 text-amber-700 font-bold',
  success: 'bg-emerald-100 text-emerald-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: BadgeVariant }) {
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
}

