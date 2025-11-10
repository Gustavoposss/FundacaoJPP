import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, X } from 'react-bootstrap-icons';
import { api } from '../services/api';
import { EventoForm } from '../components/EventoForm';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';

const emptyEvento = { nome: '', data_evento: '', local: '', descricao: '' };

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyEvento);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);

  const loadEventos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/eventos');
      setEventos(data.data?.eventos || []);
    } catch (error) {
      toast.error('Não foi possível carregar os eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (current.id) {
        await api.put(`/eventos/${current.id}`, current);
        toast.success('Evento atualizado com sucesso.');
      } else {
        await api.post('/eventos', current);
        toast.success('Evento criado com sucesso.');
      }
      setShowModal(false);
      setCurrent(emptyEvento);
      loadEventos();
    } catch (error) {
      toast.error('Erro ao salvar evento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!removing) return;
    try {
      await api.delete(`/eventos/${removing.id}`);
      toast.success('Evento excluído.');
      setEventos((prev) => prev.filter((evento) => evento.id !== removing.id));
    } catch (error) {
      toast.error('Erro ao excluir evento.');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Eventos"
        subtitle="Cadastre, edite e acompanhe os eventos da fundação"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Eventos' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              setCurrent(emptyEvento);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            Novo Evento
          </button>
        }
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Local</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              ) : (
                eventos.map((evento) => (
                  <tr key={evento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{evento.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(evento.data_evento).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{evento.local}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{evento.descricao || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrent(evento);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoving(evento)}
                          className="p-2 text-fjpp-red bg-white border border-fjpp-red rounded-lg hover:bg-fjpp-red hover:text-white transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {current.id ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <EventoForm
                values={current}
                onChange={(event) =>
                  setCurrent((prev) => ({ ...prev, [event.target.name]: event.target.value }))
                }
                onSubmit={handleSubmit}
                loading={saving}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={Boolean(removing)}
        onCancel={() => setRemoving(null)}
        onConfirm={handleDelete}
        title="Excluir evento"
        message={`Tem certeza que deseja excluir o evento ${removing?.nome}?`}
      />
    </div>
  );
};

