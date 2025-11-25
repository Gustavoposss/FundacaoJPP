import PropTypes from 'prop-types';

const fields = [
  { name: 'nome_completo', label: 'Nome completo', type: 'text', required: true, cols: 6 },
  { name: 'data_nascimento', label: 'Data de Nascimento', type: 'date', cols: 6 },
  { name: 'idade', label: 'Idade', type: 'number', required: true, cols: 6 },
  { name: 'sexo', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino', 'Outro'], cols: 6 },
  { name: 'status', label: 'Status', type: 'select', options: ['fixo', 'espera'], optionLabels: { 'fixo': 'Fixo', 'espera': 'Espera' }, cols: 6 },
  { name: 'telefone', label: 'Telefone', type: 'text', cols: 6 },
  { name: 'cpf', label: 'CPF', type: 'text', required: true, cols: 6 },
  { name: 'rg', label: 'RG', type: 'text', cols: 6 },
  { name: 'titulo_eleitoral', label: 'Título Eleitoral', type: 'text', cols: 6 },
  { name: 'endereco', label: 'Endereço', type: 'textarea', cols: 12 },
];

export const IdosoForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.name} className={field.cols === 12 ? 'col-span-2' : ''}>
          <label htmlFor={`idoso-${field.name}`} className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-fjpp-red ml-1">*</span>}
          </label>
          {field.type === 'select' ? (
            <select
              id={`idoso-${field.name}`}
              name={field.name}
              value={values[field.name] || ''}
              onChange={onChange}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
            >
              <option value="">Selecione</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {field.optionLabels && field.optionLabels[option] ? field.optionLabels[option] : option}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={`idoso-${field.name}`}
              name={field.name}
              value={values[field.name] || ''}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
            />
          ) : (
            <input
              id={`idoso-${field.name}`}
              type={field.type}
              name={field.name}
              value={values[field.name] || ''}
              onChange={onChange}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
            />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={() => window.history.back()}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  </form>
);

IdosoForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

IdosoForm.defaultProps = {
  loading: false,
};

