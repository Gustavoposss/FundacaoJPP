import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PublicLayout } from '../../components/public/PublicLayout';
import { api } from '../../services/api';

export const Sobre = () => {
  // URLs diretas do Supabase Storage
  const backgroundImage = 'https://rogljnlbatesppkmlkey.supabase.co/storage/v1/object/public/backgrounds/backgroundpaginasobre.jpeg';
  
  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);
  const [loadingPatrocinadores, setLoadingPatrocinadores] = useState(true);
  const [activeSponsor, setActiveSponsor] = useState(0);

  // Carregar membros da equipe
  useEffect(() => {
    const carregarEquipe = async () => {
      try {
        setLoadingEquipe(true);
        const { data } = await api.get('/membros-equipe/public');
        setMembrosEquipe(data.data?.membros || []);
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
        toast.error('Não foi possível carregar a equipe.');
        setMembrosEquipe([]);
      } finally {
        setLoadingEquipe(false);
      }
    };

    carregarEquipe();
  }, []);

  // Carregar patrocinadores
  useEffect(() => {
    const carregarPatrocinadores = async () => {
      try {
        setLoadingPatrocinadores(true);
        const { data } = await api.get('/patrocinadores/public');
        setPatrocinadores(data.data?.patrocinadores || []);
      } catch (error) {
        console.error('Erro ao carregar patrocinadores:', error);
        toast.error('Não foi possível carregar os patrocinadores.');
        setPatrocinadores([]);
      } finally {
        setLoadingPatrocinadores(false);
      }
    };

    carregarPatrocinadores();
  }, []);

  // Autoplay do carrossel de patrocinadores (4 segundos)
  useEffect(() => {
    if (patrocinadores.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSponsor((prev) => (prev + 1) % patrocinadores.length);
    }, 4000); // 4 segundos

    return () => clearInterval(interval);
  }, [patrocinadores.length]);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24 overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
        }}
      >
        {/* Overlay escuro para garantir legibilidade do texto */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 drop-shadow-lg">
            Nossa Jornada de Acolhimento e Esperança
          </h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto drop-shadow-md">
            Conheça a história da Fundação José Possidônio Peixoto e nossa missão de transformar vidas através do cuidado e da solidariedade.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mb-8 text-center">
              Nossa História
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                A Fundação José Possidônio Peixoto nasceu do desejo de fazer a diferença na vida de idosos e suas famílias. 
                Fundada com o propósito de oferecer acolhimento, cuidado e oportunidades, nossa organização tem se dedicado 
                a criar um ambiente onde cada pessoa se sinta valorizada e respeitada.
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Ao longo dos anos, desenvolvemos projetos que vão além da assistência básica, promovendo educação, cultura, 
                lazer e bem-estar. Acreditamos que cada pessoa, independentemente da idade, tem o direito de viver com dignidade 
                e ter acesso a oportunidades que enriqueçam sua vida.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Nossa trajetória é marcada pelo compromisso com a comunidade de Caucaia e região, sempre buscando formas 
                inovadoras de atender às necessidades daqueles que mais precisam. Cada projeto, cada ação, cada sorriso 
                conquistado é uma vitória que nos motiva a continuar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-fjpp-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Missão */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-fjpp-blue-DEFAULT rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-4">
                Missão
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Promover o bem-estar, a dignidade e a qualidade de vida de idosos e suas famílias através de ações sociais, 
                educacionais e culturais, sempre com respeito, amor e compromisso.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-fjpp-green-DEFAULT rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-4">
                Visão
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ser referência em ações sociais e de cuidado com idosos, reconhecida pela excelência, inovação e impacto 
                positivo na comunidade, transformando vidas e construindo um futuro melhor para todos.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-fjpp-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
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
              <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT mb-4">
                Valores
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Respeito, dignidade, solidariedade, transparência, compromisso e amor ao próximo. Acreditamos que esses 
                valores são a base para construir uma sociedade mais justa e acolhedora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mb-4">
              Nossa Equipe e Voluntários
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Somos movidos por pessoas dedicadas que compartilham a mesma paixão por fazer a diferença.
            </p>
          </div>

          {loadingEquipe ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fjpp-blue-DEFAULT mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando equipe...</p>
              </div>
            </div>
          ) : membrosEquipe.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum membro da equipe encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
              {membrosEquipe.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-fjpp-blue-DEFAULT bg-white">
                    <img
                      src={member.foto_url}
                      alt={`Foto de perfil de ${member.nome_completo}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = '#e5e7eb';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-fjpp-blue-DEFAULT mb-1 text-lg">
                    {member.nome_completo}
                  </h3>
                  <p className="font-medium text-fjpp-blue-700 mb-1">
                    {member.cargo}
                  </p>
                  {member.role && (
                    <p className="text-sm text-gray-600">{member.role}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nossos Parceiros */}
      <section className="py-16 bg-fjpp-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-wide text-fjpp-blue-700 font-semibold">
              Nossos Parceiros
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-fjpp-blue-DEFAULT mt-2 mb-3">
              Lista de Patrocinadores
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Agradecemos imensamente o apoio dos nossos patrocinadores. Graças a eles, podemos continuar a nossa missão.
            </p>
          </div>

          {loadingPatrocinadores ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fjpp-blue-DEFAULT mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando patrocinadores...</p>
              </div>
            </div>
          ) : patrocinadores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum patrocinador encontrado.</p>
            </div>
          ) : (
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeSponsor * 100}%)` }}
                >
                  {patrocinadores.map((sponsor) => (
                    <div key={sponsor.id} className="w-full flex-shrink-0 px-8 py-10">
                      <div className="flex flex-col items-center gap-6">
                        {sponsor.logo_url && (
                          <div className="w-44 h-44 rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
                            <img
                              src={sponsor.logo_url}
                              alt={`Logo de ${sponsor.nome}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.style.backgroundColor = '#e5e7eb';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-fjpp-blue-DEFAULT">{sponsor.nome}</h3>
                          {sponsor.titulo && <p className="text-fjpp-blue-700 font-medium">{sponsor.titulo}</p>}
                          {sponsor.link_website && (
                            <a
                              href={sponsor.link_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-fjpp-green-DEFAULT hover:underline text-sm mt-2 inline-block"
                            >
                              Visitar site
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {patrocinadores.length > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSponsor((prev) => (prev - 1 + patrocinadores.length) % patrocinadores.length);
                    }}
                    className="p-3 rounded-full bg-white shadow border border-gray-200 text-fjpp-blue-DEFAULT hover:bg-fjpp-light transition"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <div className="flex items-center gap-2">
                    {patrocinadores.map((sponsor, index) => (
                      <span
                        key={sponsor.id}
                        className={`h-2 w-2 rounded-full transition ${
                          index === activeSponsor ? 'bg-fjpp-blue-DEFAULT w-6' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSponsor((prev) => (prev + 1) % patrocinadores.length);
                    }}
                    className="p-3 rounded-full bg-white shadow border border-gray-200 text-fjpp-blue-DEFAULT hover:bg-fjpp-light transition"
                    aria-label="Próximo"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

