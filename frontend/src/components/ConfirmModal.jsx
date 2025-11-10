import PropTypes from 'prop-types';
import { X } from 'react-bootstrap-icons';
import classNames from 'classnames';

export const ConfirmModal = ({ show, title, message, onConfirm, onCancel, confirmVariant = 'danger' }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title || 'Confirmar ação'}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700">{message || 'Tem certeza que deseja continuar?'}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={classNames(
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
              confirmVariant === 'danger'
                ? 'bg-fjpp-red hover:bg-red-600'
                : 'bg-fjpp-green hover:bg-green-600'
            )}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmVariant: PropTypes.string,
};

ConfirmModal.defaultProps = {
  title: 'Confirmar ação',
  message: 'Tem certeza que deseja continuar?',
  confirmVariant: 'danger',
};

