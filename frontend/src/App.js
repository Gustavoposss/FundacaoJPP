import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Idosos } from './pages/Idosos';
import { IdosoCadastro } from './pages/IdosoCadastro';
import { IdosoDetalhes } from './pages/IdosoDetalhes';
import { Eventos } from './pages/Eventos';
import { Presencas } from './pages/Presencas';
import { Relatorios } from './pages/Relatorios';
import { NotFound } from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout requiresAuth={false} />}>
          <Route index element={<Login />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/idosos" element={<Idosos />} />
          <Route path="/idosos/novo" element={<IdosoCadastro />} />
          <Route path="/idosos/editar/:id" element={<IdosoCadastro />} />
          <Route path="/idosos/:id" element={<IdosoDetalhes />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/presencas" element={<Presencas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
