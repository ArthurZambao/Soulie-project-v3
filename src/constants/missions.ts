function normalizeTag(tag: string) {
  return tag.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

const TAG_CLASS: Record<string, string> = {
  reciclagem: 'text-green-400 border-green-400',
  residuos: 'text-lime-400 border-lime-400',
  mobilidade: 'text-blue-400 border-blue-400',
  agua: 'text-cyan-400 border-cyan-400',
  energia: 'text-yellow-400 border-yellow-400',
  consumo: 'text-purple-400 border-purple-400',
  alimentacao: 'text-orange-400 border-orange-400',
  natureza: 'text-emerald-400 border-emerald-400',
};

export function missionTagClass(tag: string | null | undefined) {
  if (!tag) return 'text-gray-400 border-gray-500';
  return TAG_CLASS[normalizeTag(tag)] ?? 'text-gray-400 border-gray-500';
}
