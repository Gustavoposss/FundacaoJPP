import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash, Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { useDebounce } from '../hooks/useDebounce';
import { cleanCPF } from '../utils/validators';

export const Idosos = () => {
  const navigate = useNavigate();
  const [idosos, setIdosos] = useState([]);
  const [filteredIdosos, setFilteredIdosos] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Debounce de 500ms para evitar interrupção durante a digitação (boa prática)
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Normaliza a busca: remove espaços extras e aceita CPF com ou sem formatação
  const normalizeSearch = (searchTerm) => {
    if (!searchTerm) return '';
    const normalized = searchTerm.trim().toLowerCase();
    const numbersOnly = normalized.replace(/\D/g, '');
    if (numbersOnly.length >= 3 && numbersOnly.length <= 11) {
      return numbersOnly; // Retorna apenas números para CPF
    }
    return normalized; // Retorna o texto normalizado para busca por nome
  };

  // Carrega todos os idosos uma única vez ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/idosos');
        const fetchedIdosos = data.data?.idosos || [];
        setIdosos(fetchedIdosos);
        setFilteredIdosos(fetchedIdosos);
      } catch (error) {
        toast.error('Não foi possível carregar a lista de idosos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtra os idosos localmente baseado na busca e status (igual Presencas.jsx)
  useEffect(() => {
    const normalizedSearch = normalizeSearch(debouncedSearch);
    let filtered = [...idosos];

    // Aplica filtro de busca (nome ou CPF)
    if (normalizedSearch && normalizedSearch.length >= 2) {
      filtered = filtered.filter((idoso) => {
        const nomeMatch = idoso.nome_completo?.toLowerCase().includes(normalizedSearch);
        const cpfMatch = idoso.cpf?.replace(/\D/g, '').includes(normalizedSearch);
        return nomeMatch || cpfMatch;
      });
    }

    // Aplica filtro de status
    if (statusFilter) {
      filtered = filtered.filter((idoso) => idoso.status === statusFilter);
    }

    setFilteredIdosos(filtered);
  }, [debouncedSearch, statusFilter, idosos]);

  const handleDelete = async () => {
    try {
      await api.delete(`/idosos/${selected.id}`);
      toast.success('Idoso excluído com sucesso.');
      setIdosos((prev) => prev.filter((idoso) => idoso.id !== selected.id));
      setFilteredIdosos((prev) => prev.filter((idoso) => idoso.id !== selected.id));
    } catch (error) {
      toast.error('Erro ao excluir idoso.');
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Lista de Idosos"
        subtitle="Visualize, filtre e gerencie os idosos cadastrados"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Idosos' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => navigate('/idosos/novo')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
            Novo Idoso
          </button>
        }
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4 flex gap-3 items-center">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou CPF (mínimo 2 caracteres)"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
            />
            {search.length > 0 && search.length < 2 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-400">Digite pelo menos 2 caracteres</span>
              </div>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
          >
            <option value="">Todos os status</option>
            <option value="fixo">Fixos</option>
            <option value="espera">Espera</option>
            <option value="inadimplente">Inadimplentes</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sexo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CPF</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdosos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nenhum idoso encontrado.
                  </td>
                </tr>
              ) : (
                filteredIdosos.map((idoso) => (
                  <tr key={idoso.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{idoso.nome_completo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{idoso.sexo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          idoso.status === 'fixo'
                            ? 'bg-green-100 text-green-800'
                            : idoso.status === 'espera'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {idoso.status === 'fixo' ? 'Fixos' : idoso.status === 'espera' ? 'Espera' : 'Inadimplentes'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{idoso.telefone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{idoso.cpf ? cleanCPF(idoso.cpf) : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/idosos/${idoso.id}`)}
                          className="px-3 py-1 text-xs font-medium text-fjpp-blue bg-white border border-fjpp-blue rounded-lg hover:bg-fjpp-blue hover:text-white transition-colors"
                        >
                          Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/idosos/editar/${idoso.id}`)}
                          className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(idoso);
                            setShowModal(true);
                          }}
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

      <ConfirmModal
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Excluir idoso"
        message={`Tem certeza que deseja excluir ${selected?.nome_completo}?`}
      />
    </div>
  );
};

