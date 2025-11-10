import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Download, Filter } from 'react-bootstrap-icons';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';

const tipos = [
  { value: 'presencas', label: 'Presenças' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'idosos', label: 'Idosos' },
];

const ordenacoes = {
  presencas: [
    { value: 'data_desc', label: 'Data (mais recente)' },
    { value: 'data_asc', label: 'Data (mais antiga)' },
    { value: 'nome_asc', label: 'Nome (A-Z)' },
    { value: 'nome_desc', label: 'Nome (Z-A)' },
  ],
  eventos: [
    { value: 'data_desc', label: 'Data (mais recente)' },
    { value: 'data_asc', label: 'Data (mais antiga)' },
    { value: 'nome_asc', label: 'Nome (A-Z)' },
    { value: 'nome_desc', label: 'Nome (Z-A)' },
    { value: 'presentes_desc', label: 'Mais presentes' },
    { value: 'presentes_asc', label: 'Menos presentes' },
  ],
  idosos: [
    { value: 'nome_asc', label: 'Nome (A-Z)' },
    { value: 'nome_desc', label: 'Nome (Z-A)' },
    { value: 'idade_asc', label: 'Idade (menor)' },
    { value: 'idade_desc', label: 'Idade (maior)' },
    { value: 'cadastro_desc', label: 'Cadastro (mais recente)' },
    { value: 'cadastro_asc', label: 'Cadastro (mais antiga)' },
    { value: 'presencas_desc', label: 'Mais presenças' },
    { value: 'presencas_asc', label: 'Menos presenças' },
  ],
};

export const Relatorios = () => {
  const [tipo, setTipo] = useState('presencas');
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });
  const [filtros, setFiltros] = useState({});
  const [ordenar, setOrdenar] = useState('data_desc');
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [idosos, setIdosos] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Carregar idosos e eventos para os filtros
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [idososRes, eventosRes] = await Promise.all([
          api.get('/idosos'),
          api.get('/eventos'),
        ]);
        setIdosos(idososRes.data?.data?.idosos || []);
        setEventos(eventosRes.data?.data?.eventos || []);
      } catch (error) {
        console.error('Erro ao carregar dados para filtros:', error);
        // Se falhar, tentar com estrutura alternativa
        try {
          const [idososRes, eventosRes] = await Promise.all([
            api.get('/idosos'),
            api.get('/eventos'),
          ]);
          setIdosos(idososRes.data?.idosos || idososRes.data || []);
          setEventos(eventosRes.data?.eventos || eventosRes.data || []);
        } catch (err) {
          console.error('Erro ao carregar dados para filtros (tentativa 2):', err);
        }
      }
    };
    carregarDados();
  }, []);

  // Resetar filtros quando mudar o tipo
  useEffect(() => {
    setFiltros({});
    setOrdenar(tipo === 'idosos' ? 'nome_asc' : 'data_desc');
  }, [tipo]);

  const handleGerar = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const params = {
        tipo,
        inicio: periodo.inicio,
        fim: periodo.fim,
        ordenar,
        ...filtros,
      };
      // Remover filtros vazios
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const { data } = await api.get('/relatorios', { params });
      setDados(data.data?.registros || []);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (formato) => {
    try {
      const params = {
        tipo,
        formato,
        inicio: periodo.inicio,
        fim: periodo.fim,
        ordenar,
        ...filtros,
      };
      // Remover filtros vazios
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const { data } = await api.get('/relatorios/export', {
        params,
        responseType: 'blob',
      });
      const blob = new Blob([data], { type: formato === 'pdf' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${tipo}-${Date.now()}.${formato}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar relatório.');
    }
  };

  const handleFiltroChange = (key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  const limparFiltros = () => {
    setFiltros({});
    setPeriodo({ inicio: '', fim: '' });
    setOrdenar(tipo === 'idosos' ? 'nome_asc' : 'data_desc');
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Relatórios"
        subtitle="Gere e exporte relatórios operacionais da fundação"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Relatórios' },
        ]}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de relatório</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              {tipos.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data inicial</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
              value={periodo.inicio}
              onChange={(event) => setPeriodo((prev) => ({ ...prev, inicio: event.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data final</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
              value={periodo.fim}
              onChange={(event) => setPeriodo((prev) => ({ ...prev, fim: event.target.value }))}
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filtros
            </button>
            <button
              type="button"
              onClick={handleGerar}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {mostrarFiltros && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {tipo === 'presencas' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idoso</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      value={filtros.idoso_id || ''}
                      onChange={(e) => handleFiltroChange('idoso_id', e.target.value)}
                    >
                      <option value="">Todos</option>
                      {idosos.map((idoso) => (
                        <option key={idoso.id} value={idoso.id}>
                          {idoso.nome_completo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      value={filtros.evento_id || ''}
                      onChange={(e) => handleFiltroChange('evento_id', e.target.value)}
                    >
                      <option value="">Todos</option>
                      {eventos.map((evento) => (
                        <option key={evento.id} value={evento.id}>
                          {evento.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      value={filtros.presente || ''}
                      onChange={(e) => handleFiltroChange('presente', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="true">Presente</option>
                      <option value="false">Ausente</option>
                    </select>
                  </div>
                </>
              )}

              {tipo === 'eventos' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do evento</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Buscar por nome..."
                      value={filtros.nome || ''}
                      onChange={(e) => handleFiltroChange('nome', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Buscar por local..."
                      value={filtros.local || ''}
                      onChange={(e) => handleFiltroChange('local', e.target.value)}
                    />
                  </div>
                </>
              )}

              {tipo === 'idosos' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Buscar por nome..."
                      value={filtros.nome || ''}
                      onChange={(e) => handleFiltroChange('nome', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Buscar por CPF..."
                      value={filtros.cpf || ''}
                      onChange={(e) => handleFiltroChange('cpf', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      value={filtros.sexo || ''}
                      onChange={(e) => handleFiltroChange('sexo', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade mínima</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Ex: 60"
                      value={filtros.idade_min || ''}
                      onChange={(e) => handleFiltroChange('idade_min', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade máxima</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                      placeholder="Ex: 80"
                      value={filtros.idade_max || ''}
                      onChange={(e) => handleFiltroChange('idade_max', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value)}
                >
                  {ordenacoes[tipo]?.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={limparFiltros}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-fjpp-blue bg-white border border-fjpp-blue rounded-lg hover:bg-fjpp-blue hover:text-white transition-colors"
          >
            <Download size={18} />
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
              </tr>
            </thead>
            <tbody>
              {dados.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    Nenhum dado encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                dados.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.titulo}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.descricao}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
