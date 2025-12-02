import { useState } from 'react';
import { PublicLayout } from '../../components/public/PublicLayout';

export const Projetos = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Galeria de eventos realizados
  const eventos = [
    {
      id: 1,
      nome: 'Outubro Rosa',
      descricao: 'Campanha de conscientização sobre a prevenção do câncer de mama',
      mes: 'Outubro',
      ano: '2024',
      fotos: [
        // Placeholder para fotos - você pode substituir por URLs reais
        { id: 1, url: '/placeholder-outubro-rosa-1.jpg', alt: 'Evento Outubro Rosa 1' },
        { id: 2, url: '/placeholder-outubro-rosa-2.jpg', alt: 'Evento Outubro Rosa 2' },
        { id: 3, url: '/placeholder-outubro-rosa-3.jpg', alt: 'Evento Outubro Rosa 3' },
        { id: 4, url: '/placeholder-outubro-rosa-4.jpg', alt: 'Evento Outubro Rosa 4' },
        { id: 5, url: '/placeholder-outubro-rosa-5.jpg', alt: 'Evento Outubro Rosa 5' },
        { id: 6, url: '/placeholder-outubro-rosa-6.jpg', alt: 'Evento Outubro Rosa 6' },
      ],
      cor: 'pink',
    },
    {
      id: 2,
      nome: 'Novembro Azul',
      descricao: 'Campanha de conscientização sobre a saúde do homem e prevenção do câncer de próstata',
      mes: 'Novembro',
      ano: '2024',
      fotos: [
        { id: 1, url: '/placeholder-novembro-azul-1.jpg', alt: 'Evento Novembro Azul 1' },
        { id: 2, url: '/placeholder-novembro-azul-2.jpg', alt: 'Evento Novembro Azul 2' },
        { id: 3, url: '/placeholder-novembro-azul-3.jpg', alt: 'Evento Novembro Azul 3' },
        { id: 4, url: '/placeholder-novembro-azul-4.jpg', alt: 'Evento Novembro Azul 4' },
        { id: 5, url: '/placeholder-novembro-azul-5.jpg', alt: 'Evento Novembro Azul 5' },
        { id: 6, url: '/placeholder-novembro-azul-6.jpg', alt: 'Evento Novembro Azul 6' },
      ],
      cor: 'blue',
    },
    {
      id: 3,
      nome: 'Janeiro Branco',
      descricao: 'Campanha de conscientização sobre a saúde mental',
      mes: 'Janeiro',
      ano: '2024',
      fotos: [
        { id: 1, url: '/placeholder-janeiro-branco-1.jpg', alt: 'Evento Janeiro Branco 1' },
        { id: 2, url: '/placeholder-janeiro-branco-2.jpg', alt: 'Evento Janeiro Branco 2' },
        { id: 3, url: '/placeholder-janeiro-branco-3.jpg', alt: 'Evento Janeiro Branco 3' },
        { id: 4, url: '/placeholder-janeiro-branco-4.jpg', alt: 'Evento Janeiro Branco 4' },
      ],
      cor: 'white',
    },
    {
      id: 4,
      nome: 'Setembro Amarelo',
      descricao: 'Campanha de prevenção ao suicídio e valorização da vida',
      mes: 'Setembro',
      ano: '2024',
      fotos: [
        { id: 1, url: '/placeholder-setembro-amarelo-1.jpg', alt: 'Evento Setembro Amarelo 1' },
        { id: 2, url: '/placeholder-setembro-amarelo-2.jpg', alt: 'Evento Setembro Amarelo 2' },
        { id: 3, url: '/placeholder-setembro-amarelo-3.jpg', alt: 'Evento Setembro Amarelo 3' },
        { id: 4, url: '/placeholder-setembro-amarelo-4.jpg', alt: 'Evento Setembro Amarelo 4' },
        { id: 5, url: '/placeholder-setembro-amarelo-5.jpg', alt: 'Evento Setembro Amarelo 5' },
      ],
      cor: 'yellow',
    },
    {
      id: 5,
      nome: 'Dia do Idoso',
      descricao: 'Celebração especial em homenagem aos idosos da comunidade',
      mes: 'Outubro',
      ano: '2024',
      fotos: [
        { id: 1, url: '/placeholder-dia-idoso-1.jpg', alt: 'Dia do Idoso 1' },
        { id: 2, url: '/placeholder-dia-idoso-2.jpg', alt: 'Dia do Idoso 2' },
        { id: 3, url: '/placeholder-dia-idoso-3.jpg', alt: 'Dia do Idoso 3' },
        { id: 4, url: '/placeholder-dia-idoso-4.jpg', alt: 'Dia do Idoso 4' },
        { id: 5, url: '/placeholder-dia-idoso-5.jpg', alt: 'Dia do Idoso 5' },
        { id: 6, url: '/placeholder-dia-idoso-6.jpg', alt: 'Dia do Idoso 6' },
        { id: 7, url: '/placeholder-dia-idoso-7.jpg', alt: 'Dia do Idoso 7' },
        { id: 8, url: '/placeholder-dia-idoso-8.jpg', alt: 'Dia do Idoso 8' },
      ],
      cor: 'purple',
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-fjpp-blue-DEFAULT to-fjpp-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Galeria de Eventos
          </h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Confira os eventos realizados pela Fundação José Possidônio Peixoto
          </p>
        </div>
      </section>

      {/* Galeria de Eventos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
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

            {/* Grid de Fotos */}
            <div className="overflow-y-auto p-6 flex-1">
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
          </div>
        </div>
      )}
    </PublicLayout>
  );
};
