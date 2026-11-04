import { useEffect, useState } from 'react';
import { Award, Droplets, Flame, Leaf, Sprout, Trophy, Users, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import { PerfilSkeleton, SocialSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { createActivity, deleteMyAccount, exportMyData, getActivities, updateSettings } from '../api/auth';
import { getAchievements } from '../api/game';
import { findUserByHandle, followUser, getFollowers, getFollowing, getFriends, unfollowUser } from '../api/community';
import { toErrorMessage } from '../api/http';
import type { AchievementResponse, ActivityResponse, SocialUserResponse } from '../api/types';

type Tab = 'stats' | 'conquistas' | 'social' | 'conta';

export function Perfil() {
  const { user, logout, refresh } = useAuth();
  const [tab, setTab] = useState<Tab>('stats');
  const [achievements, setAchievements] = useState<AchievementResponse[]>([]);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAchievements(), getActivities()])
      .then(([a, act]) => { setAchievements(a); setActivities(act); })
      .catch((err) => setError(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'stats', label: 'Stats' },
    { id: 'conquistas', label: 'Conquistas' },
    { id: 'social', label: 'Social' },
    { id: 'conta', label: 'Conta' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-white">{user?.name}</h1>
      <p className="text-gray-400">{user?.handle} · {user?.email}</p>
      <p className="text-xs text-gray-500 mt-1">{user?.memberSince}</p>

      <div className="flex flex-wrap gap-2 mt-6 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm ${tab === t.id ? 'btn-brand' : 'bg-nature-surface text-gray-300 shadow-soft'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PageStatus loading={loading} error={error} skeleton={<PerfilSkeleton />} />

      {!loading && !error && tab === 'stats' && user && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              { label: 'Streak', value: `${user.stats.streakDays}d`, icon: Flame, tone: 'text-orange-400 bg-orange-400/15' },
              { label: 'XP', value: user.stats.totalXp, icon: Zap, tone: 'text-yellow-400 bg-yellow-400/15' },
              { label: 'Rank', value: `#${user.stats.globalRank}`, icon: Trophy, tone: 'text-amber-400 bg-amber-400/15' },
              { label: 'Amigos', value: `#${user.stats.friendsRank}`, icon: Users, tone: 'text-nature-brand bg-nature-brand/15' },
              { label: 'CO₂', value: `${user.stats.co2SavedKg} kg`, icon: Leaf, tone: 'text-emerald-400 bg-emerald-400/15' },
              { label: 'Água', value: `${user.stats.waterSavedLiters} L`, icon: Droplets, tone: 'text-nature-accent bg-nature-accent/15' },
              { label: 'Plantas', value: `${user.stats.plantsUnlocked}/${user.stats.plantsTotal}`, icon: Sprout, tone: 'text-green-400 bg-green-400/15' },
              { label: 'Conquistas', value: user.stats.unlockedAchievementsCount, icon: Award, tone: 'text-nature-success bg-nature-success/15' },
            ] satisfies { label: string; value: string | number; icon: LucideIcon; tone: string }[]
          ).map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="font-mono text-xl text-white mt-1 truncate">{stat.value}</p>
                </div>
                <span className={`shrink-0 p-2 rounded-xl ${stat.tone}`}>
                  <stat.icon className="w-5 h-5" />
                </span>
              </div>
            </Card>
          ))}
          <div className="col-span-2 md:col-span-4">
            <Card title="Atividades recentes">
              <PageStatus empty={activities.length === 0} emptyText="Sem atividades ainda." />
              <ul className="space-y-2 text-sm text-gray-300">
                {activities.slice(0, 8).map((a) => (
                  <li key={a.id}>{a.emoji} {a.label} · +{a.xp} · {a.date}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {!loading && !error && tab === 'conquistas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PageStatus empty={achievements.length === 0} emptyText="Nenhuma conquista cadastrada." />
          {achievements.map((a) => (
            <Card key={a.id} variant={a.unlocked ? 'success' : 'default'}>
              <p className="text-white font-medium">{a.name}</p>
              <p className="text-sm text-gray-400 mt-1">{a.desc}</p>
              <p className="text-xs text-gray-500 mt-2">{a.progress} · {a.unlocked ? a.date : 'bloqueada'}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'social' && <SocialPanel />}

      {tab === 'conta' && user && (
        <AccountPanel
          settings={user.settings}
          onSaved={refresh}
          onDelete={async () => {
            await deleteMyAccount();
            logout();
          }}
          onActivity={async (label) => {
            await createActivity({ emoji: '✨', label, xp: 5 });
            setActivities(await getActivities());
          }}
        />
      )}
    </div>
  );
}

function SocialPanel() {
  const [handle, setHandle] = useState('');
  const [found, setFound] = useState<SocialUserResponse | null>(null);
  const [friends, setFriends] = useState<SocialUserResponse[]>([]);
  const [followers, setFollowers] = useState<SocialUserResponse[]>([]);
  const [following, setFollowing] = useState<SocialUserResponse[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [fr, fo, fi] = await Promise.all([getFriends(), getFollowers(), getFollowing()]);
    setFriends(fr.content);
    setFollowers(fo.content);
    setFollowing(fi.content);
  };

  useEffect(() => {
    void load()
      .catch((err) => setMsg(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const search = async () => {
    try {
      setFound(await findUserByHandle(handle));
      setMsg(null);
    } catch (err) {
      setFound(null);
      setMsg(toErrorMessage(err));
    }
  };

  const follow = async (id: number, on: boolean) => {
    try {
      await (on ? followUser(id) : unfollowUser(id));
      await load();
      if (found) setFound(await findUserByHandle(found.handle));
    } catch (err) { setMsg(toErrorMessage(err)); }
  };

  if (loading) return <SocialSkeleton />;

  return (
    <div className="space-y-6">
      {msg && <p className="text-sm text-red-400">{msg}</p>}
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle" className="flex-1 bg-nature-bg border border-nature-border rounded-lg px-3 py-2 text-white" />
        <button type="button" onClick={() => void search()} className="px-4 py-2 rounded-lg btn-brand">Buscar</button>
      </div>
      {found && (
        <Card>
          <p className="text-white">{found.name} {found.handle}</p>
          <p className="text-sm text-gray-400">{found.points} pts {found.friend ? '· amigo' : ''}</p>
          <button type="button" onClick={() => void follow(found.id, true)} className="mt-3 text-sm text-nature-brand">Seguir</button>
          <button type="button" onClick={() => void follow(found.id, false)} className="mt-3 ml-3 text-sm text-gray-400">Deixar de seguir</button>
        </Card>
      )}
      {[
        ['Amigos', friends],
        ['Seguidores', followers],
        ['Seguindo', following],
      ].map(([title, list]) => (
        <Card key={title as string} title={title as string}>
          <PageStatus empty={(list as SocialUserResponse[]).length === 0} emptyText="Lista vazia." />
          {(list as SocialUserResponse[]).map((u) => (
            <p key={u.id} className="text-sm text-gray-300 py-1">{u.name} {u.handle}</p>
          ))}
        </Card>
      ))}
    </div>
  );
}

function AccountPanel({
  settings, onSaved, onDelete, onActivity,
}: {
  settings: { notificationsEnabled: boolean; emailWeeklyDigest: boolean; allowNudges: boolean; showFullName: boolean };
  onSaved: () => Promise<void>;
  onDelete: () => Promise<void>;
  onActivity: (label: string) => Promise<void>;
}) {
  const [form, setForm] = useState(settings);
  const [label, setLabel] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    try {
      await updateSettings(form);
      await onSaved();
      setMsg('Preferências salvas.');
    } catch (err) { setMsg(toErrorMessage(err)); }
  };

  const download = async () => {
    const data = await exportMyData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soulie-dados.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card title="Conta e privacidade">
      {msg && <p className="text-sm text-nature-accent mb-3">{msg}</p>}
      {([
        ['notificationsEnabled', 'Notificações'],
        ['emailWeeklyDigest', 'Resumo semanal por e-mail'],
        ['allowNudges', 'Permitir cutucadas'],
        ['showFullName', 'Mostrar nome completo'],
      ] as const).map(([key, labelText]) => (
        <label key={key} className="flex items-center justify-between py-2 text-sm text-gray-300">
          {labelText}
          <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
        </label>
      ))}
      <button type="button" onClick={() => void save()} className="mt-4 px-4 py-2 rounded-lg btn-brand">Salvar</button>

      <div className="mt-6 flex gap-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Registrar atividade extra" className="flex-1 bg-nature-bg border border-nature-border rounded-lg px-3 py-2 text-white text-sm" />
        <button type="button" onClick={() => { if (label.trim()) void onActivity(label.trim()); setLabel(''); }} className="text-sm text-nature-brand">+ XP</button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => void download()} className="text-sm text-gray-300 bg-nature-bg rounded-lg px-4 py-2 shadow-soft">Baixar meus dados</button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Excluir a conta? Essa ação desativa o perfil.')) void onDelete();
          }}
          className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2 shadow-soft"
        >
          Excluir conta
        </button>
      </div>
    </Card>
  );
}
