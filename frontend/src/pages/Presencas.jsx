import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { PresencaTable } from '../components/PresencaTable';
import { PageHeader } from '../components/PageHeader';

export const Presencas = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [idosos, setIdosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const { data } = await api.get('/eventos');
        setEventos(data.data?.eventos || []);
      } catch (error) {
        toast.error('Não foi possível carregar os eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const fetchIdosos = async () => {
      if (!selectedEvento) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/presencas/${selectedEvento}/idosos`);
        setIdosos(data.data?.idosos || []);
      } catch (error) {
        toast.error('Erro ao carregar lista de presenças.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdosos();
  }, [selectedEvento]);

  const togglePresenca = (idosoId) => {
    setIdosos((prev) =>
      prev.map((idoso) =>
        idoso.id === idosoId ? { ...idoso, presente: !idoso.presente } : idoso
      )
    );
  };

  const handleSave = async () => {
    if (!selectedEvento) return;
    setSaving(true);
    try {
      await api.post(`/presencas/${selectedEvento}`, {
        presencas: idosos.map((idoso) => ({
          idosoId: idoso.id,
          presente: idoso.presente,
        })),
      });
      toast.success('Presenças registradas com sucesso.');
    } catch (error) {
      toast.error('Erro ao salvar presenças.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Registro de Presenças"
        subtitle="Selecione um evento e marque os idosos presentes"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Presenças' },
        ]}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
            value={selectedEvento}
            onChange={(event) => setSelectedEvento(event.target.value)}
          >
            <option value="">Selecione um evento</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nome} - {new Date(evento.data_evento).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : selectedEvento ? (
          <PresencaTable
            idosos={idosos}
            togglePresenca={togglePresenca}
            onSave={handleSave}
            saving={saving}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">Selecione um evento para visualizar as presenças.</p>
        )}
      </div>
    </div>
  );
};

