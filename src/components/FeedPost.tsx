import type { ReactNode } from 'react';
import type { FeedPostResponse } from '../api/types';

interface FeedPostProps {
  post: FeedPostResponse;
  onLike: () => void;
  onDelete: () => void;
  onOpenComments: () => void;
  children?: ReactNode;
}

export function FeedPost({ post, onLike, onDelete, onOpenComments, children }: FeedPostProps) {
  return (
    <article className="rounded-xl bg-nature-bg p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: post.avatarColor || '#3b82f6' }}>
          {post.avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium">{post.author} <span className="text-xs text-gray-500 font-normal">{post.time}</span></p>
          {post.missionName && <p className="text-xs text-nature-brand mt-0.5">{post.missionName} {post.xp ? `+${post.xp} XP` : ''}</p>}
          {post.text && <p className="text-gray-300 mt-2">{post.text}</p>}
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <button type="button" onClick={onLike} className={post.liked ? 'text-nature-brand' : ''}>{post.liked ? 'Curtido' : 'Curtir'} · {post.likes}</button>
            <button type="button" onClick={onOpenComments}>Comentários · {post.comments}</button>
            {post.mine && <button type="button" onClick={onDelete} className="text-red-400">Apagar</button>}
          </div>
          {children}
        </div>
      </div>
    </article>
  );
}
