import PropTypes from 'prop-types';

export const MembroEquipeForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor="membro-nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="membro-nome"
          type="text"
          name="nome_completo"
          value={values.nome_completo || ''}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="membro-cargo" className="block text-sm font-medium text-gray-700 mb-1">
          Cargo <span className="text-fjpp-red ml-1">*</span>
        </label>
        <input
          id="membro-cargo"
          type="text"
          name="cargo"
          value={values.cargo || ''}
          onChange={onChange}
          required
          placeholder="Ex: Presidente, Voluntário"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="membro-role" className="block text-sm font-medium text-gray-700 mb-1">
          Função/Área
        </label>
        <input
          id="membro-role"
          type="text"
          name="role"
          value={values.role || ''}
          onChange={onChange}
          placeholder="Ex: Liderança, Tecnologia, Apoio"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="membro-foto" className="block text-sm font-medium text-gray-700 mb-1">
          URL da Foto
        </label>
        <input
          id="membro-foto"
          type="url"
          name="foto_url"
          value={values.foto_url || ''}
          onChange={onChange}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          URL da foto de perfil (recomendado: imagem quadrada)
        </p>
      </div>
      <div>
        <label htmlFor="membro-ordem" className="block text-sm font-medium text-gray-700 mb-1">
          Ordem de Exibição
        </label>
        <input
          id="membro-ordem"
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
      <div className="flex items-center">
        <input
          id="membro-ativo"
          type="checkbox"
          name="ativo"
          checked={values.ativo !== undefined ? values.ativo : true}
          onChange={onChange}
          className="w-4 h-4 text-fjpp-green border-gray-300 rounded focus:ring-fjpp-green"
        />
        <label htmlFor="membro-ativo" className="ml-2 text-sm font-medium text-gray-700">
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
        {loading ? 'Salvando...' : 'Salvar Membro'}
      </button>
    </div>
  </form>
);

MembroEquipeForm.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

MembroEquipeForm.defaultProps = {
  loading: false,
};

