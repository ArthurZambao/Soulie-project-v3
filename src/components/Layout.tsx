import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);
  const isChat = pathname === '/chat';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-nature-bg flex flex-col font-sans selection:bg-nature-brand selection:text-white relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-nature-brand focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main-content" className={`flex-grow flex flex-col relative w-full ${isChat ? 'min-h-0 overflow-hidden' : ''}`} tabIndex={-1}>
        {!isChat && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-nature-brand/15 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[30%] rounded-full bg-nature-accent/12 blur-[120px]" />
          </div>
        )}
        {children}
      </main>
      {!isChat && <Footer />}
      {!isChat && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 p-3 rounded-full btn-brand z-50 ${showTop ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'}`}
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
