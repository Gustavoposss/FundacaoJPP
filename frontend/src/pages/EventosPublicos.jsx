import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash, X, Image as ImageIcon } from 'react-bootstrap-icons';
import { api } from '../services/api';
import { Loader } from '../components/Loader';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageHeader } from '../components/PageHeader';
import { EventoPublicoForm } from '../components/EventoPublicoForm';
import { GerenciarFotosModal } from '../components/GerenciarFotosModal';
import { converterUrlYouTubeParaEmbed } from '../utils/youtubeUtils';

const emptyEvento = { 
  nome: '', 
  data_evento: '', 
  local: '', 
  descricao: '',
  video_url: '',
  cor_tema: 'blue',
  exibir_publico: true
};

export const EventosPublicos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFotosModal, setShowFotosModal] = useState(false);
  const [current, setCurrent] = useState(emptyEvento);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
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
      // Converter URL do YouTube para formato embed antes de salvar
      const eventoParaSalvar = { ...current };
      
      // Garantir que a data seja enviada no formato YYYY-MM-DD sem timezone
      // O input type="date" já retorna YYYY-MM-DD, mas vamos garantir
      if (eventoParaSalvar.data_evento) {
        if (typeof eventoParaSalvar.data_evento === 'string') {
          // Se contém 'T' (formato ISO), extrair apenas a data
          if (eventoParaSalvar.data_evento.includes('T')) {
            eventoParaSalvar.data_evento = eventoParaSalvar.data_evento.split('T')[0];
          }
          // Se já está no formato YYYY-MM-DD, manter
          // Caso contrário, tentar converter
          if (!eventoParaSalvar.data_evento.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const date = new Date(eventoParaSalvar.data_evento);
            if (!isNaN(date.getTime())) {
              // Usar componentes locais para evitar problemas de timezone
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              eventoParaSalvar.data_evento = `${year}-${month}-${day}`;
            }
          }
        }
      }
      
      if (eventoParaSalvar.video_url) {
        const urlEmbed = converterUrlYouTubeParaEmbed(eventoParaSalvar.video_url);
        if (urlEmbed) {
          eventoParaSalvar.video_url = urlEmbed;
        } else if (!eventoParaSalvar.video_url.includes('youtube.com/embed/')) {
          // Se não conseguir converter e não estiver no formato embed, avisar o usuário
          toast.warning('URL do YouTube pode estar em formato incorreto. Verifique se é uma URL válida.');
        }
      }
      
      if (current.id) {
        await api.put(`/eventos/${current.id}`, eventoParaSalvar);
        toast.success('Evento atualizado com sucesso.');
      } else {
        await api.post('/eventos', eventoParaSalvar);
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

  const handleGerenciarFotos = (evento) => {
    setEventoSelecionado(evento);
    setShowFotosModal(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Eventos Públicos"
        subtitle="Gerencie eventos que aparecem no site público"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Eventos Públicos' },
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Local
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
              {eventos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              ) : (
                eventos.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{evento.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {evento.data_evento ? new Date(evento.data_evento).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{evento.local || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          evento.exibir_publico
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {evento.exibir_publico ? 'Público' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGerenciarFotos(evento)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Gerenciar Fotos"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Formatar data para o formato YYYY-MM-DD (sem timezone)
                            // Se a data vier como string ISO (com T e timezone), extrair apenas YYYY-MM-DD
                            let dataFormatada = '';
                            if (evento.data_evento) {
                              if (typeof evento.data_evento === 'string' && evento.data_evento.includes('T')) {
                                // Extrair apenas a parte da data (YYYY-MM-DD)
                                dataFormatada = evento.data_evento.split('T')[0];
                              } else if (typeof evento.data_evento === 'string' && evento.data_evento.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                // Já está no formato correto
                                dataFormatada = evento.data_evento;
                              } else {
                                // Tentar converter usando data local para evitar problemas de timezone
                                const date = new Date(evento.data_evento);
                                if (!isNaN(date.getTime())) {
                                  const year = date.getFullYear();
                                  const month = String(date.getMonth() + 1).padStart(2, '0');
                                  const day = String(date.getDate()).padStart(2, '0');
                                  dataFormatada = `${year}-${month}-${day}`;
                                }
                              }
                            }
                            
                            const eventoFormatado = {
                              ...evento,
                              data_evento: dataFormatada
                            };
                            setCurrent(eventoFormatado);
                            setShowModal(true);
                          }}
                          className="p-2 text-fjpp-blue hover:bg-fjpp-light rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoving(evento)}
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

      {/* Modal de Evento */}
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
              <EventoPublicoForm
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

      {/* Modal de Fotos */}
      {showFotosModal && eventoSelecionado && (
        <GerenciarFotosModal
          evento={eventoSelecionado}
          onClose={() => {
            setShowFotosModal(false);
            setEventoSelecionado(null);
            loadEventos();
          }}
        />
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

