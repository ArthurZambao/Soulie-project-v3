import { Link } from 'react-router-dom';
import { Heart, Leaf } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-nature-surface border-t border-nature-border shadow-card pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-2 bg-nature-bg rounded-lg shadow-soft group-hover:shadow-card">
                <Leaf className="h-6 w-6 text-nature-brand" />
              </div>
              <span className="font-display font-bold text-2xl text-nature-ink">Soulie</span>
            </Link>
            <p className="text-nature-muted max-w-md leading-relaxed">
              Transformando pequenos hábitos em um impacto gigantesco. Cuide do seu Soulie,
              complete missões e evolua junto com a comunidade.
            </p>
          </div>

          <div>
            <h3 className="font-display text-nature-ink font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3 text-nature-muted">
              <li><Link to="/" className="hover:text-nature-brand">Início</Link></li>
              <li><Link to="/dashboard" className="hover:text-nature-brand">Dashboard</Link></li>
              <li><Link to="/jardim" className="hover:text-nature-brand">Jardim</Link></li>
              <li><Link to="/sobre" className="hover:text-nature-brand">Sobre</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-nature-ink font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-nature-muted">
              <li><Link to="/faq" className="hover:text-nature-brand">FAQ</Link></li>
              <li><Link to="/contato" className="hover:text-nature-brand">Contato</Link></li>
              <li><Link to="/integrantes" className="hover:text-nature-brand">Equipe</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-nature-muted">
          <p>&copy; {year} Soulie — Guardiões da Natureza.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="h-4 w-4 text-red-500" /> na FIAP
          </p>
        </div>
      </div>
    </footer>
  );
}
