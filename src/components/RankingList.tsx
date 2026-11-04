import { Flame, Leaf, Medal, Trophy } from 'lucide-react';
import type { RankingItemResponse } from '../api/types';
import { flowerDisplayName } from '../constants/soulie';

const AVATAR_COLORS = ['#3b82f6', '#06b6d4', '#22d3ee', '#4ade80', '#fbbf24', '#a78bfa'];

function avatarTone(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function RankMark({ pos }: { pos: number }) {
  if (pos === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (pos === 2) return <Medal className="w-5 h-5 text-slate-300" />;
  if (pos === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-mono text-gray-500">#{pos}</span>;
}

function rowTone(pos: number, isYou: boolean) {
  if (isYou) return 'bg-nature-brand/10 shadow-card';
  if (pos === 1) return 'bg-yellow-400/10 shadow-soft';
  if (pos === 2) return 'bg-slate-300/10 shadow-soft';
  if (pos === 3) return 'bg-amber-700/10 shadow-soft';
  return 'bg-nature-bg/60 shadow-soft';
}

export function RankingList({ ranking, onNudge }: { ranking: RankingItemResponse[]; onNudge: (userId: number) => void }) {
  return (
    <div className="space-y-2">
      {ranking.map((row) => {
        const photo = row.avatar?.startsWith('http');
        return (
          <div
            key={row.userId}
            className={`flex items-center gap-3 p-3 rounded-2xl ${rowTone(row.pos, row.isYou)}`}
          >
            <div className="w-8 shrink-0 flex justify-center">
              <RankMark pos={row.pos} />
            </div>

            {photo ? (
              <img src={row.avatar} alt="" className="w-11 h-11 rounded-full object-cover shadow-soft" />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-soft"
                style={{ background: avatarTone(row.name) }}
              >
                {row.avatar?.length === 1 ? row.avatar : initialOf(row.name)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <p className={`font-medium truncate ${row.isYou ? 'text-nature-brand' : 'text-white'}`}>{row.name}</p>
                {row.isYou && (
                  <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-nature-brand/20 text-nature-brand">
                    você
                  </span>
                )}
              </div>
              <span className="mt-1.5 inline-flex items-center gap-1.5 max-w-full truncate text-xs px-2.5 py-1 rounded-full bg-nature-accent/12 text-nature-accent">
                <Leaf className="w-3 h-3 shrink-0" />
                <span className="truncate">{flowerDisplayName(row.flowerType)}</span>
                <span className="text-nature-accent/60">·</span>
                Nv. {row.level}
              </span>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <p className="font-mono text-white font-semibold text-sm">{row.xp} XP</p>
              <p className="text-xs text-orange-400 flex items-center gap-1 mt-0.5">
                <Flame className="w-3 h-3" /> {row.streak}d
              </p>
            </div>

            {!row.isYou && (
              <button
                type="button"
                onClick={() => onNudge(row.userId)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-nature-accent/15 text-nature-accent shadow-soft"
              >
                Cutucar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
