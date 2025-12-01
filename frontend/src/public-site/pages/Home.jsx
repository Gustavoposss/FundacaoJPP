import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/public/PublicLayout';

export const Home = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section 
        className="relative text-white py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: 'url(/idososimagemdefundohome.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay escuro para garantir legibilidade do texto */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Cuidando de quem cuidou de nós
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
              A Fundação José Possidônio Peixoto trabalha para melhorar a qualidade de vida dos idosos e suas famílias através de projetos sociais, culturais e de bem-estar.
            </p>
            <Link
              to="/sobre"
              className="inline-block px-8 py-3 bg-fjpp-green-DEFAULT text-white font-semibold rounded-lg hover:bg-fjpp-green-100 transition-colors shadow-lg"
            >
              Conhecer a Fundação
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mb-4">
              Sobre a Fundação
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça nossa missão, valores e o trabalho que desenvolvemos em prol da comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-fjpp-light hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-fjpp-blue-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                Compromisso
              </h3>
              <p className="text-gray-600">
                Nosso compromisso é com o bem-estar e a dignidade de cada pessoa que atendemos.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-fjpp-light hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-fjpp-green-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                Inovação
              </h3>
              <p className="text-gray-600">
                Buscamos sempre novas formas de melhorar nossos serviços e impactar positivamente a comunidade.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-fjpp-light hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-fjpp-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                Comunidade
              </h3>
              <p className="text-gray-600">
                Construímos uma rede de apoio e solidariedade que transforma vidas todos os dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos Section */}
      <section className="py-16 bg-fjpp-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mb-4">
              Nossos Projetos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça os projetos que desenvolvemos para melhorar a qualidade de vida da nossa comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-fjpp-blue-DEFAULT to-fjpp-blue-700 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white opacity-80"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                  Educação Básica
                </h3>
                <p className="text-gray-600 mb-4">
                  Projetos educacionais voltados para crianças e adolescentes da comunidade.
                </p>
                <Link
                  to="/projetos"
                  className="text-fjpp-green-DEFAULT font-medium hover:underline"
                >
                  Saiba mais →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-fjpp-green-DEFAULT to-fjpp-green-100 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white opacity-80"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                  Lazer e Cultura
                </h3>
                <p className="text-gray-600 mb-4">
                  Atividades recreativas e culturais para promover o bem-estar e a integração social.
                </p>
                <Link
                  to="/projetos"
                  className="text-fjpp-green-DEFAULT font-medium hover:underline"
                >
                  Saiba mais →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-fjpp-blue-700 to-fjpp-blue-DEFAULT flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white opacity-80"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT mb-2">
                  Ações Sociais
                </h3>
                <p className="text-gray-600 mb-4">
                  Programas de assistência social e apoio às famílias em situação de vulnerabilidade.
                </p>
                <Link
                  to="/projetos"
                  className="text-fjpp-green-DEFAULT font-medium hover:underline"
                >
                  Saiba mais →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/projetos"
              className="inline-block px-8 py-3 bg-fjpp-blue-DEFAULT text-white font-semibold rounded-lg hover:bg-fjpp-blue-700 transition-colors"
            >
              Ver Todos os Projetos
            </Link>
          </div>
        </div>
      </section>

      {/* Informações da Reunião Mensal */}
      <section className="py-16 bg-fjpp-blue-DEFAULT text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Nossos Próximos Eventos
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-fjpp-green-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Local</h3>
                  <p className="text-gray-200">Rua Ubajara, 2200 — Caucaia</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-fjpp-green-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Horário</h3>
                  <p className="text-gray-200">16:00</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-fjpp-green-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Contato</h3>
                  <a
                    href="tel:+5585988313126"
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    (85) 98831-3126
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

