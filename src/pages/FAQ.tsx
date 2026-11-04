import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { FAQ_ITEMS } from '../constants/faq';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <header className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-nature-ink mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-nature-brand" />
          Central de Ajuda
        </h1>
        <p className="text-nature-muted">Dúvidas frequentes sobre missões, planta e jardim.</p>
      </header>

      <Card variant="brand">
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq) => {
            const open = openId === faq.id;
            return (
              <div key={faq.id} className="rounded-xl overflow-hidden bg-nature-bg/50 shadow-soft">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-nature-surface"
                  aria-expanded={open}
                >
                  <span>
                    <span className="block text-xs font-bold text-nature-brand uppercase">{faq.category}</span>
                    <span className={`text-base font-semibold ${open ? 'text-nature-ink' : 'text-nature-ink-soft'}`}>{faq.question}</span>
                  </span>
                  {open ? <ChevronUp className="w-5 h-5 text-nature-brand shrink-0" /> : <ChevronDown className="w-5 h-5 text-nature-muted shrink-0" />}
                </button>
                {open && (
                  <p className="px-4 sm:px-6 pb-4 text-nature-muted leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-nature-muted">
          Não achou sua dúvida? <Link to="/contato" className="text-nature-brand">Fale com a gente</Link>.
        </p>
      </Card>
    </div>
  );
}
