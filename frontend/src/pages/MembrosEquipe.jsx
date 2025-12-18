import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, X } from 'react-bootstrap-icons';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { MembroEquipeForm } from '../components/MembroEquipeForm';

const emptyMembro = {
  nome_completo: '',
  cargo: '',
  role: '',
  foto_url: '',
  ordem_exibicao: 0,
  ativo: true,
};

export const MembrosEquipe = () => {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState(emptyMembro);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);

  const loadMembros = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/membros-equipe');
      setMembros(data.data?.membros || []);
    } catch (error) {
      toast.error('Não foi possível carregar os membros da equipe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembros();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (current.id) {
        await api.put(`/membros-equipe/${current.id}`, current);
        toast.success('Membro atualizado com sucesso.');
      } else {
        await api.post('/membros-equipe', current);
        toast.success('Membro adicionado com sucesso.');
      }
      setShowModal(false);
      setCurrent(emptyMembro);
      loadMembros();
    } catch (error) {
      toast.error('Erro ao salvar membro.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!removing) return;
    try {
      await api.delete(`/membros-equipe/${removing.id}`);
      toast.success('Membro removido.');
      setMembros((prev) => prev.filter((membro) => membro.id !== removing.id));
    } catch (error) {
      toast.error('Erro ao remover membro.');
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
        title="Membros da Equipe"
        subtitle="Gerencie os membros que aparecem no site público"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Membros da Equipe' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              setCurrent(emptyMembro);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            Novo Membro
          </button>
        }
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Foto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Função
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
              {membros.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                membros.map((membro) => (
                  <tr key={membro.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {membro.foto_url ? (
                        <img
                          src={membro.foto_url}
                          alt={membro.nome_completo}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          Sem foto
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{membro.nome_completo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{membro.cargo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{membro.role || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          membro.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {membro.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrent(membro);
                            setShowModal(true);
                          }}
                          className="p-2 text-fjpp-blue hover:bg-fjpp-light rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoving(membro)}
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
                {current.id ? 'Editar Membro' : 'Novo Membro'}
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
              <MembroEquipeForm
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
        title="Excluir membro"
        message={`Tem certeza que deseja excluir ${removing?.nome_completo}?`}
      />
    </div>
  );
};

