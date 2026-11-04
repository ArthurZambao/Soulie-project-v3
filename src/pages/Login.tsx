import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { toErrorMessage } from '../api/http';

interface LoginForm {
  email: string;
  password: string;
}

const MESSAGES: Record<string, string> = {
  login: 'Faça login para acessar essa página.',
  created: 'Conta criada. Entre com o mesmo e-mail e senha.',
};

export function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const from = params.get('from') || '/dashboard';
  const banner = params.get('msg');

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate(from.startsWith('/') ? from : '/dashboard');
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const field = 'w-full bg-nature-bg border rounded-lg px-4 py-3 text-white';

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Entrar</h1>
      <p className="text-gray-400 mb-6">Use o e-mail cadastrado. Exemplo de senha da API: Soulie@2026</p>

      {banner && MESSAGES[banner] && (
        <p className="mb-4 rounded-lg border border-nature-brand/30 bg-nature-brand/10 px-4 py-3 text-sm text-nature-brand">
          {MESSAGES[banner]}
        </p>
      )}

      <Card variant="brand">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label htmlFor="email" className="text-sm text-gray-300">E-mail</label>
            <input id="email" type="email" className={`${field} ${errors.email ? 'border-red-500' : 'border-nature-border'}`} {...register('email', { required: 'Informe o e-mail' })} />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-gray-300">Senha</label>
            <input id="password" type="password" className={`${field} ${errors.password ? 'border-red-500' : 'border-nature-border'}`} {...register('password', { required: 'Informe a senha' })} />
            {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg btn-brand font-semibold disabled:opacity-50">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4">
          Ainda não tem conta? <Link to="/cadastro" className="text-nature-brand">Cadastre-se</Link>
        </p>
      </Card>
    </div>
  );
}
