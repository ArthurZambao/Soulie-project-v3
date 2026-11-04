import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Crown, Flower, Flower2, Gift, Leaf, Lock, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import { CatalogSkeleton } from '../components/Skeleton';
import { getMyRewards, getRewardCatalog } from '../api/game';
import { toErrorMessage } from '../api/http';
import type { RewardCatalogResponse, RewardResponse } from '../api/types';
import { useAuth } from '../context/AuthContext';

function rewardLook(benefits: string): { icon: LucideIcon; tone: string } {
  const t = benefits.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (t.includes('semente')) return { icon: Sprout, tone: 'text-green-400 bg-green-400/15' };
  if (t.includes('vaso')) return { icon: Flower2, tone: 'text-amber-400 bg-amber-400/15' };
  if (t.includes('flor')) return { icon: Flower, tone: 'text-pink-400 bg-pink-400/15' };
  if (t.includes('planta')) return { icon: Leaf, tone: 'text-emerald-400 bg-emerald-400/15' };
  if (t.includes('titulo') || t.includes('guardiao')) return { icon: Crown, tone: 'text-yellow-400 bg-yellow-400/15' };
  return { icon: Gift, tone: 'text-nature-brand bg-nature-brand/15' };
}

export function Recompensas() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState<RewardCatalogResponse[]>([]);
  const [mine, setMine] = useState<RewardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const xp = user?.stats.totalXp ?? 0;

  useEffect(() => {
    Promise.all([getRewardCatalog(), getMyRewards()])
      .then(([c, m]) => { setCatalog(c); setMine(m); })
      .catch((err) => setError(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
            <Gift className="text-nature-brand" /> Recompensas
          </h1>
          <p className="text-gray-400 mt-1">Troque seu XP por itens do jardim.</p>
        </div>
        <div className="rounded-2xl bg-nature-surface px-5 py-3 shadow-card">
          <p className="text-[10px] uppercase tracking-wide text-gray-500">Seu saldo</p>
          <p className="font-mono text-2xl font-bold text-white">{xp} <span className="text-sm text-nature-brand">XP</span></p>
        </div>
      </div>

      <PageStatus loading={loading} error={error} skeleton={<CatalogSkeleton />} />

      {!loading && !error && (
        <>
          <h2 className="text-white font-display text-xl mb-4">Catálogo</h2>
          <PageStatus empty={catalog.length === 0} emptyText="Catálogo vazio." />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {catalog.map((item) => {
              const look = rewardLook(item.benefits);
              const Icon = look.icon;
              const missing = Math.max(0, item.cost - xp);
              return (
                <Link key={item.id} to={`/recompensa/${item.id}`} className="block h-full">
                  <Card className="h-full" interactive>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${look.tone}`}>
                          <Icon className="w-6 h-6" />
                        </span>
                        {missing > 0 ? (
                          <span className="shrink-0 inline-flex items-center gap-1 whitespace-nowrap text-xs text-gray-400 bg-nature-bg rounded-full px-2.5 py-1">
                            <Lock className="w-3 h-3" /> Bloqueado
                          </span>
                        ) : (
                          <span className="shrink-0 whitespace-nowrap text-xs text-nature-success bg-nature-success/15 rounded-full px-2.5 py-1">
                            Disponível
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-white leading-snug mt-4">{item.benefits}</h3>
                      <p className="font-mono text-2xl text-nature-brand mt-4">
                        {item.cost} <span className="text-sm text-gray-400">XP</span>
                      </p>
                      <div className="mt-3 h-1.5 rounded-full bg-nature-bg overflow-hidden">
                        <div
                          className={`h-full rounded-full ${missing > 0 ? 'bg-nature-brand/70' : 'bg-nature-success'}`}
                          style={{ width: `${Math.min(100, item.cost === 0 ? 100 : (xp / item.cost) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {missing > 0 ? `Faltam ${missing} XP para resgatar` : 'Você já pode resgatar'}
                      </p>
                      <span className="mt-auto pt-5 w-full text-center text-sm rounded-xl px-4 py-2.5 btn-brand">
                        Ver detalhe
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <h2 className="text-white font-display text-xl mb-4">Já resgatadas</h2>
          <PageStatus empty={mine.length === 0} emptyText="Você ainda não resgatou nada." />
          <ul className="space-y-2">
            {mine.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 bg-nature-surface rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-nature-success shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{r.benefits}</p>
                    <p className="text-xs text-gray-500">Gastou {r.pointsSpent} XP</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 shrink-0">restou {r.remainingPoints}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
