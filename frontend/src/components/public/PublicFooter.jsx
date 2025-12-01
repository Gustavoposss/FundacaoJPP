import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-fjpp-blue-DEFAULT text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold mb-4">Fundação JPP</h3>
            <p className="text-sm text-gray-300 mb-4">
              Cuidando de quem cuidou de nós. Trabalhamos para melhorar a qualidade de vida dos idosos e suas famílias.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/projetos"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Projetos
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <span className="font-medium">Endereço:</span>
                <br />
                Rua Ubajara, 2200 — Caucaia
              </li>
              <li>
                <span className="font-medium">Telefone:</span>
                <br />
                <a
                  href="tel:+5585988313126"
                  className="hover:text-white transition-colors"
                >
                  (85) 98831-3126
                </a>
              </li>
              <li>
                <span className="font-medium">Horário:</span>
                <br />
                Reuniões mensais às 16:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-fjpp-blue-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>
            © {currentYear} Fundação José Possidônio Peixoto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

