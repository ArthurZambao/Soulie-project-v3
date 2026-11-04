export interface FAQItem {
  id: string;
  category: 'Geral' | 'Gamificação' | 'Missões' | 'Comunidade' | 'Dados';
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Geral',
    question: 'O que é o Soulie?',
    answer: 'O Soulie é uma plataforma gamificada que incentiva hábitos sustentáveis. Você cuida de uma planta virtual, cumpre missões validadas por foto e acompanha o impacto da comunidade.',
  },
  {
    id: 'faq-2',
    category: 'Gamificação',
    question: 'Como o Soulie evolui?',
    answer: 'Missões aprovadas geram XP. Com o XP a planta sobe de semente a árvore. Regar todo dia ajuda a manter a sequência (streak).',
  },
  {
    id: 'faq-3',
    category: 'Missões',
    question: 'Como comprovamos uma missão?',
    answer: 'Abra a missão, envie uma foto e aguarde a análise. Enquanto estiver pendente o XP ainda não entra. Se a foto for recusada, o motivo aparece na tela.',
  },
  {
    id: 'faq-4',
    category: 'Comunidade',
    question: 'O que é o Jardim?',
    answer: 'É o espaço coletivo: ranking, feed, convite por código e cutucadas entre quem compartilha o jardim ou se segue.',
  },
  {
    id: 'faq-5',
    category: 'Geral',
    question: 'O uso é gratuito?',
    answer: 'Sim. As funções principais de missões, planta e comunidade são gratuitas.',
  },
  {
    id: 'faq-6',
    category: 'Dados',
    question: 'Como meus dados são tratados?',
    answer: 'Você pode baixar um JSON com perfil, atividades e conquistas no Perfil, e solicitar a exclusão da conta. Fotos de evidência não devem incluir rostos de terceiros ou documentos.',
  },
];
