import PropTypes from 'prop-types';

export const PatrocinadorForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor="patrocinador-nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="patrocinador-nome"
          type="text"
          name="nome"
          value={values.nome || ''}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="patrocinador-logo" className="block text-sm font-medium text-gray-700 mb-1">
          URL do Logo
        </label>
        <input
          id="patrocinador-logo"
          type="url"
          name="logo_url"
          value={values.logo_url || ''}
          onChange={onChange}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          URL do logo do patrocinador (recomendado: imagem quadrada ou retangular)
        </p>
      </div>
      <div>
        <label htmlFor="patrocinador-titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título/Categoria
        </label>
        <input
          id="patrocinador-titulo"
          type="text"
          name="titulo"
          value={values.titulo || ''}
          onChange={onChange}
          placeholder="Ex: Patrocinador, Parceiro"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="patrocinador-ordem" className="block text-sm font-medium text-gray-700 mb-1">
          Ordem de Exibição
        </label>
        <input
          id="patrocinador-ordem"
          type="number"
          name="ordem_exibicao"
          value={values.ordem_exibicao || 0}
          onChange={onChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          Menor número aparece primeiro
        </p>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="patrocinador-website" className="block text-sm font-medium text-gray-700 mb-1">
          Link do Website
        </label>
        <input
          id="patrocinador-website"
          type="url"
          name="link_website"
          value={values.link_website || ''}
          onChange={onChange}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          Link para o website do patrocinador (opcional)
        </p>
      </div>
      <div className="flex items-center">
        <input
          id="patrocinador-ativo"
          type="checkbox"
          name="ativo"
          checked={values.ativo !== undefined ? values.ativo : true}
          onChange={onChange}
          className="w-4 h-4 text-fjpp-green border-gray-300 rounded focus:ring-fjpp-green"
        />
        <label htmlFor="patrocinador-ativo" className="ml-2 text-sm font-medium text-gray-700">
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
        {loading ? 'Salvando...' : 'Salvar Patrocinador'}
      </button>
    </div>
  </form>
);

PatrocinadorForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

PatrocinadorForm.defaultProps = {
  loading: false,
};

