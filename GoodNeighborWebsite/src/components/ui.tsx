import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 ${
        hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-2xl' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
}

export function GradientButton({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
}: GradientButtonProps) {
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-purple-500 to-blue-600 hover:shadow-lg hover:shadow-purple-500/50',
    secondary: 'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30',
    danger: 'bg-red-700 border border-red-800 hover:bg-red-800 text-white shadow-sm hover:shadow-md',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function ModernInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  icon,
  required = false,
  className = '',
}: InputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-white mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-xl border border-slate-300 bg-white ${
            icon ? 'pl-11' : 'px-4'
          } py-3 text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 backdrop-blur-sm`}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'green' | 'red';
  className?: string;
}

export function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  const variantClasses = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    green: 'bg-green-500/20 text-green-300 border-green-500/50',
    red: 'bg-red-500/20 text-red-300 border-red-500/50',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'purple' | 'blue' | 'green';
}

export function StatCard({ label, value, icon, variant = 'purple' }: StatCardProps) {
  const variantClasses = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    green: 'from-green-500/20 to-green-600/20 border-green-500/50',
  };

  return (
    <Card className={`bg-gradient-to-br ${variantClasses[variant]} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-300">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </Card>
  );
}
