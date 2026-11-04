import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, MessageSquare, Send, User } from 'lucide-react';
import { Card } from '../components/Card';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contato() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({ mode: 'onBlur' });

  const onSubmit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setOk(true);
      reset();
      setTimeout(() => navigate('/?msg=contato'), 2000);
    }, 1200);
  };

  const field = 'w-full bg-nature-bg border rounded-lg px-4 py-3 text-nature-ink focus:outline-none focus:ring-2 focus:ring-nature-brand';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <header className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-nature-ink mb-3 flex justify-center items-center gap-3">
          <MessageSquare className="w-8 h-8 text-nature-brand" /> Fale Conosco
        </h1>
        <p className="text-nature-muted">Dúvida, sugestão ou parceria. Respondemos em até 48h.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card variant="accent">
          <h3 className="font-display text-xl font-bold text-nature-ink mb-6">Contato</h3>
          <div className="flex gap-3 mb-4">
            <Mail className="w-5 h-5 text-nature-accent" />
            <div>
              <p className="text-nature-ink font-medium">E-mail</p>
              <p className="text-sm text-nature-muted">soulie@soulup.com.br</p>
            </div>
          </div>
          <div className="flex gap-3">
            <User className="w-5 h-5 text-nature-accent" />
            <div>
              <p className="text-nature-ink font-medium">Telefone</p>
              <p className="text-sm text-nature-muted">+55 11 3385-8010</p>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card variant="brand">
            {ok && (
              <div className="mb-4 rounded-lg border border-nature-success/30 bg-nature-success/10 p-3 flex gap-2 text-nature-success">
                <CheckCircle2 className="w-5 h-5" /> Mensagem enviada! Redirecionando...
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="text-sm text-nature-ink-soft">Nome *</label>
                <input id="name" className={`${field} ${errors.name ? 'border-red-500' : 'border-nature-border'}`} {...register('name', { required: 'Informe o nome', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-nature-ink-soft">E-mail *</label>
                <input id="email" type="email" className={`${field} ${errors.email ? 'border-red-500' : 'border-nature-border'}`} {...register('email', { required: 'Informe o e-mail', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' } })} />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="subject" className="text-sm text-nature-ink-soft">Assunto *</label>
                <select id="subject" defaultValue="" className={`${field} ${errors.subject ? 'border-red-500' : 'border-nature-border'}`} {...register('subject', { required: 'Escolha um assunto' })}>
                  <option value="" disabled>Selecione</option>
                  <option value="duvida">Dúvida técnica</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="parceria">Parceria</option>
                </select>
                {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className="text-sm text-nature-ink-soft">Mensagem *</label>
                <textarea id="message" rows={5} className={`${field} ${errors.message ? 'border-red-500' : 'border-nature-border'}`} {...register('message', { required: 'Escreva a mensagem', minLength: { value: 10, message: 'Mínimo 10 caracteres' } })} />
                {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg btn-brand font-semibold disabled:opacity-50">
                <Send className="w-4 h-4" /> {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
