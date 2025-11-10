import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Breadcrumbs } from './Breadcrumbs';

export const PageHeader = ({ title, subtitle, breadcrumbs, actions, showBack }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="mt-2">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Voltar"
                className="p-2 text-fjpp-blue hover:bg-fjpp-light rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-fjpp-blue">{title}</h2>
          </div>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
  actions: PropTypes.node,
  showBack: PropTypes.bool,
};

PageHeader.defaultProps = {
  subtitle: '',
  breadcrumbs: [],
  actions: null,
  showBack: false,
};

