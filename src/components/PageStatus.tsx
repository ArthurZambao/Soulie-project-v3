import type { ReactNode } from 'react';

interface PageStatusProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  skeleton?: ReactNode;
}

export function PageStatus({ loading, error, empty, emptyText = 'Nada por aqui ainda.', skeleton }: PageStatusProps) {
  if (loading) {
    return (
      skeleton ?? (
        <div className="flex items-center justify-center py-16 text-nature-muted gap-3">
          <div className="w-5 h-5 border-2 border-nature-brand/30 border-t-nature-brand rounded-full animate-spin" />
          Carregando...
        </div>
      )
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (empty) {
    return <p className="text-center text-nature-muted py-10">{emptyText}</p>;
  }

  return null;
}
