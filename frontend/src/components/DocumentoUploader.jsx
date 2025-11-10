import PropTypes from 'prop-types';
import { useRef } from 'react';
import { CloudArrowUp, Trash } from 'react-bootstrap-icons';

export const DocumentoUploader = ({ documentos, onUpload, onDelete, uploading }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <input
        type="file"
        accept=".pdf,image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-fjpp-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CloudArrowUp size={18} />
        {uploading ? 'Enviando...' : 'Enviar Documento'}
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Arquivo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {documentos.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  Nenhum documento enviado ainda.
                </td>
              </tr>
            ) : (
              documentos.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{doc.nome_arquivo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(doc.data_upload).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(doc)}
                      className="p-2 text-fjpp-red hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DocumentoUploader.propTypes = {
  documentos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome_arquivo: PropTypes.string.isRequired,
      data_upload: PropTypes.string.isRequired,
    })
  ),
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  uploading: PropTypes.bool,
};

DocumentoUploader.defaultProps = {
  documentos: [],
  uploading: false,
};

