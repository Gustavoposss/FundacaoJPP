import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, X } from 'react-bootstrap-icons';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { PatrocinadorForm } from '../components/PatrocinadorForm';

const emptyPatrocinador = {
  nome: '',
  logo_url: '',
  titulo: '',
  link_website: '',
  ordem_exibicao: 0,
  ativo: true,
};

export const Patrocinadores = () => {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyPatrocinador);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);

  const loadPatrocinadores = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patrocinadores');
      setPatrocinadores(data.data?.patrocinadores || []);
    } catch (error) {
      toast.error('Não foi possível carregar os patrocinadores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatrocinadores();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (current.id) {
        await api.put(`/patrocinadores/${current.id}`, current);
        toast.success('Patrocinador atualizado com sucesso.');
      } else {
        await api.post('/patrocinadores', current);
        toast.success('Patrocinador adicionado com sucesso.');
      }
      setShowModal(false);
      setCurrent(emptyPatrocinador);
      loadPatrocinadores();
    } catch (error) {
      toast.error('Erro ao salvar patrocinador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!removing) return;
    try {
      await api.delete(`/patrocinadores/${removing.id}`);
      toast.success('Patrocinador removido.');
      setPatrocinadores((prev) => prev.filter((patrocinador) => patrocinador.id !== removing.id));
    } catch (error) {
      toast.error('Erro ao remover patrocinador.');
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
        title="Patrocinadores"
        subtitle="Gerencie os patrocinadores que aparecem no site público"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Patrocinadores' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              setCurrent(emptyPatrocinador);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            Novo Patrocinador
          </button>
        }
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patrocinadores.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Nenhum patrocinador encontrado.
                  </td>
                </tr>
              ) : (
                patrocinadores.map((patrocinador) => (
                  <tr key={patrocinador.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {patrocinador.logo_url ? (
                        <img
                          src={patrocinador.logo_url}
                          alt={patrocinador.nome}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded">
                          Sem logo
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{patrocinador.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{patrocinador.titulo || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {patrocinador.link_website ? (
                        <a
                          href={patrocinador.link_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fjpp-blue hover:underline"
                        >
                          Visitar
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patrocinador.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patrocinador.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrent(patrocinador);
                            setShowModal(true);
                          }}
                          className="p-2 text-fjpp-blue hover:bg-fjpp-light rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoving(patrocinador)}
                          className="p-2 text-fjpp-red hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash size={18} />
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
                {current.id ? 'Editar Patrocinador' : 'Novo Patrocinador'}
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
              <PatrocinadorForm
                values={current}
                onChange={(event) => {
                  const { name, value, type, checked } = event.target;
                  setCurrent((prev) => ({
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value,
                  }));
                }}
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
        title="Excluir patrocinador"
        message={`Tem certeza que deseja excluir ${removing?.nome}?`}
      />
    </div>
  );
};

