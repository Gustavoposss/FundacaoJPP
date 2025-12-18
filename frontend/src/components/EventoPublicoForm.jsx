import PropTypes from 'prop-types';

export const EventoPublicoForm = ({ values, onChange, onSubmit, loading }) => (
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
      <div className="md:col-span-2">
        <label htmlFor="evento-video" className="block text-sm font-medium text-gray-700 mb-1">
          URL do Vídeo (YouTube)
        </label>
        <input
          id="evento-video"
          type="url"
          name="video_url"
          value={values.video_url || ''}
          onChange={onChange}
          placeholder="https://www.youtube.com/embed/..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          Cole a URL completa do embed do YouTube (ex: https://www.youtube.com/embed/VIDEO_ID)
        </p>
      </div>
      <div>
        <label htmlFor="evento-cor" className="block text-sm font-medium text-gray-700 mb-1">
          Cor do Tema
        </label>
        <select
          id="evento-cor"
          name="cor_tema"
          value={values.cor_tema || 'blue'}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        >
          <option value="blue">Azul</option>
          <option value="green">Verde</option>
          <option value="red">Vermelho</option>
          <option value="purple">Roxo</option>
          <option value="orange">Laranja</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          id="evento-publico"
          type="checkbox"
          name="exibir_publico"
          checked={values.exibir_publico !== undefined ? values.exibir_publico : true}
          onChange={onChange}
          className="w-4 h-4 text-fjpp-green border-gray-300 rounded focus:ring-fjpp-green"
        />
        <label htmlFor="evento-publico" className="ml-2 text-sm font-medium text-gray-700">
          Exibir no site público
        </label>
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

EventoPublicoForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

EventoPublicoForm.defaultProps = {
  loading: false,
};

