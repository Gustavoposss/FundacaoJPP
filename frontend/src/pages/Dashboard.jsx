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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

              const dataFormatada = format(new Date(evento.data_evento), 'dd/MM/yyyy', {
                locale: ptBR,
              });

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
    <div className="p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Fundação J.P.P. — visão geral de indicadores e eventos"
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate('/idosos/novo')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus size={18} />
              Novo Idoso
            </button>
            <button
              type="button"
              onClick={() => navigate('/presencas')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-fjpp-green bg-white border border-fjpp-green rounded-lg hover:bg-fjpp-green hover:text-white transition-colors"
            >
              <ClipboardCheck size={18} />
              Registrar Presença
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">{card.title}</p>
            <p className="text-3xl font-bold text-fjpp-blue">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="text-lg font-semibold text-fjpp-blue mb-1">Presença nos Últimos Eventos</h5>
            <small className="text-gray-500">Resumo dos últimos 6 eventos</small>
          </div>
        </div>
        {graphData.length > 0 ? (
          <div style={{ width: '100%', minHeight: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="evento" />
                <Tooltip
                  formatter={(value) => [`${value} presenças`, 'Presentes']}
                  labelFormatter={(label) => `Evento: ${label}`}
                />
                <Bar dataKey="presentes" fill="#00a859" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Ainda não há registros de presenças para exibir.</p>
        )}
      </div>
    </div>
  );
};

