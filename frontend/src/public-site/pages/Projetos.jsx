import { PublicLayout } from '../../components/public/PublicLayout';

export const Projetos = () => {
  const projetos = [
    {
      id: 1,
      title: 'Educação Básica',
      description: 'Projetos educacionais voltados para crianças e adolescentes da comunidade, oferecendo apoio escolar, atividades de reforço e desenvolvimento de habilidades.',
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: 'from-fjpp-blue-DEFAULT to-fjpp-blue-700',
    },
    {
      id: 2,
      title: 'Lazer e Cultura',
      description: 'Atividades recreativas e culturais para promover o bem-estar, a integração social e o desenvolvimento pessoal de todas as idades.',
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-fjpp-green-DEFAULT to-fjpp-green-100',
    },
    {
      id: 3,
      title: 'Ações Sociais',
      description: 'Programas de assistência social e apoio às famílias em situação de vulnerabilidade, oferecendo recursos e orientação necessários.',
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: 'from-fjpp-blue-700 to-fjpp-blue-DEFAULT',
    },
    {
      id: 4,
      title: 'Saúde e Bem-Estar',
      description: 'Iniciativas voltadas para a promoção da saúde física e mental, incluindo atividades físicas, palestras e acompanhamento.',
      icon: (
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: 'from-fjpp-green-100 to-fjpp-green-DEFAULT',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-fjpp-blue-DEFAULT to-fjpp-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Nossos Projetos
          </h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Conheça os projetos que desenvolvemos para transformar vidas e construir um futuro melhor para nossa comunidade.
          </p>
        </div>
      </section>

      {/* Projetos Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projetos.map((projeto) => (
              <div
                key={projeto.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`h-48 bg-gradient-to-br ${projeto.gradient} flex items-center justify-center`}>
                  {projeto.icon}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-4">
                    {projeto.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {projeto.description}
                  </p>
                  <div className="flex items-center text-fjpp-green-DEFAULT font-medium">
                    <span>Saiba mais</span>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-fjpp-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mb-4">
            Quer Participar dos Nossos Projetos?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como você pode fazer parte dessa transformação.
          </p>
          <a
            href="/contato"
            className="inline-block px-8 py-3 bg-fjpp-green-DEFAULT text-white font-semibold rounded-lg hover:bg-fjpp-green-100 transition-colors shadow-lg"
          >
            Entre em Contato
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

