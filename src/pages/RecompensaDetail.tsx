import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import { DetailSkeleton } from '../components/Skeleton';
import { getRewardCatalog, redeemReward } from '../api/game';
import { toErrorMessage } from '../api/http';
import type { RewardCatalogResponse } from '../api/types';
import { useAuth } from '../context/AuthContext';

export function RecompensaDetail() {
  const { id } = useParams<{ id: string }>();
  const rewardId = Number(id);
  const { refresh } = useAuth();
  const [item, setItem] = useState<RewardCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(rewardId)) {
      setError('Recompensa inválida.');
      setLoading(false);
      return;
    }
    getRewardCatalog()
      .then((list) => {
        const found = list.find((r) => r.id === rewardId) ?? null;
        setItem(found);
        if (!found) setError('Recompensa não encontrada no catálogo.');
      })
      .catch((err) => setError(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [rewardId]);

  const redeem = async () => {
    if (!item) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await redeemReward(item.id);
      setMsg(`Resgatado. Saldo restante: ${res.remainingPoints}.`);
      await refresh();
    } catch (err) {
      setMsg(toErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <PageStatus loading={loading} error={error} skeleton={<DetailSkeleton />} />
        <Link to="/recompensas" className="text-nature-brand mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Link to="/recompensas" className="text-gray-400">← Catálogo</Link>
      <Card className="mt-6" variant="brand" title={item.benefits}>
        <p className="text-gray-300">Custo: <span className="font-mono text-white">{item.cost} pontos</span></p>
        {msg && <p className="mt-4 text-sm text-nature-accent">{msg}</p>}
        <button type="button" disabled={busy} onClick={() => void redeem()} className="mt-6 px-5 py-2.5 rounded-xl btn-brand disabled:opacity-50">
          {busy ? 'Resgatando...' : 'Resgatar'}
        </button>
      </Card>
    </div>
  );
}
