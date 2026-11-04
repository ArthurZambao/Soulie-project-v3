import { useEffect, useState } from 'react';
import { LogOut, Trophy, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import {
  addComment, createFeedPost, createGarden, deleteFeedPost, getComments, getFeed, getGarden, getGardenImpact,
  getRanking, joinGarden, leaveGarden, likeFeedPost, sendNudge,
} from '../api/community';
import { toErrorMessage } from '../api/http';
import type {
  CommunityGardenResponse, FeedCommentResponse, FeedPostResponse, GardenImpactResponse, RankingItemResponse,
} from '../api/types';
import { RankingList } from '../components/RankingList';
import { FeedPost } from '../components/FeedPost';
import { JardimSkeleton, Skeleton } from '../components/Skeleton';

export function Jardim() {
  const [ranking, setRanking] = useState<RankingItemResponse[]>([]);
  const [garden, setGarden] = useState<CommunityGardenResponse | null>(null);
  const [impact, setImpact] = useState<GardenImpactResponse | null>(null);
  const [feed, setFeed] = useState<FeedPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [post, setPost] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const g = await getGarden();
      setGarden(g ?? null);
      if (g) {
        const [r, f] = await Promise.all([getRanking(), getFeed()]);
        setRanking(r);
        setFeed(f);
        try { setImpact(await getGardenImpact()); } catch { setImpact(null); }
      } else {
        setRanking([]);
        setFeed([]);
        setImpact(null);
      }
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    if (!garden) return;
    let cancelled = false;
    const timer = window.setInterval(() => {
      getFeed()
        .then((f) => { if (!cancelled) setFeed(f); })
        .catch(() => undefined);
    }, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [garden?.id]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const onCreate = async () => {
    try { setGarden(await createGarden()); flash('Jardim criado.'); await load(); }
    catch (err) { flash(toErrorMessage(err)); }
  };

  const onJoin = async () => {
    try { setGarden(await joinGarden(code)); setCode(''); await load(); }
    catch (err) { flash(toErrorMessage(err)); }
  };

  const onLeave = async () => {
    try { await leaveGarden(); setGarden(null); await load(); }
    catch (err) { flash(toErrorMessage(err)); }
  };

  const onPost = async () => {
    if (!post.trim()) return;
    try {
      await createFeedPost({ text: post.trim() });
      setPost('');
      setFeed(await getFeed());
    } catch (err) { flash(toErrorMessage(err)); }
  };

  const onLike = async (id: number) => {
    const res = await likeFeedPost(id);
    setFeed((cur) => cur.map((p) => (p.id === id ? { ...p, liked: res.liked, likes: res.likes } : p)));
  };

  const onDelete = async (id: number) => {
    await deleteFeedPost(id);
    setFeed((cur) => cur.filter((p) => p.id !== id));
  };

  const onNudge = async (userId: number) => {
    try {
      const res = await sendNudge(userId);
      flash(`Cutucada enviada. Restam ${res.remaining} hoje.`);
    } catch (err) { flash(toErrorMessage(err)); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <Users className="text-nature-brand" /> Jardim Comunitário
        </h1>
        <p className="text-gray-400">Ranking, convite e o feed de quem está com você.</p>
      </header>

      {toast && <p className="mb-4 text-sm text-nature-brand bg-nature-brand/10 rounded-lg px-4 py-2 shadow-soft">{toast}</p>}
      <PageStatus loading={loading} error={error} skeleton={<JardimSkeleton />} />

      {!loading && !error && !garden && (
        <div className="max-w-md mx-auto">
          <Card title="Seu jardim" variant="accent">
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Crie um jardim ou entre com um código para ver o ranking e o feed da turma.</p>
              <button type="button" onClick={() => void onCreate()} className="w-full py-2.5 rounded-xl btn-brand">Criar jardim</button>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de convite" className="flex-1 bg-nature-bg border border-nature-border rounded-xl px-3 py-2 text-white" />
                <button type="button" onClick={() => void onJoin()} className="px-4 rounded-xl bg-nature-bg text-white shadow-soft">Entrar</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && garden && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="min-w-0 space-y-6">
            <Card title="Seu jardim" variant="accent">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white font-medium">{garden.name}</p>
                  <p className="text-gray-400 mt-1">{garden.members} {garden.members === 1 ? 'membro' : 'membros'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Código de convite</p>
                  <p className="font-mono text-center text-2xl sm:text-3xl font-bold tracking-[0.22em] text-nature-brand bg-nature-bg rounded-xl px-4 py-3.5 shadow-soft">
                    {garden.inviteCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onLeave()}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 shadow-soft hover:bg-red-500/20 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" /> Sair do jardim
                </button>
              </div>
            </Card>

            {impact && (
              <Card title="Impacto do jardim" variant="success">
                <p className="text-gray-300">CO₂ {impact.co2Kg} kg</p>
                <p className="text-gray-300 mt-1">Água {impact.waterLiters} L</p>
                <p className="text-gray-300 mt-1">Ações {impact.actions}</p>
              </Card>
            )}
          </div>

          <div className="min-w-0 lg:col-span-2 space-y-6">
            <Card title="Ranking" icon={Trophy} variant="brand">
              <PageStatus empty={ranking.length === 0} emptyText="Ninguém no ranking ainda." />
              {ranking.length > 0 && <RankingList ranking={ranking} onNudge={(id) => void onNudge(id)} />}
            </Card>

            <Card title="Feed" variant="accent">
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input value={post} onChange={(e) => setPost(e.target.value)} placeholder="Como foi sua ação hoje?" className="flex-1 bg-nature-bg border border-nature-border rounded-lg px-3 py-2 text-white" />
                <button type="button" onClick={() => void onPost()} className="px-4 py-2 rounded-lg btn-brand">Publicar</button>
              </div>
              <PageStatus empty={feed.length === 0} emptyText="O feed está quieto." />
              <div className="space-y-4">
                {feed.map((item) => (
                  <FeedItem key={item.id} post={item} onLike={() => void onLike(item.id)} onDelete={() => void onDelete(item.id)} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedItem({ post, onLike, onDelete }: { post: FeedPostResponse; onLike: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<FeedCommentResponse[]>([]);
  const [text, setText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async () => {
    setOpen(true);
    setLoadingComments(true);
    try {
      setComments(await getComments(post.id));
    } finally {
      setLoadingComments(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    const created = await addComment(post.id, text.trim());
    setComments((c) => [...c, created]);
    setText('');
  };

  return (
    <FeedPost post={post} onLike={onLike} onDelete={onDelete} onOpenComments={() => void loadComments()}>
      {open && (
        <div className="mt-3 space-y-2">
          {loadingComments && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          {!loadingComments && comments.map((c) => (
            <p key={c.id} className="text-sm text-gray-400"><span className="text-white">{c.author}:</span> {c.text}</p>
          ))}
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-nature-bg border border-nature-border rounded-lg px-2 py-1 text-sm text-white" />
            <button type="button" onClick={() => void send()} className="text-sm text-nature-brand">Comentar</button>
          </div>
        </div>
      )}
    </FeedPost>
  );
}
