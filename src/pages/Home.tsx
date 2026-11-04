import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckSquare, Droplets, Globe, Leaf, Recycle, Shield, Smartphone, Sprout, Target, Trophy, Users, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { token } = useAuth();
  const cta = token ? '/dashboard' : '/cadastro';

  return (
    <div className="w-full">
      <section className="relative z-0 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20"
          style={{ backgroundImage: "url('/photo-1769189115444-feef1f641982.jpeg')" }}
        />
        <div className="absolute inset-0 bg-slate-950/45 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nature-brand/25 via-slate-950/35 to-nature-bg -z-10" />

        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6 drop-shadow-sm">
          Sua jornada <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">sustentável</span>
          <br /> começa aqui
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-100/90 max-w-2xl mb-10">
          Cuide do seu Soulie, envie evidências das missões e acompanhe o ranking do jardim.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to={cta}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-brand font-semibold"
          >
            Iniciar Jornada
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/sobre"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/15 text-white backdrop-blur-sm border border-white/25 shadow-card hover:bg-white/25"
          >
            Entender o Projeto
          </Link>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-nature-surface/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="text-center" interactive>
            <Shield className="w-8 h-8 text-nature-brand mx-auto mb-3" />
            <h4 className="font-mono text-3xl sm:text-4xl font-bold text-nature-ink mb-2">API real</h4>
            <p className="text-nature-muted">Cadastro, login e missões no backend Java</p>
          </Card>
          <Card className="text-center" interactive>
            <Leaf className="w-8 h-8 text-nature-accent mx-auto mb-3" />
            <h4 className="font-mono text-3xl sm:text-4xl font-bold text-nature-ink mb-2">Foto + IA</h4>
            <p className="text-nature-muted">Validação de evidência com status pendente</p>
          </Card>
          <Card className="text-center" interactive>
            <Target className="w-8 h-8 text-nature-success mx-auto mb-3" />
            <h4 className="font-mono text-3xl sm:text-4xl font-bold text-nature-ink mb-2">Jardim</h4>
            <p className="text-nature-muted">Ranking, feed e convite por código</p>
          </Card>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-nature-ink mb-4">Ecologia encontra gamificação</h2>
          <p className="text-nature-muted max-w-2xl mx-auto">O Soulie liga hábito diário a um avatar que cresce quando você age.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card icon={Bot} title="Avatar vivo" variant="brand" interactive>
            <p className="text-nature-muted text-sm">Regue, escolha a espécie e acompanhe o XP da planta.</p>
          </Card>
          <Card icon={CheckSquare} title="Missões" variant="success" interactive>
            <p className="text-nature-muted text-sm">Envie uma foto. O XP só entra quando a análise aprova.</p>
          </Card>
          <Card icon={Sprout} title="Jardim" variant="accent" interactive>
            <p className="text-nature-muted text-sm">Crie ou entre com código, poste no feed e cutuque amigos.</p>
          </Card>
          <Card icon={Globe} title="Impacto" variant="warning" interactive>
            <p className="text-nature-muted text-sm">CO₂ e água economizados aparecem no perfil e no jardim.</p>
          </Card>
          <Card icon={Trophy} title="Conquistas" variant="brand" interactive>
            <p className="text-nature-muted text-sm">Badges desbloqueiam conforme streak, missões e plantas.</p>
          </Card>
          <Card icon={Smartphone} title="Responsivo" variant="accent" interactive>
            <p className="text-nature-muted text-sm">Layout pensado para celular, tablet e desktop.</p>
          </Card>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-nature-ink mb-8 text-center">Frentes de impacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card icon={Droplets} title="Água" variant="accent" interactive>
            <p className="text-nature-muted text-sm">Missões de consumo consciente e reuso.</p>
          </Card>
          <Card icon={Zap} title="Energia" variant="warning" interactive>
            <p className="text-nature-muted text-sm">Hábitos para reduzir desperdício elétrico.</p>
          </Card>
          <Card icon={Recycle} title="Reciclagem" variant="success" interactive>
            <p className="text-nature-muted text-sm">Separação de resíduos comprovada por foto.</p>
          </Card>
          <Card icon={Users} title="Mobilidade" variant="brand" interactive>
            <p className="text-nature-muted text-sm">Bike, ônibus e caminhada no lugar do carro.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
