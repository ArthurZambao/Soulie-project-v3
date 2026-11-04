import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ImagePlus, Send, X } from 'lucide-react';
import { Card } from '../components/Card';
import { PageStatus } from '../components/PageStatus';
import { DetailSkeleton } from '../components/Skeleton';
import { getMissions, getValidation, validateMission } from '../api/game';
import { toErrorMessage } from '../api/http';
import type { DailyMissionResponse, MissionValidationResponse } from '../api/types';
import { missionTagClass } from '../constants/missions';

export function Missao() {
  const { id } = useParams<{ id: string }>();
  const missionId = Number(id);
  const [mission, setMission] = useState<DailyMissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<MissionValidationResponse | null>(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!Number.isFinite(missionId)) {
      setError('Identificador de missão inválido.');
      setLoading(false);
      return;
    }
    getMissions()
      .then((list) => {
        const found = list.find((m) => m.id === missionId) ?? null;
        setMission(found);
        if (!found) setError('Missão não encontrada.');
      })
      .catch((err) => setError(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [missionId]);

  useEffect(() => {
    if (!result || result.status !== 'PENDING' || !result.validationId) return;
    const timer = window.setInterval(() => {
      getValidation(result.validationId)
        .then(setResult)
        .catch(() => undefined);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [result]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const pickFile = (next: File | null) => {
    setFile(next);
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return next ? URL.createObjectURL(next) : null;
    });
  };

  const onFile = (next: File | undefined | null) => {
    if (!next) return;
    if (!next.type.startsWith('image/')) return;
    pickFile(next);
  };

  const send = async () => {
    if (!file || !mission) return;
    setSending(true);
    try {
      const res = await validateMission(mission.id, file);
      setResult(res);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (loading || (error && !mission)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <PageStatus loading={loading} error={error} skeleton={<DetailSkeleton />} />
        {error && <Link to="/dashboard" className="text-nature-brand mt-4 inline-block">Voltar ao dashboard</Link>}
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Missão não encontrada</h2>
        <Link to="/dashboard" className="text-nature-brand">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/dashboard" className="text-gray-400 hover:text-white">← Missões</Link>
      <Card
        className="mt-6"
        variant="accent"
        title={`${mission.emoji} ${mission.name}`}
        subtitle={`+${mission.xp} XP · ${mission.period}`}
        headerAction={(
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${missionTagClass(mission.tag)}`}>
            {mission.tag}
          </span>
        )}
      >
        <p className="text-gray-300 leading-relaxed">{mission.desc}</p>
        {mission.done && (
          <p className="mt-4 text-nature-success text-sm">Você já concluiu esta missão neste período.</p>
        )}

        {!mission.done && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-white">Foto da evidência</p>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFile(e.dataTransfer.files[0]);
              }}
              className={`relative flex flex-col items-center justify-center min-h-52 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                dragOver
                  ? 'border-nature-brand bg-nature-brand/15 shadow-card'
                  : preview
                    ? 'border-nature-brand/40 bg-nature-bg shadow-soft'
                    : 'border-nature-border bg-nature-bg hover:border-nature-brand hover:bg-nature-brand/10 shadow-soft'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />

              {preview && file ? (
                <>
                  <img src={preview} alt="Prévia da evidência" className="max-h-56 w-auto rounded-xl object-contain shadow-card" />
                  <p className="mt-4 text-sm text-white font-medium truncate max-w-full">{file.name}</p>
                  <p className="mt-1 text-xs text-nature-accent">Clique para escolher outra foto</p>
                </>
              ) : (
                <>
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-nature-brand/15 text-nature-brand shadow-soft">
                    <ImagePlus className="h-7 w-7" />
                  </span>
                  <p className="font-display text-lg font-semibold text-white">Enviar foto da evidência</p>
                  <p className="mt-1 text-sm text-gray-400">Clique aqui ou arraste a imagem para esta área</p>
                  <p className="mt-3 text-xs text-gray-500">JPG, PNG ou WEBP</p>
                </>
              )}
            </label>

            {file && (
              <button
                type="button"
                onClick={() => {
                  pickFile(null);
                  if (inputRef.current) inputRef.current.value = '';
                }}
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" /> Remover foto
              </button>
            )}

            <button
              type="button"
              disabled={!file || sending}
              onClick={() => void send()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl btn-brand font-medium disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? 'Enviando foto...' : file ? 'Enviar foto para análise' : 'Escolha uma foto para enviar'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl bg-nature-bg p-4 text-sm shadow-soft">
            <p className="text-white font-medium">Status: {result.status}</p>
            {result.status === 'PENDING' && <p className="text-gray-400 mt-2">A IA ainda está olhando a foto. Esta tela atualiza sozinha.</p>}
            {result.reason && <p className="text-gray-300 mt-2">{result.reason}</p>}
            {result.success && <p className="text-nature-success mt-2">Aprovado. +{result.xpGained} XP</p>}
            {result.aiDetections?.length > 0 && (
              <ul className="mt-2 text-gray-400 list-disc pl-4">
                {result.aiDetections.map((d) => <li key={d}>{d}</li>)}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
