import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Loader = ({ fullscreen }) => (
  <div
    className={classNames(
      'flex items-center justify-center',
      fullscreen ? 'fixed inset-0 bg-white/80 z-50' : 'min-h-[200px]'
    )}
  >
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-fjpp-green border-t-transparent"></div>
  </div>
);

Loader.propTypes = {
  fullscreen: PropTypes.bool,
};

Loader.defaultProps = {
  fullscreen: false,
};

