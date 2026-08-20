import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/public/PublicLayout';
import { usePageMeta } from '../hooks/usePageMeta';

export const Home = () => {
  usePageMeta({
    title: 'Fundação José Possidônio Peixoto',
    description:
      'Promovemos bem-estar, dignidade e qualidade de vida de idosos e suas famílias por meio de ações sociais, educacionais e culturais em Caucaia.',
    url: 'https://fundacaojpp.com/',
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section 
        className="relative text-white py-24 md:py-40 overflow-hidden"
        style={{
          backgroundImage: 'url(https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/backgrounds/backgroundpaginahome.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay com gradiente melhorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/45 to-black/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-2xl animate-fade-in leading-tight">
              Cuidando de quem cuidou de nós
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/95 drop-shadow-lg leading-relaxed animate-slide-in max-w-3xl mx-auto">
              A Fundação José Possidônio Peixoto trabalha para melhorar a qualidade de vida dos idosos e suas famílias através de projetos sociais, culturais e de bem-estar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 px-8 py-4 bg-fjpp-green-DEFAULT text-white font-bold rounded-2xl hover:bg-fjpp-green-600 transition-all shadow-elevated hover:shadow-button transform hover:-translate-y-1 animate-scale-in"
              >
                Conhecer a Fundação
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/projetos"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 animate-scale-in"
                style={{ animationDelay: '100ms' }}
              >
                Nossos Projetos
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="py-20 bg-gradient-to-b from-white to-fjpp-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-fjpp-blue-DEFAULT mb-6 leading-tight">
              Sobre a Fundação
            </h2>
            <p className="text-lg md:text-xl text-fjpp-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conheça nossa missão, valores e o trabalho que desenvolvemos em prol da comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-elevated transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-br from-fjpp-blue-400 to-fjpp-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-3 group-hover:text-fjpp-blue-600 transition-colors">
                Compromisso
              </h3>
              <p className="text-fjpp-gray-600 leading-relaxed">
                Nosso compromisso é com o bem-estar e a dignidade de cada pessoa que atendemos.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-elevated transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-fjpp-green-400 to-fjpp-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-3 group-hover:text-fjpp-green-600 transition-colors">
                Inovação
              </h3>
              <p className="text-fjpp-gray-600 leading-relaxed">
                Buscamos sempre novas formas de melhorar nossos serviços e impactar positivamente a comunidade.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-elevated transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-fjpp-blue-500 to-fjpp-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-card group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-3 group-hover:text-fjpp-blue-600 transition-colors">
                Comunidade
              </h3>
              <p className="text-fjpp-gray-600 leading-relaxed">
                Construímos uma rede de apoio e solidariedade que transforma vidas todos os dias.
              </p>
            </div>
          </div>
        </div>
      </section>


    </PublicLayout>
  );
};

