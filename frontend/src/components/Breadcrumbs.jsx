import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'react-bootstrap-icons';

export const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-3" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-fjpp-gray-400" />}
            {isLast || !item.to ? (
              <span className={isLast ? 'text-fjpp-green font-semibold' : 'text-fjpp-gray-600'}>
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-fjpp-gray-600 hover:text-fjpp-blue transition-colors hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
};

Breadcrumbs.defaultProps = {
  items: [],
};

