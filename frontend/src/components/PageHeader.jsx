import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Breadcrumbs } from './Breadcrumbs';

export const PageHeader = ({ title, subtitle, breadcrumbs, actions, showBack }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
      <div className="flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="mt-2">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Voltar"
                className="p-2.5 text-fjpp-blue hover:bg-fjpp-blue-50 rounded-xl transition-all hover:scale-105 shadow-soft"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-3xl font-bold text-fjpp-gray-900">{title}</h2>
          </div>
          {subtitle && <p className="text-fjpp-gray-600 mt-2 text-base">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
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

