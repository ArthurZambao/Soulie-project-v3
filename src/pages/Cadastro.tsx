import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { toErrorMessage } from '../api/http';

interface CadastroForm {
  name: string;
  email: string;
  password: string;
}

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function Cadastro() {
  const { token, register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CadastroForm>();

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: CadastroForm) => {
    setError(null);
    try {
      await signUp(data.name, data.email, data.password);
      navigate('/login?msg=created');
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const field = 'w-full bg-nature-bg border rounded-lg px-4 py-3 text-white';

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Criar conta</h1>
      <p className="text-gray-400 mb-6">A senha precisa de 8 caracteres, maiúscula, minúscula, número e um símbolo @$!%*?&.</p>
      <Card variant="brand">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label htmlFor="name" className="text-sm text-gray-300">Nome</label>
            <input id="name" className={`${field} ${errors.name ? 'border-red-500' : 'border-nature-border'}`} {...register('name', { required: 'Informe o nome', minLength: { value: 2, message: 'Nome muito curto' } })} />
            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-sm text-gray-300">E-mail</label>
            <input id="email" type="email" className={`${field} ${errors.email ? 'border-red-500' : 'border-nature-border'}`} {...register('email', { required: 'Informe o e-mail' })} />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-gray-300">Senha</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} className={`${field} pr-12 ${errors.password ? 'border-red-500' : 'border-nature-border'}`} {...register('password', { required: 'Informe a senha', pattern: { value: PASSWORD_RULE, message: 'A senha precisa de 8 caracteres, com maiúscula, minúscula, número e um símbolo (@$!%*?&).' } })} />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg btn-brand font-semibold disabled:opacity-50">
            {isSubmitting ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4">
          Já tem conta? <Link to="/login" className="text-nature-brand">Entrar</Link>
        </p>
      </Card>
    </div>
  );
}
