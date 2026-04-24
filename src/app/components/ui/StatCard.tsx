interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    value: 'text-blue-600 dark:text-blue-400',
    border: 'border-l-blue-500',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    value: 'text-green-600 dark:text-green-400',
    border: 'border-l-green-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    value: 'text-purple-600 dark:text-purple-400',
    border: 'border-l-purple-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    value: 'text-orange-600 dark:text-orange-400',
    border: 'border-l-orange-500',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    value: 'text-red-600 dark:text-red-400',
    border: 'border-l-red-500',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    icon: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
    value: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-l-cyan-500',
  },
};

export function StatCard({ title, value, icon, color, change, changeType, subtitle }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 border-l-4 ${c.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`mt-1 ${c.value}`} style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2, fontFamily: "'Inter', sans-serif" }}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
          {change && (
            <p className={`text-xs mt-1.5 ${changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-slate-500'}`} style={{ fontWeight: 500 }}>
              {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
