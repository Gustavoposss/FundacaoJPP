import { useState } from 'react';
import { PublicLayout } from '../../components/public/PublicLayout';

export const Projetos = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Galeria de eventos realizados
  const eventos = [
    {
      id: 1,
      nome: 'Novembro Azul',
      descricao: 'Campanha de conscientização sobre a saúde do homem e prevenção do câncer de próstata',
      mes: 'Novembro',
      ano: '2024',
      videoUrl: 'https://www.youtube.com/embed/a6KqnthgnMU?start=198',
      fotos: [
        { 
          id: 1, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23%20(1).jpeg', 
          alt: 'Evento Novembro Azul 1' 
        },
        { 
          id: 2, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.23.jpeg', 
          alt: 'Evento Novembro Azul 2' 
        },
        { 
          id: 3, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.27.jpeg', 
          alt: 'Evento Novembro Azul 3' 
        },
        { 
          id: 4, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.28.jpeg', 
          alt: 'Evento Novembro Azul 4' 
        },
        { 
          id: 5, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.29.jpeg', 
          alt: 'Evento Novembro Azul 5' 
        },
        { 
          id: 6, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.51.44.jpeg', 
          alt: 'Evento Novembro Azul 6' 
        },
        { 
          id: 7, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.35.jpeg', 
          alt: 'Evento Novembro Azul 7' 
        },
        { 
          id: 8, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.36.jpeg', 
          alt: 'Evento Novembro Azul 8' 
        },
        { 
          id: 9, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.37%20(1).jpeg', 
          alt: 'Evento Novembro Azul 9' 
        },
        { 
          id: 10, 
          url: 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/projetos/NovembroAzul/WhatsApp%20Image%202025-11-26%20at%2019.53.37.jpeg', 
          alt: 'Evento Novembro Azul 10' 
        },
      ],
      cor: 'blue',
    },
  ];

  const openModal = (evento) => {
    setSelectedEvent(evento);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <PublicLayout>
      {/* Galeria de Eventos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer max-w-2xl mx-auto"
              onClick={() => openModal(evento)}
            >
              {/* Imagem de capa do evento */}
              <div className="relative h-64 bg-gradient-to-br from-fjpp-blue-DEFAULT to-fjpp-blue-700 overflow-hidden">
                {evento.fotos && evento.fotos.length > 0 ? (
                  <img
                    src={evento.fotos[0].url}
                    alt={evento.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback para gradiente se a imagem não carregar
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-white/90 text-fjpp-blue-DEFAULT text-sm font-semibold rounded-full">
                    {evento.mes} {evento.ano}
                  </span>
                </div>
              </div>
              
              {/* Informações do evento */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-2">
                  {evento.nome}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {evento.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {evento.fotos.length} {evento.fotos.length === 1 ? 'foto' : 'fotos'}
                  </span>
                  <span className="text-fjpp-green-DEFAULT font-medium flex items-center">
                    Ver galeria
                    <svg
                      className="w-5 h-5 ml-2"
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
          ))}
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
              {selectedEvent.fotos && selectedEvent.fotos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-fjpp-blue-DEFAULT mb-4">
                    Galeria de Fotos
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
              )}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};
