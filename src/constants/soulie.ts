import type { FlowerType, SoulieMood } from '../api/types';

export type SvgTheme = 'paubrasil' | 'samambaia' | 'acaizeiro' | 'ipeamarelo' | 'mandacaru' | 'bush';

export const moodAnimation: Record<SoulieMood, string> = {
  happy: 'animate-soulie-float',
  sad: 'animate-soulie-droop saturate-[0.6] brightness-[0.85]',
  wilted: 'animate-soulie-wilt saturate-[0.3] brightness-[0.7] sepia-[0.2]',
  excited: 'animate-soulie-bounce',
};

export const moodLabel: Record<SoulieMood, string> = {
  happy: '😊 Feliz',
  sad: '😢 Triste',
  wilted: '🥀 Murcho',
  excited: '🤩 Animado',
};

export const FlowerName = {
  Girassol: 'Girassol',
  Rosa: 'Rosa',
  Hibisco: 'Hibisco',
  Lavanda: 'Lavanda',
  Margarida: 'Margarida',
  Orquidea: 'Orquídea',
  IpeAmarelo: 'Ipê-amarelo',
  GuaimbeOndulado: 'Guaimbê-ondulado',
  ManacaDaSerra: 'Manacá-da-serra',
  Maranta: 'Maranta',
  Pacova: 'Pacová',
  Pitangueira: 'Pitangueira',
  RainhaDoAbismo: 'Rainha-do-abismo',
  TrevoRoxo: 'Trevo roxo',
  Mulungu: 'Mulungu',
  SucupiraPreta: 'Sucupira-preta',
  ArvoreTecnologica: 'Árvore Tecnológica',
} as const;

export type FlowerName = (typeof FlowerName)[keyof typeof FlowerName];

export const FLOWER_NAME_BY_TYPE: Record<FlowerType, FlowerName> = {
  girassol: FlowerName.Girassol,
  rosa: FlowerName.Rosa,
  hibisco: FlowerName.Hibisco,
  lavanda: FlowerName.Lavanda,
  margarida: FlowerName.Margarida,
  orquidea: FlowerName.Orquidea,
  ipe_amarelo: FlowerName.IpeAmarelo,
  guaimbe_ondulado: FlowerName.GuaimbeOndulado,
  manaca_da_serra: FlowerName.ManacaDaSerra,
  maranta: FlowerName.Maranta,
  pacova: FlowerName.Pacova,
  pitangueira: FlowerName.Pitangueira,
  rainha_do_abismo: FlowerName.RainhaDoAbismo,
  trevo_roxo: FlowerName.TrevoRoxo,
  mulungu: FlowerName.Mulungu,
  sucupira_preta: FlowerName.SucupiraPreta,
  arvore_tecnologica: FlowerName.ArvoreTecnologica,
};

export function flowerDisplayName(type: string | null | undefined): string {
  if (!type) return FlowerName.Girassol;
  return FLOWER_NAME_BY_TYPE[type as FlowerType] ?? type.replaceAll('_', ' ');
}

export const FLOWER_COLOR: Record<FlowerType, string> = {
  girassol: '#eab308',
  rosa: '#f43f5e',
  hibisco: '#e11d48',
  lavanda: '#a78bfa',
  margarida: '#fde68a',
  orquidea: '#d946ef',
  ipe_amarelo: '#facc15',
  guaimbe_ondulado: '#22c55e',
  manaca_da_serra: '#c084fc',
  maranta: '#34d399',
  pacova: '#65a30d',
  pitangueira: '#ef4444',
  rainha_do_abismo: '#fb923c',
  trevo_roxo: '#9333ea',
  mulungu: '#f97316',
  sucupira_preta: '#a8a29e',
  arvore_tecnologica: '#22d3ee',
};

export function flowerColor(type: string | null | undefined): string {
  if (!type) return FLOWER_COLOR.girassol;
  return FLOWER_COLOR[type as FlowerType] ?? '#3b82f6';
}

export function flowerToSvgTheme(flower: FlowerType | string): SvgTheme {
  switch (flower) {
    case 'ipe_amarelo':
    case 'girassol':
    case 'margarida':
      return 'ipeamarelo';
    case 'guaimbe_ondulado':
    case 'manaca_da_serra':
    case 'maranta':
    case 'pacova':
      return 'samambaia';
    case 'trevo_roxo':
    case 'orquidea':
      return 'acaizeiro';
    case 'rainha_do_abismo':
    case 'arvore_tecnologica':
    case 'lavanda':
      return 'mandacaru';
    case 'mulungu':
    case 'sucupira_preta':
      return 'bush';
    default:
      return 'paubrasil';
  }
}

export const EVOLUTION = [
  { level: 0, name: 'Semente', emoji: '🌰' },
  { level: 1, name: 'Broto', emoji: '🌱' },
  { level: 2, name: 'Muda', emoji: '🌿' },
  { level: 3, name: 'Árvore', emoji: '🌳' },
];
