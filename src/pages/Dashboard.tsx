import { Fragment, useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronUp, Droplets, Lock, Settings, X } from 'lucide-react';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import { DashboardSkeleton } from '../components/Skeleton';
import { Soulie } from '../components/Soulie';
import { useAuth } from '../context/AuthContext';
import { getMissions, getPlants, getSoulie, unlockPlantCode, updateSoulie, waterSoulie } from '../api/game';
import { toErrorMessage } from '../api/http';
import type { DailyMissionResponse, FlowerType, PlantItemResponse, SoulieMood, SoulieResponse } from '../api/types';
import { EVOLUTION, flowerColor, flowerDisplayName } from '../constants/soulie';
import { missionTagClass } from '../constants/missions';

export function Dashboard() {
  const { user, refresh } = useAuth();
  const [soulie, setSoulie] = useState<SoulieResponse | null>(null);
  const [missions, setMissions] = useState<DailyMissionResponse[]>([]);
  const [plants, setPlants] = useState<PlantItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<SoulieMood>('happy');
  const [toast, setToast] = useState<string | null>(null);
  const [config, setConfig] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFlower, setEditFlower] = useState<FlowerType>('girassol');
  const [code, setCode] = useState('');
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [petting, setPetting] = useState(false);

  const load = async () => {
    setError(null);
    try {
      // Soulie primeiro: o back cria as linhas de plantas nesse GET.
      // Em paralelo com /plants, dois ensureRows competem e a API responde 409.
      const s = await getSoulie();
      const [m, p] = await Promise.all([getMissions(), getPlants()]);
      setSoulie(s);
      setMissions(m);
      setPlants(p);
      setEditName(s.name);
      setEditFlower(s.flowerType);
      setMood(s.wateredToday ? 'happy' : 'sad');
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const flash = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  };

  const onWater = async () => {
    try {
      const res = await waterSoulie();
      flash(res.message);
      setMood('excited');
      await load();
      await refresh();
    } catch (err) {
      flash(toErrorMessage(err));
    }
  };

  const saveConfig = async () => {
    try {
      await updateSoulie({ name: editName, flowerType: editFlower });
      if (code.trim()) await unlockPlantCode(code.trim());
      setConfig(false);
      setCode('');
      await load();
    } catch (err) {
      flash(toErrorMessage(err));
    }
  };

  const onPet = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 10;
    const y = e.clientY - rect.top - 10;
    const burst = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 18 - 8),
    }));
    setHearts((cur) => [...cur, ...burst]);
    window.setTimeout(() => {
      setHearts((cur) => cur.filter((h) => !burst.some((b) => b.id === h.id)));
    }, 1200);
    setPetting(true);
    setMood('excited');
    window.setTimeout(() => {
      setPetting(false);
      setMood(soulie?.wateredToday ? 'happy' : 'sad');
    }, 1400);
  };

  const stats = user?.stats;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Olá, {user?.name?.split(' ')[0] ?? 'Guardião'}!</h1>
        <p className="text-gray-400">Seu resumo ecológico de hoje.</p>
      </header>

      {toast && <p className="mb-4 rounded-lg bg-nature-brand/10 border border-nature-brand/30 px-4 py-2 text-sm text-nature-brand">{toast}</p>}
      <PageStatus loading={loading} error={error} skeleton={<DashboardSkeleton />} />

      {!loading && !error && soulie && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="min-w-0 space-y-6">
            <Card>
              <div className="absolute inset-0 z-0">
                <img src="/plant-bg.jpeg" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-nature-surface/80 to-nature-surface" />
              </div>
              <button type="button" onClick={() => setConfig(true)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 text-gray-300" aria-label="Configurar">
                <Settings className="w-5 h-5" />
              </button>
              <div className="relative z-10 flex flex-col items-center py-4">
                <p className="speech-bubble mb-3 z-10">
                  {petting
                    ? 'Hihi!'
                    : mood === 'excited'
                      ? 'Oba! Obrigado por me regar!'
                      : mood === 'wilted'
                        ? 'Estou murcho...'
                        : mood === 'sad' || !soulie.wateredToday
                          ? 'Estou com sede...'
                          : `Sou um ${flowerDisplayName(soulie.flowerType)}!`}
                </p>
                <button
                  type="button"
                  onClick={onPet}
                  className="relative overflow-visible rounded-full transition-transform hover:scale-105 active:scale-95"
                  aria-label="Acariciar Soulie"
                >
                  <Soulie size={170} mood={mood} level={soulie.level} flowerType={soulie.flowerType} />
                  {hearts.map((heart) => (
                    <span
                      key={heart.id}
                      className="absolute z-20 text-xl animate-soulie-heart pointer-events-none drop-shadow-md"
                      style={{ left: heart.x, top: heart.y }}
                    >
                      ❤️
                    </span>
                  ))}
                </button>
                <h3 className="text-xl font-bold text-white mt-3">{soulie.name}</h3>
                <p className="text-xs text-gray-400 mt-2">{soulie.levelName} · {soulie.wateredToday ? 'Regado hoje' : 'Ainda não regou'}</p>
                <div className="w-full mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">XP</span>
                    <span className="font-mono text-blue-400">{soulie.xp} / {soulie.nextLevelXp || soulie.xp}</span>
                  </div>
                  <div className="h-3 rounded-full bg-nature-border overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${soulie.nextLevelXp ? Math.min(100, (soulie.xp / soulie.nextLevelXp) * 100) : 100}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full mt-5">
                  <div className="bg-nature-bg rounded-xl p-3 text-center shadow-soft">
                    <p className="font-mono text-white font-bold">{stats?.streakDays ?? 0}d</p>
                    <p className="text-xs text-gray-500">Streak</p>
                  </div>
                  <div className="bg-nature-bg rounded-xl p-3 text-center shadow-soft">
                    <p className="font-mono text-white font-bold">{stats?.totalXp ?? soulie.xp}</p>
                    <p className="text-xs text-gray-500">XP total</p>
                  </div>
                  <div className="bg-nature-bg rounded-xl p-3 text-center shadow-soft">
                    <p className="font-mono text-white font-bold">#{stats?.globalRank ?? '—'}</p>
                    <p className="text-xs text-gray-500">Rank</p>
                  </div>
                </div>
                <button type="button" onClick={() => void onWater()} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-nature-accent/15 text-nature-accent shadow-soft">
                  <Droplets className="w-4 h-4" /> Regar
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 min-w-0 space-y-6">
            <Card title="Impacto" variant="success">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between gap-3 min-w-0 p-3 rounded-lg bg-nature-bg shadow-soft">
                  <span className="text-gray-300 shrink-0">CO₂ evitado</span>
                  <strong className="font-mono text-white text-right break-all min-w-0">{stats?.co2SavedKg ?? 0} kg</strong>
                </div>
                <div className="flex items-center justify-between gap-3 min-w-0 p-3 rounded-lg bg-nature-bg shadow-soft">
                  <span className="text-gray-300 shrink-0">Água poupada</span>
                  <strong className="font-mono text-white text-right break-all min-w-0">{stats?.waterSavedLiters ?? 0} L</strong>
                </div>
              </div>
            </Card>

            <Card title="Missões" subtitle="Abra uma missão para enviar a evidência" variant="accent">
              <PageStatus empty={missions.length === 0} emptyText="Nenhuma missão disponível agora." />
              <div className="space-y-3">
                {(showAllMissions ? missions : missions.slice(0, 5)).map((mission) => (
                  <Link
                    key={mission.id}
                    to={`/missao/${mission.id}`}
                    className={`flex items-center justify-between p-4 rounded-xl shadow-soft ${mission.done ? 'bg-nature-brand/10' : 'bg-nature-bg hover:shadow-card'}`}
                  >
                    <div>
                      <h4 className="font-medium text-white">{mission.emoji} {mission.name}</h4>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${missionTagClass(mission.tag)}`}>
                          {mission.tag}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{mission.period}</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-nature-brand">+{mission.xp} XP</span>
                  </Link>
                ))}
              </div>
              {missions.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllMissions((open) => !open)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm text-nature-brand bg-nature-brand/10 shadow-soft hover:bg-nature-brand/20"
                >
                  {showAllMissions ? (
                    <>Ver menos <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Ver mais ({missions.length - 5}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-4 text-center">Caminho da evolução</p>
                <div className="flex items-center">
                  {EVOLUTION.map((stage, i) => {
                    const current = soulie.level === stage.level;
                    const done = soulie.level > stage.level;
                    return (
                      <Fragment key={stage.level}>
                        {i > 0 && (
                          <ChevronRight
                            className={`w-5 h-5 shrink-0 mx-0.5 sm:mx-1 ${done || current ? 'text-nature-brand' : 'text-gray-600'}`}
                            aria-hidden
                          />
                        )}
                        <div className={`flex flex-1 min-w-0 flex-col items-center text-center ${current ? 'text-nature-brand' : done ? 'text-nature-accent' : 'text-gray-600'}`}>
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-lg mb-1.5 ${
                              current
                                ? 'bg-nature-brand/20 shadow-soft scale-110'
                                : done
                                  ? 'bg-nature-accent/15'
                                  : 'bg-nature-bg opacity-50'
                            }`}
                          >
                            {stage.emoji}
                          </div>
                          <span className="text-[10px] font-medium truncate w-full">{stage.name}</span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {config && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setConfig(false)}
        >
          <div
            className="bg-nature-surface rounded-3xl w-full max-w-2xl h-[min(90vh,40rem)] shadow-card grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 pt-5 pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-nature-brand/15 text-nature-brand flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-white">Configurar Soulie</h2>
                    <p className="text-xs text-gray-500">Nome, espécie e código secreto</p>
                  </div>
                </div>
                <button type="button" onClick={() => setConfig(false)} className="p-2 rounded-full hover:bg-nature-bg" aria-label="Fechar">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <label className="block text-sm text-gray-300">
                Nome
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1.5 w-full bg-nature-bg border border-nature-border rounded-xl px-4 py-3 text-white"
                />
              </label>
              <p className="text-sm text-gray-300">Espécie</p>
            </div>

            <div className="px-5 sm:px-6 overflow-y-auto min-h-0 space-y-4">
              <PageStatus empty={plants.length === 0} emptyText="Nenhuma planta encontrada." />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {plants.map((p) => {
                  const locked = !p.unlocked && !p.selected;
                  const selected = editFlower === p.id;
                  const accent = flowerColor(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={locked}
                      title={locked ? p.unlockHint || 'Espécie bloqueada' : flowerDisplayName(p.id)}
                      onClick={() => setEditFlower(p.id as FlowerType)}
                      className={`rounded-2xl p-3 text-left shadow-soft overflow-hidden transition-all ${
                        locked
                          ? 'bg-nature-bg/70 grayscale'
                          : selected
                            ? 'bg-nature-bg'
                            : 'bg-nature-bg hover:-translate-y-0.5 hover:shadow-card'
                      }`}
                      style={
                        locked
                          ? undefined
                          : {
                              boxShadow: selected
                                ? `0 0 0 2px ${accent}, 0 12px 28px -16px ${accent}`
                                : `inset 0 0 0 1px ${accent}55`,
                            }
                      }
                    >
                      <span className={`flex items-center gap-1.5 text-sm font-medium leading-snug ${locked ? 'text-gray-500' : ''}`}>
                        {locked && <Lock className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span className="truncate" style={locked ? undefined : { color: accent }}>
                          {flowerDisplayName(p.id)}
                        </span>
                      </span>
                      <div className={`mt-1 ${locked ? 'opacity-50' : ''}`}>
                        <Soulie size={56} level={3} mood="happy" flowerType={p.id} animated={false} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <label className="block text-sm text-gray-300 pb-1">
                Código secreto
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="opcional — desbloqueia uma espécie"
                  className="mt-1.5 w-full bg-nature-bg border border-nature-border rounded-xl px-4 py-3 text-white"
                />
              </label>
            </div>

            <div className="px-5 sm:px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setConfig(false)} className="px-4 py-2.5 rounded-xl text-gray-300 hover:bg-nature-bg">
                Cancelar
              </button>
              <button type="button" onClick={() => void saveConfig()} className="px-5 py-2.5 rounded-xl btn-brand">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
