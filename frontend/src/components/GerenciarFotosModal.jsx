import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Plus, Trash } from 'react-bootstrap-icons';
import { api } from '../services/api';
import PropTypes from 'prop-types';

export const GerenciarFotosModal = ({ evento, onClose }) => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novaFoto, setNovaFoto] = useState({ foto_url: '', alt_text: '', ordem_exibicao: 0 });
  const [adicionando, setAdicionando] = useState(false);
  const [removendo, setRemovendo] = useState(null);

  useEffect(() => {
    carregarFotos();
  }, [evento.id]);

  const carregarFotos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/eventos/${evento.id}/fotos`);
      setFotos(data.data?.fotos || []);
    } catch (error) {
      toast.error('Erro ao carregar fotos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarFoto = async (e) => {
    e.preventDefault();
    if (!novaFoto.foto_url.trim()) {
      toast.error('URL da foto é obrigatória.');
      return;
    }

    setAdicionando(true);
    try {
      await api.post(`/eventos/${evento.id}/fotos`, novaFoto);
      toast.success('Foto adicionada com sucesso.');
      setNovaFoto({ foto_url: '', alt_text: '', ordem_exibicao: fotos.length });
      carregarFotos();
    } catch (error) {
      toast.error('Erro ao adicionar foto.');
    } finally {
      setAdicionando(false);
    }
  };

  const handleRemoverFoto = async (fotoId) => {
    if (!window.confirm('Tem certeza que deseja remover esta foto?')) return;

    setRemovendo(fotoId);
    try {
      await api.delete(`/eventos/${evento.id}/fotos/${fotoId}`);
      toast.success('Foto removida com sucesso.');
      carregarFotos();
    } catch (error) {
      toast.error('Erro ao remover foto.');
    } finally {
      setRemovendo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gerenciar Fotos - {evento.nome}</h3>
            <p className="text-sm text-gray-500 mt-1">Adicione ou remova fotos da galeria do evento</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Formulário para adicionar foto */}
          <form onSubmit={handleAdicionarFoto} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Adicionar Nova Foto</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL da Foto <span className="text-fjpp-red">*</span>
                </label>
                <input
                  type="url"
                  value={novaFoto.foto_url}
                  onChange={(e) => setNovaFoto({ ...novaFoto, foto_url: e.target.value })}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Texto Alternativo</label>
                <input
                  type="text"
                  value={novaFoto.alt_text}
                  onChange={(e) => setNovaFoto({ ...novaFoto, alt_text: e.target.value })}
                  placeholder="Descrição da foto"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={adicionando}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Plus size={16} />
              {adicionando ? 'Adicionando...' : 'Adicionar Foto'}
            </button>
          </form>

          {/* Lista de fotos */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando fotos...</p>
            </div>
          ) : fotos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma foto cadastrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotos.map((foto) => (
                <div key={foto.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={foto.foto_url}
                      alt={foto.alt_text || 'Foto do evento'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoverFoto(foto.id)}
                    disabled={removendo === foto.id}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    title="Remover foto"
                  >
                    <Trash size={14} />
                  </button>
                  {foto.alt_text && (
                    <p className="mt-2 text-xs text-gray-600 truncate">{foto.alt_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

GerenciarFotosModal.propTypes = {
  evento: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

