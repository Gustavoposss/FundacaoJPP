import PropTypes from 'prop-types';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </div>
  );
};

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

