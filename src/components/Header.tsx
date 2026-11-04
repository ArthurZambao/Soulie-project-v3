import { Link, useLocation } from 'react-router-dom';
import {
  Activity, Bell, Gift, HelpCircle, Home, Info, Leaf, LogIn, Mail, Menu, MessageCircle, TreePine, UserRound, Users, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationsRead } from '../api/community';
import type { NotificationResponse } from '../api/types';
import { Skeleton } from './Skeleton';

type NavItem = { to: string; label: string; icon: typeof Home };

const publicNav: NavItem[] = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/sobre', label: 'Sobre', icon: Info },
  { to: '/integrantes', label: 'Equipe', icon: Users },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/contato', label: 'Contato', icon: Mail },
];

const appNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity },
  { to: '/jardim', label: 'Jardim', icon: TreePine },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/recompensas', label: 'Recompensas', icon: Gift },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<NotificationResponse[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const location = useLocation();
  const { token, logout } = useAuth();

  const links = token ? [...appNav, ...publicNav.filter((i) => i.to !== '/')] : publicNav;

  const active = (path: string) =>
    location.pathname === path
      ? 'text-nature-brand bg-nature-brand/10'
      : 'text-nature-ink-soft hover:text-nature-brand hover:bg-nature-bg';

  useEffect(() => {
    if (!token) {
      setNotes([]);
      return;
    }

    let cancelled = false;
    const load = (first = false) => {
      if (first) setNotesLoading(true);
      getNotifications()
        .then((list) => { if (!cancelled) setNotes(list); })
        .catch(() => { if (!cancelled) setNotes([]); })
        .finally(() => { if (!cancelled && first) setNotesLoading(false); });
    };

    load(true);
    const timer = window.setInterval(() => load(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [token]);

  const markRead = async () => {
    if (!notes.length) return;
    try {
      await markNotificationsRead(notes.map((n) => n.id));
      setNotes([]);
    } catch {
      /* silêncio: o sino só some se a API aceitar */
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-nature-surface/90 backdrop-blur-md border-b border-nature-border/80 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Soulie Home">
            <div className="p-2 bg-nature-surface rounded-lg group-hover:bg-nature-border transition-colors">
              <Leaf className="h-6 w-6 text-nature-brand" />
            </div>
            <span className="font-display font-bold text-xl text-nature-ink group-hover:text-nature-brand transition-colors">
              Soulie
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1" aria-label="Navegação principal">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${active(item.to)}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {token ? (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotes((v) => !v)}
                    className="relative p-2 rounded-md text-nature-ink-soft hover:text-nature-ink hover:bg-nature-surface"
                    aria-label="Notificações"
                  >
                    <Bell className="h-5 w-5" />
                    {notes.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-nature-brand" />
                    )}
                  </button>
                  {showNotes && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-nature-surface rounded-xl shadow-card p-3 z-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-nature-ink">Avisos</p>
                        {notes.length > 0 && (
                          <button type="button" onClick={() => void markRead()} className="text-xs text-nature-brand">
                            Marcar lidos
                          </button>
                        )}
                      </div>
                      {notesLoading ? (
                        <div className="space-y-2 py-1">
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                      ) : notes.length === 0 ? (
                        <p className="text-xs text-nature-muted py-4 text-center">Nenhum aviso novo.</p>
                      ) : (
                        <ul className="space-y-2 max-h-64 overflow-y-auto">
                          {notes.map((n) => (
                            <li key={n.id} className="text-sm bg-nature-bg rounded-lg p-2 shadow-soft">
                              <p className="text-nature-ink font-medium">{n.title}</p>
                              <p className="text-nature-muted text-xs mt-1">{n.body}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden sm:inline-flex px-3 py-2 text-sm text-nature-ink-soft hover:text-nature-ink"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium btn-brand"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            )}

            <button
              type="button"
              className="xl:hidden p-2 rounded-md text-nature-muted hover:text-nature-ink hover:bg-nature-surface"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="xl:hidden bg-nature-surface border-t border-nature-border shadow-soft">
          <div className="px-4 py-3 space-y-1">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${active(item.to)}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            {token ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-left px-3 py-3 text-nature-ink-soft"
              >
                Sair
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-nature-brand">
                <LogIn className="h-5 w-5" />
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
