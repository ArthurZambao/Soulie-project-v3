import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { TEAM_MEMBERS } from '../constants/integrantes';

export function Integrantes() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <header className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-3">Os Guardiões do Soulie</h1>
        <p className="text-gray-400">Equipe de Engenharia de Software da FIAP — turmas 1TDSPY e 1TDSPV.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {TEAM_MEMBERS.map((member) => (
          <Card key={member.id} variant="brand">
            <div className="flex flex-col items-center text-center">
              <img src={member.photo} alt={`Foto de ${member.name}`} className="w-24 h-24 rounded-full object-cover border-2 border-nature-border mb-4" />
              <h3 className="font-display text-xl font-bold text-white">{member.name}</h3>
              <p className="text-sm text-nature-brand mb-2">{member.role}</p>
              <p className="text-xs text-gray-400 mb-1">{member.rm}</p>
              <p className="text-xs text-gray-500 mb-4">Turma {member.turma}</p>
              <div className="flex gap-2 w-full">
                <a href={member.github} target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg bg-nature-bg text-sm text-gray-300 shadow-soft hover:shadow-card">GitHub</a>
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg bg-nature-bg text-sm text-gray-300 shadow-soft hover:shadow-card">LinkedIn</a>
              </div>
              <Link to={`/integrante/${member.id}`} className="mt-4 w-full py-2 rounded-lg bg-nature-brand/10 text-nature-brand text-sm shadow-soft">
                Ver perfil completo
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
