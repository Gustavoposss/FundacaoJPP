import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts';
import { toast } from 'react-toastify';
import { formatarDataBR } from '../utils/dateUtils';
import { Plus, ClipboardCheck } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { PageHeader } from '../components/PageHeader';

const cardsConfig = [
  { key: 'total_idosos', title: 'Total de idosos cadastrados', placeholder: 0 },
  { key: 'total_eventos', title: 'Total de eventos realizados', placeholder: 0 },
  { key: 'proximo_evento', title: 'Próximo evento', placeholder: '-' },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(cardsConfig.map((card) => ({ ...card, value: card.placeholder })));
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setCards((prev) =>
          prev.map((card) => {
            if (card.key === 'proximo_evento') {
              const evento = data.data?.proximo_evento;
              if (!evento) {
                return { ...card, value: '-' };
              }

              const dataFormatada = formatarDataBR(evento.data_evento);

              return {
                ...card,
                value: `${evento.nome} - ${dataFormatada}`,
              };
            }

            return {
              ...card,
              value: data.data?.[card.key] ?? card.value,
            };
          })
        );
        setGraphData(data.data?.presencasRecentes || []);
      } catch (error) {
        toast.error('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-fjpp-gray-50 min-h-screen">
      <PageHeader
        title="Dashboard"
        subtitle="Fundação J.P.P. — visão geral de indicadores e eventos"
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/idosos/novo')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-fjpp-green to-fjpp-green-600 rounded-xl hover:from-fjpp-green-600 hover:to-fjpp-green-700 transition-all shadow-button hover:shadow-elevated transform hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Novo Idoso
            </button>
            <button
              type="button"
              onClick={() => navigate('/presencas')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-fjpp-green bg-white border-2 border-fjpp-green rounded-xl hover:bg-fjpp-green hover:text-white transition-all shadow-soft hover:shadow-button transform hover:-translate-y-0.5"
            >
              <ClipboardCheck size={18} />
              Registrar Presença
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {cards.map((card, index) => (
          <div 
            key={card.key} 
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold text-fjpp-gray-600 uppercase tracking-wide">{card.title}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                card.key === 'total_idosos' ? 'bg-fjpp-blue-100' : 
                card.key === 'total_eventos' ? 'bg-fjpp-green-100' : 
                'bg-fjpp-gray-100'
              }`}>
                {card.key === 'total_idosos' && (
                  <svg className="w-5 h-5 text-fjpp-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                )}
                {card.key === 'total_eventos' && (
                  <svg className="w-5 h-5 text-fjpp-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                )}
                {card.key === 'proximo_evento' && (
                  <svg className="w-5 h-5 text-fjpp-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-3xl font-bold text-fjpp-gray-900 mb-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h5 className="text-xl font-bold text-fjpp-gray-900 mb-1">Presença nos Últimos Eventos</h5>
            <small className="text-fjpp-gray-500 font-medium">Resumo dos últimos 6 eventos realizados</small>
          </div>
        </div>
        {graphData.length > 0 ? (
          <div style={{ width: '100%', minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <defs>
                  <linearGradient id="colorPresentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a859" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#008647" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="evento" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip
                  formatter={(value) => [`${value} presenças`, 'Presentes']}
                  labelFormatter={(label) => `Evento: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="presentes" 
                  fill="url(#colorPresentes)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-fjpp-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fjpp-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-fjpp-gray-500 font-medium">Ainda não há registros de presenças para exibir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

