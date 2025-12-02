import PropTypes from 'prop-types';
import { cleanCPF } from '../utils/validators';

export const PresencaTable = ({ idosos, togglePresenca, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CPF</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Presente</th>
          </tr>
        </thead>
        <tbody>
          {idosos.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                Nenhum idoso encontrado.
              </td>
            </tr>
          ) : (
            idosos.map((idoso) => (
              <tr key={idoso.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">{idoso.nome_completo}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{idoso.cpf ? cleanCPF(idoso.cpf) : '-'}</td>
                <td className="px-4 py-3 text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={idoso.presente || false}
                      onChange={() => togglePresenca(idoso.id)}
                      className="w-5 h-5 text-fjpp-green border-gray-300 rounded focus:ring-fjpp-green focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {idoso.presente ? 'Presente' : 'Ausente'}
                    </span>
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {idosos.length > 0 && (
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar Presenças'}
        </button>
      </div>
    )}
  </div>
);

PresencaTable.propTypes = {
  idosos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome_completo: PropTypes.string.isRequired,
      cpf: PropTypes.string,
      presente: PropTypes.bool,
    })
  ).isRequired,
  togglePresenca: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};

PresencaTable.defaultProps = {
  saving: false,
};

