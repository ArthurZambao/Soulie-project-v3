import { CheckCircle2, Gamepad2, Route, Sprout, Target } from 'lucide-react';
import { Card } from '../components/Card';
import { ROADMAP } from '../constants/integrantes';

export function Sobre() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12 sm:space-y-16">
      <section className="text-center space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-nature-ink">Nossa Missão</h1>
        <p className="text-lg sm:text-xl text-nature-muted max-w-3xl mx-auto">
          Fechar a lacuna entre a intenção e a ação sustentável com suporte contínuo e gamificação.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Card title="O Problema" icon={Target} variant="warning">
          <p className="text-nature-muted leading-relaxed">
            Estudos apontam que 81% das pessoas não mantêm hábitos ecológicos sem suporte. Sem feedback,
            economizar água ou separar o lixo some da rotina.
          </p>
        </Card>
        <Card title="Nossa Solução" icon={Sprout} variant="success">
          <p className="text-nature-muted leading-relaxed">
            O Soulie liga a planta virtual às ações reais. Missões, XP, jardim e chat com a IA dão um motivo
            visível para continuar.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-nature-ink mb-8 flex items-center gap-3 pb-1">
          <Gamepad2 className="text-nature-brand" /> Por que gamificação?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '5x', t: 'Mais engajamento', d: 'Progressão visível segura o hábito melhor que um checklist solto.' },
            { n: '68%', t: 'Retenção', d: 'Streak, ranking e a planta murchando quando você some.' },
            { n: '100%', t: 'Impacto', d: 'XP vira métrica de CO₂ e água no perfil e no jardim.' },
          ].map((item) => (
            <div key={item.t} className="bg-nature-surface p-6 rounded-xl shadow-card">
              <p className="font-mono text-xl font-bold text-nature-brand mb-2">{item.n}</p>
              <h3 className="font-display text-nature-ink font-semibold mb-2">{item.t}</h3>
              <p className="text-sm text-nature-muted">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-nature-ink mb-8 flex items-center gap-3 pb-1">
          <Route className="text-nature-accent" /> Roadmap 2026
        </h2>
        <div className="space-y-4">
          {ROADMAP.map((item) => (
            <div key={item.phase} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-nature-surface p-4 rounded-lg shadow-soft">
              <div className="w-32 shrink-0">
                <span className="text-sm font-bold text-nature-muted uppercase">{item.phase}</span>
                <p className="text-xs text-nature-muted">{item.date}</p>
              </div>
              <h4 className={`flex-grow text-lg ${item.status === 'current' ? 'text-nature-brand font-bold' : 'text-nature-ink'}`}>
                {item.title}
              </h4>
              {item.status === 'completed' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-nature-success/10 text-nature-success">
                  <CheckCircle2 className="w-3 h-3" /> Concluído
                </span>
              )}
              {item.status === 'current' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-nature-brand/10 text-nature-brand">
                  Em andamento
                </span>
              )}
              {item.status === 'pending' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs text-nature-muted bg-nature-bg shadow-soft">Pendente</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
