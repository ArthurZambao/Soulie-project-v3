import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { TEAM_MEMBERS } from '../constants/integrantes';

export function IntegranteDetail() {
  const { id } = useParams<{ id: string }>();
  const member = TEAM_MEMBERS.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-nature-ink mb-3">Integrante não encontrado</h2>
        <p className="text-nature-muted mb-6">Esse perfil não existe na equipe do Soulie.</p>
        <Link to="/integrantes" className="text-nature-brand">Voltar para a equipe</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <Link to="/integrantes" className="text-nature-muted hover:text-nature-ink mb-8 inline-block">← Voltar</Link>
      <Card variant="brand">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img src={member.photo} alt={`Foto de ${member.name}`} className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-nature-border" />
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl font-extrabold text-nature-ink">{member.name}</h1>
            <p className="text-nature-brand text-lg mt-1">{member.role}</p>
            <p className="text-nature-muted mt-2">{member.rm} · Turma {member.turma}</p>
            <p className="text-nature-muted mt-4">{member.bio}</p>
            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <a href={member.github} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-lg bg-nature-bg text-nature-ink-soft shadow-soft">GitHub</a>
              <a href={member.linkedin} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-lg bg-nature-bg text-nature-ink-soft shadow-soft">LinkedIn</a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
