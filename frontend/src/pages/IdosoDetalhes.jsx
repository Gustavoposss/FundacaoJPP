import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { DocumentoUploader } from '../components/DocumentoUploader';
import { PresencaTable } from '../components/PresencaTable';
import { PageHeader } from '../components/PageHeader';
import classNames from 'classnames';
import { cleanCPF } from '../utils/validators';

export const IdosoDetalhes = () => {
  const { id } = useParams();
  const [idoso, setIdoso] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [presencas, setPresencas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [idosoRes, docsRes, eventosRes] = await Promise.all([
          api.get(`/idosos/${id}`),
          api.get(`/documentos/${id}`),
          api.get('/eventos'),
        ]);

        setIdoso(idosoRes.data.data?.idoso);
        setDocumentos(docsRes.data.data?.documentos || []);
        setEventos(eventosRes.data.data?.eventos || []);
      } catch (error) {
        toast.error('Não foi possível carregar os dados do idoso.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchPresencas = async () => {
      if (!selectedEvento) return;
      try {
        const { data } = await api.get(`/presencas/${selectedEvento}`);
        setPresencas(data.data?.presencas?.filter((p) => p.idoso_id === Number(id)) || []);
      } catch (error) {
        toast.error('Erro ao carregar presenças.');
      }
    };

    fetchPresencas();
  }, [selectedEvento, id]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    setUploading(true);
    try {
      const { data } = await api.post(`/documentos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocumentos((prev) => [data.data.documento, ...prev]);
      toast.success('Documento enviado com sucesso.');
    } catch (error) {
      toast.error('Erro ao enviar documento.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocumento = async (documento) => {
    try {
      await api.delete(`/documentos/${documento.id}`);
      setDocumentos((prev) => prev.filter((doc) => doc.id !== documento.id));
      toast.success('Documento removido.');
    } catch (error) {
      toast.error('Erro ao remover documento.');
    }
  };

  if (loading || !idoso) {
    return <Loader />;
  }

  const personalInfo = [
    { label: 'Nome Completo', value: idoso.nome_completo },
    { label: 'Data de Nascimento', value: idoso.data_nascimento ? idoso.data_nascimento.split('T')[0].split('-').reverse().join('/') : '-' },
    { label: 'Sexo', value: idoso.sexo },
    { label: 'Naturalidade', value: idoso.naturalidade },
    { label: 'Telefone', value: idoso.telefone },
    { label: 'Status', value: idoso.status === 'fixo' ? 'Fixo' : 'Espera' },
    { label: 'Endereço', value: idoso.endereco },
    { label: 'Nº', value: idoso.numero },
    { label: 'Bairro', value: idoso.bairro },
    { label: 'Cidade', value: idoso.cidade },
    { label: 'CEP', value: idoso.cep },
    { label: 'CPF', value: idoso.cpf ? cleanCPF(idoso.cpf) : '-' },
    { label: 'RG', value: idoso.rg },
    { label: 'Órgão Expedidor', value: idoso.orgao_expedidor },
    { label: 'Título Eleitoral', value: idoso.titulo_eleitoral },
    { label: 'Zona', value: idoso.zona_eleitoral },
    { label: 'Seção', value: idoso.secao_eleitoral },
    { label: 'Município/UF', value: idoso.municipio_uf },
    { label: 'Data de Inscrição', value: idoso.data_inscricao ? idoso.data_inscricao.split('T')[0].split('-').reverse().join('/') : '-' },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title={idoso.nome_completo}
        subtitle="Detalhes completos do idoso"
        showBack
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Idosos', to: '/idosos' },
          { label: idoso.nome_completo },
        ]}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            {[
              { key: 'info', label: 'Informações pessoais' },
              { key: 'documentos', label: 'Documentos' },
              { key: 'presencas', label: 'Presenças' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-fjpp-blue text-fjpp-blue'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <small className="text-gray-500 text-sm">{item.label}</small>
                  <h6 className="font-semibold mt-1 mb-0 text-gray-900">{item.value || '-'}</h6>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documentos' && (
            <DocumentoUploader
              documentos={documentos}
              onUpload={handleUpload}
              onDelete={handleDeleteDocumento}
              uploading={uploading}
            />
          )}

          {activeTab === 'presencas' && (
            <div>
              <FormSelector
                eventos={eventos}
                selectedEvento={selectedEvento}
                setSelectedEvento={setSelectedEvento}
              />
              <PresencaTable
                idosos={presencas.map((presenca) => ({
                  id: presenca.id,
                  nome_completo: idoso.nome_completo,
                  cpf: presenca.cpf ? cleanCPF(presenca.cpf) : '-',
                  presente: presenca.presente,
                }))}
                togglePresenca={() => {}}
                onSave={() => {}}
                saving={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FormSelector = ({ eventos, selectedEvento, setSelectedEvento }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Selecione um evento</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
      value={selectedEvento}
      onChange={(event) => setSelectedEvento(event.target.value)}
    >
      <option value="">Selecione...</option>
      {eventos.map((evento) => (
        <option value={evento.id} key={evento.id}>
          {evento.nome} - {new Date(evento.data_evento).toLocaleDateString()}
        </option>
      ))}
    </select>
  </div>
);

FormSelector.propTypes = {
  eventos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome: PropTypes.string.isRequired,
      data_evento: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedEvento: PropTypes.string.isRequired,
  setSelectedEvento: PropTypes.func.isRequired,
};

