import type { LoanStatus } from '../../types';

interface BadgeProps {
  status: LoanStatus | string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: 'Menunggu', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  approved: { label: 'Dipinjam', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  rejected: { label: 'Ditolak', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  returned: { label: 'Dikembalikan', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  active: { label: 'Aktif', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  inactive: { label: 'Nonaktif', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  admin: { label: 'Admin', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  petugas: { label: 'Petugas', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  user: { label: 'Anggota', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
};

export function Badge({ status, size = 'sm' }: BadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-slate-100 text-slate-600' };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full ${sizeClass} ${config.classes}`} style={{ fontWeight: 600 }}>
      {config.label}
    </span>
  );
}
