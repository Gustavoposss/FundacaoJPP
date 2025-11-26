import PropTypes from 'prop-types';

const fields = [
  // Dados Pessoais
  { name: 'nome_completo', label: 'Nome Completo', type: 'text', required: true, cols: 6 },
  { name: 'data_nascimento', label: 'Data de Nascimento', type: 'date', required: true, cols: 6 },
  { name: 'sexo', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino', 'Outro'], required: true, cols: 3 },
  { name: 'naturalidade', label: 'Naturalidade', type: 'text', required: true, cols: 3 },
  { name: 'telefone', label: 'Telefone', type: 'text', required: true, cols: 3 },
  { name: 'status', label: 'Status', type: 'select', options: ['fixo', 'espera'], optionLabels: { 'fixo': 'Fixo', 'espera': 'Espera' }, required: true, cols: 3 },
  
  // Endereço
  { name: 'endereco', label: 'Endereço', type: 'text', required: true, cols: 6 },
  { name: 'numero', label: 'Nº', type: 'text', required: true, cols: 2 },
  { name: 'bairro', label: 'Bairro', type: 'text', required: true, cols: 4 },
  { name: 'cidade', label: 'Cidade', type: 'text', required: true, cols: 4 },
  { name: 'cep', label: 'CEP', type: 'text', required: true, cols: 2 },
  
  // Documentos
  { name: 'cpf', label: 'CPF', type: 'text', required: true, cols: 3 },
  { name: 'rg', label: 'RG', type: 'text', required: true, cols: 3 },
  { name: 'orgao_expedidor', label: 'Órgão Expedidor', type: 'text', required: true, cols: 3 },
  { name: 'titulo_eleitoral', label: 'Título Eleitoral', type: 'text', required: true, cols: 3 },
  { name: 'zona_eleitoral', label: 'Zona', type: 'text', required: true, cols: 2 },
  { name: 'secao_eleitoral', label: 'Seção', type: 'text', required: true, cols: 2 },
  { name: 'municipio_uf', label: 'Município/UF', type: 'text', required: true, cols: 4 },
  
  // Inscrição
  { name: 'data_inscricao', label: 'Data de Inscrição no Projeto', type: 'date', required: true, cols: 4 },
];

const getColClass = (cols) => {
  const colMap = {
    2: 'md:col-span-1',
    3: 'md:col-span-1',
    4: 'md:col-span-2',
    6: 'md:col-span-3',
    12: 'md:col-span-6',
  };
  return colMap[cols] || 'md:col-span-3';
};

export const IdosoForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {fields.map((field) => (
        <div key={field.name} className={getColClass(field.cols)}>
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
