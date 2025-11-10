import PropTypes from 'prop-types';

export const EventoForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor="evento-nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Evento <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="evento-nome"
          type="text"
          name="nome"
          value={values.nome || ''}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="evento-data" className="block text-sm font-medium text-gray-700 mb-1">
          Data <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="evento-data"
          type="date"
          name="data_evento"
          value={values.data_evento || ''}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="evento-local" className="block text-sm font-medium text-gray-700 mb-1">
          Local <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="evento-local"
          type="text"
          name="local"
          value={values.local || ''}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="evento-descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="evento-descricao"
          name="descricao"
          value={values.descricao || ''}
          onChange={onChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
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
        {loading ? 'Salvando...' : 'Salvar Evento'}
      </button>
    </div>
  </form>
);

EventoForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

EventoForm.defaultProps = {
  loading: false,
};

