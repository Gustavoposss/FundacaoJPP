import { useEffect, useState } from 'react';
import { Search } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { PresencaTable } from '../components/PresencaTable';
import { PageHeader } from '../components/PageHeader';
import { useDebounce } from '../hooks/useDebounce';
import { cleanCPF } from '../utils/validators';

export const Presencas = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [idosos, setIdosos] = useState([]);
  const [filteredIdosos, setFilteredIdosos] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 500); // Debounce de 500ms
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

  useEffect(() => {
    const fetchIdosos = async () => {
      if (!selectedEvento) {
        setIdosos([]);
        setFilteredIdosos([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/presencas/${selectedEvento}/idosos`);
        const fetchedIdosos = data.data?.idosos || [];
        setIdosos(fetchedIdosos);
        setFilteredIdosos(fetchedIdosos);
      } catch (error) {
        toast.error('Erro ao carregar lista de presenças.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdosos();
  }, [selectedEvento]);

  // Filtra os idosos localmente baseado na busca e status
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

  const togglePresenca = (idosoId) => {
    setIdosos((prev) =>
      prev.map((idoso) =>
        idoso.id === idosoId ? { ...idoso, presente: !idoso.presente } : idoso
      )
    );
    // Atualiza também o filteredIdosos para manter a sincronização
    setFilteredIdosos((prev) =>
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
          <>
            {/* Filtros de busca e status */}
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
                <option value="fixo">Fixo</option>
                <option value="espera">Espera</option>
              </select>
            </div>

            <PresencaTable
              idosos={filteredIdosos}
              togglePresenca={togglePresenca}
              onSave={handleSave}
              saving={saving}
            />
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">Selecione um evento para visualizar as presenças.</p>
        )}
      </div>
    </div>
  );
};

