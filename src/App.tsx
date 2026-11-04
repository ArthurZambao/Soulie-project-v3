import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Sobre } from './pages/Sobre';
import { Integrantes } from './pages/Integrantes';
import { IntegranteDetail } from './pages/IntegranteDetail';
import { FAQ } from './pages/FAQ';
import { Contato } from './pages/Contato';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { Missao } from './pages/Missao';
import { Jardim } from './pages/Jardim';
import { Chat } from './pages/Chat';
import { Recompensas } from './pages/Recompensas';
import { RecompensaDetail } from './pages/RecompensaDetail';
import { Perfil } from './pages/Perfil';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-nature-surface rounded-full flex items-center justify-center mb-6 shadow-card">
        <span className="text-4xl">🌱</span>
      </div>
      <h2 className="text-3xl font-bold text-nature-ink mb-4">Página não encontrada</h2>
      <p className="text-nature-muted max-w-md mb-8">Esse caminho não existe no jardim.</p>
      <Link to="/" className="px-6 py-3 rounded-lg btn-brand">Voltar ao início</Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/about" element={<Navigate to="/sobre" replace />} />
            <Route path="/integrantes" element={<Integrantes />} />
            <Route path="/integrante/:id" element={<IntegranteDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/missao/:id" element={<ProtectedRoute><Missao /></ProtectedRoute>} />
            <Route path="/jardim" element={<ProtectedRoute><Jardim /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/recompensas" element={<ProtectedRoute><Recompensas /></ProtectedRoute>} />
            <Route path="/recompensa/:id" element={<ProtectedRoute><RecompensaDetail /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
