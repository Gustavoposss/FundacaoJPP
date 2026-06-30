import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PublicLayout } from '../../components/public/PublicLayout';
import { api } from '../../services/api';
import { converterUrlYouTubeParaEmbed, obterThumbnailYouTube } from '../../utils/youtubeUtils';
import { formatarMesAnoEvento } from '../../utils/dateUtils';
import { usePageMeta } from '../hooks/usePageMeta';

export const Projetos = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Projetos Sociais – Fundação José Possidônio Peixoto',
    description:
      'Veja os projetos e eventos que realizamos para promover assistência, cultura, lazer e saúde, fortalecendo vínculos e valorizando a pessoa idosa.',
    url: 'https://fundacaojpp.com/projetos',
  });

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/eventos/public');
        const eventosList = data.data?.eventos || [];

        // Garante ordenação por data (mais recente primeiro), com datas nulas ao final
        const eventosOrdenados = [...eventosList].sort((a, b) => {
          if (!a.data_evento) return 1;
          if (!b.data_evento) return -1;
          return new Date(b.data_evento) - new Date(a.data_evento);
        });

        setEventos(eventosOrdenados);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        toast.error('Não foi possível carregar os eventos.');
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  // Formatar data para exibir mês/ano (sem deslocamento de fuso horário)
  const formatarDataEvento = (dataEvento) => formatarMesAnoEvento(dataEvento);

  // Abrir modal com o vídeo do evento
  const openModal = async (evento) => {
    try {
      const { data } = await api.get(`/eventos/public/${evento.id}`);
      const eventoCompleto = data.data?.evento || evento;

      const videoUrlEmbed = converterUrlYouTubeParaEmbed(eventoCompleto.video_url);

      setSelectedEvent({
        ...eventoCompleto,
        videoUrl: videoUrlEmbed,
        ...formatarDataEvento(eventoCompleto.data_evento)
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do evento:', error);
      // Usa dados básicos se falhar
      setSelectedEvent({
        ...evento,
        videoUrl: converterUrlYouTubeParaEmbed(evento.video_url),
        ...formatarDataEvento(evento.data_evento)
      });
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fjpp-blue-DEFAULT mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando eventos...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (eventos.length === 0) {
    return (
      <PublicLayout>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 text-lg">Nenhum evento encontrado.</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Galeria de Eventos */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-fjpp-blue-DEFAULT mb-4">
              Nossos Projetos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os eventos e projetos realizados pela Fundação José Possidônio Peixoto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {eventos.map((evento) => {
              const { mes, ano } = formatarDataEvento(evento.data_evento);
              const thumbnail = obterThumbnailYouTube(evento.video_url);

              return (
                <div
                  key={evento.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group"
                  onClick={() => openModal(evento)}
                >
                  {/* Capa do evento (thumbnail do vídeo) */}
                  <div className="relative h-64 bg-gradient-to-br from-fjpp-blue-DEFAULT to-fjpp-blue-700 overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={evento.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Ícone de play (indica vídeo) */}
                    {evento.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-fjpp-blue-DEFAULT shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    )}

                    {/* Badge de data */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm text-fjpp-blue-DEFAULT text-sm font-bold rounded-full shadow-lg">
                        {mes} {ano}
                      </span>
                    </div>
                  </div>

                  {/* Informações do evento */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-fjpp-blue-DEFAULT mb-2 group-hover:text-fjpp-green-DEFAULT transition-colors">
                      {evento.nome}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {evento.descricao || 'Sem descrição disponível.'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">
                        Clique para ver mais
                      </span>
                      <span className="text-fjpp-green-DEFAULT font-semibold flex items-center text-sm group-hover:gap-2 transition-all">
                        Ver vídeo
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Galeria */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-fjpp-blue-DEFAULT to-fjpp-blue-700 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {selectedEvent.nome}
                </h2>
                <p className="text-gray-200">{selectedEvent.descricao}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-sm rounded-full">
                  {selectedEvent.mes} {selectedEvent.ano}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors p-2"
                aria-label="Fechar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="overflow-y-auto p-6 flex-1">
              {selectedEvent.videoUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={selectedEvent.videoUrl}
                    title={`Vídeo - ${selectedEvent.nome}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum vídeo disponível para este evento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};
