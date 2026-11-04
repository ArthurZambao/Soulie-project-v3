import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Soulie } from '../components/Soulie';
import { sendChat } from '../api/game';
import { toErrorMessage } from '../api/http';

interface Line {
  from: 'me' | 'soulie';
  text: string;
  at: number;
}

function formatTime(at: number) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(at);
}

export function Chat() {
  const [lines, setLines] = useState<Line[]>([
    {
      from: 'soulie',
      text: 'Oi! Sou a Soulie IA. Pergunte sobre missões, reciclagem ou o jardim.',
      at: Date.now(),
    },
  ]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [lines, busy]);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const send = async () => {
    const text = message.trim();
    if (!text || busy) return;
    setMessage('');
    if (input.current) input.current.style.height = 'auto';
    setLines((l) => [...l, { from: 'me', text, at: Date.now() }]);
    setBusy(true);
    setError(null);
    try {
      const res = await sendChat(text);
      setLines((l) => [...l, { from: 'soulie', text: res.reply, at: Date.now() }]);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setBusy(false);
      input.current?.focus();
    }
  };

  const onInput = (value: string) => {
    setMessage(value);
    const el = input.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full h-[calc(100dvh-4rem)] bg-nature-bg">
        <header className="relative shrink-0 flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-16 bg-nature-surface shadow-soft">
          <div className="relative shrink-0 w-11 h-11 rounded-full bg-nature-bg overflow-hidden flex items-center justify-center shadow-soft">
            <Soulie size={38} mood="happy" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold text-white leading-tight">Soulie IA</h1>
            <p className="text-xs text-nature-accent truncate">
              {busy ? 'digitando...' : 'online'}
            </p>
          </div>
        </header>

        <div
          ref={scroller}
          className="chat-wallpaper flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3"
          aria-live="polite"
        >
          <div className="flex justify-center py-1">
            <span className="text-[11px] font-medium text-gray-400 bg-nature-surface px-3 py-1 rounded-full shadow-soft">
              Hoje
            </span>
          </div>

          {lines.map((line, i) => {
            const mine = line.from === 'me';
            return (
              <div key={`${line.from}-${line.at}-${i}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                    mine
                      ? 'bg-nature-brand text-white rounded-2xl rounded-br-md shadow-card'
                      : 'bg-nature-surface text-gray-200 rounded-2xl rounded-bl-md shadow-soft'
                  }`}
                >
                  <span className="whitespace-pre-wrap break-words">{line.text}</span>
                  <span className={`relative top-1.5 float-right ml-3 mb-0.5 text-[11px] leading-none ${mine ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(line.at)}
                  </span>
                </div>
              </div>
            );
          })}

          {busy && (
            <div className="flex justify-start">
              <div className="bg-nature-surface rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5 shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-nature-accent animate-chat-typing" />
                <span className="w-1.5 h-1.5 rounded-full bg-nature-accent animate-chat-typing [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-nature-accent animate-chat-typing [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="shrink-0 mx-4 sm:mx-6 lg:mx-8 mb-2 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>
        )}

        <form
          className="shrink-0 bg-nature-surface shadow-card px-4 sm:px-6 lg:px-8 py-3 flex items-end gap-2"
          onSubmit={(e) => { e.preventDefault(); void send(); }}
        >
          <div className="flex-1 flex items-end bg-nature-bg border border-nature-border rounded-xl px-4 py-2.5 min-h-12 focus-within:border-nature-brand">
            <textarea
              ref={input}
              value={message}
              maxLength={500}
              rows={1}
              onChange={(e) => onInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Como separo o plástico?"
              aria-label="Mensagem"
              className="w-full resize-none bg-transparent text-white placeholder:text-gray-500 text-sm leading-5 max-h-32 outline-none"
            />
            {message.length > 420 && (
              <span className="text-[10px] text-gray-500 ml-2 mb-0.5 shrink-0">{message.length}/500</span>
            )}
          </div>
          <button
            type="submit"
            disabled={busy || !message.trim()}
            className="shrink-0 h-12 px-4 rounded-xl btn-brand flex items-center justify-center disabled:opacity-50"
            aria-label={busy ? 'Pensando' : 'Enviar'}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
    </div>
  );
}
