import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PublicLayout } from '../../components/public/PublicLayout';
import { api } from '../../services/api';

export const Projetos = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/eventos/public');
        const eventosList = data.data?.eventos || [];
        
        // Carregar primeira foto de cada evento para usar como capa
        const eventosComFotos = await Promise.all(
          eventosList.map(async (evento) => {
            try {
              const fotosData = await api.get(`/eventos/public/${evento.id}/fotos`);
              const fotos = fotosData.data?.data?.fotos || [];
              return {
                ...evento,
                primeiraFoto: fotos.length > 0 ? fotos[0].foto_url : null,
                totalFotos: fotos.length
              };
            } catch (error) {
              // Se falhar ao carregar fotos, continua sem foto
              return {
                ...evento,
                primeiraFoto: null,
                totalFotos: 0
              };
            }
          })
        );
        
        setEventos(eventosComFotos);
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

  // Formatar data para exibir mês/ano
  const formatarDataEvento = (dataEvento) => {
    if (!dataEvento) return { mes: '', ano: '' };
    const date = new Date(dataEvento);
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return {
      mes: meses[date.getMonth()],
      ano: date.getFullYear().toString()
    };
  };

  // Buscar evento completo com fotos quando abrir modal
  const openModal = async (evento) => {
    try {
      const { data } = await api.get(`/eventos/public/${evento.id}`);
      const eventoCompleto = data.data?.evento || evento;
      
      // Formatar fotos para o formato esperado pelo componente
      const fotosFormatadas = eventoCompleto.fotos?.map(foto => ({
        id: foto.id,
        url: foto.foto_url,
        alt: foto.alt_text || `Foto do evento ${eventoCompleto.nome}`
      })) || [];
      
      setSelectedEvent({
        ...eventoCompleto,
        fotos: fotosFormatadas,
        videoUrl: eventoCompleto.video_url,
        ...formatarDataEvento(eventoCompleto.data_evento)
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do evento:', error);
      // Usa dados básicos se falhar
      setSelectedEvent({
        ...evento,
        ...formatarDataEvento(evento.data_evento),
        fotos: []
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
              
              return (
                <div
                  key={evento.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group"
                  onClick={() => openModal(evento)}
                >
                  {/* Imagem de capa do evento */}
                  <div className="relative h-64 bg-gradient-to-br from-fjpp-blue-DEFAULT to-fjpp-blue-700 overflow-hidden">
                    {evento.primeiraFoto ? (
                      <img
                        src={evento.primeiraFoto}
                        alt={evento.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Badge de data */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm text-fjpp-blue-DEFAULT text-sm font-bold rounded-full shadow-lg">
                        {mes} {ano}
                      </span>
                    </div>

                    {/* Badge de quantidade de fotos */}
                    {evento.totalFotos > 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {evento.totalFotos}
                        </span>
                      </div>
                    )}
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
                        Ver galeria
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
              {/* Vídeo do YouTube (se existir) */}
              {selectedEvent.videoUrl && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-fjpp-blue-DEFAULT mb-4">
                    Vídeo do Evento
                  </h3>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={selectedEvent.videoUrl}
                      title={`Vídeo - ${selectedEvent.nome}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Grid de Fotos */}
              {selectedEvent.fotos && selectedEvent.fotos.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-fjpp-blue-DEFAULT mb-4">
                    Galeria de Fotos ({selectedEvent.fotos.length} {selectedEvent.fotos.length === 1 ? 'foto' : 'fotos'})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEvent.fotos.map((foto) => (
                      <div
                        key={foto.id}
                        className="relative group cursor-pointer overflow-hidden rounded-lg"
                      >
                        <img
                          src={foto.url}
                          alt={foto.alt}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            // Placeholder quando a imagem não carrega
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EFoto em breve%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma foto disponível para este evento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};
