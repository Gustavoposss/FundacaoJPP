import { useEffect } from 'react';

const DEFAULT_TITLE = 'Fundação José Possidônio Peixoto';
const DEFAULT_DESCRIPTION =
  'Promovemos bem-estar, dignidade e qualidade de vida de idosos e suas famílias por meio de ações sociais, educacionais e culturais.';
const DEFAULT_IMAGE = 'https://fundacaojpp.com/logo-fundacao-jpp.svg';
const DEFAULT_BASE_URL = 'https://fundacaojpp.com';

const ensureMeta = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
    document.head.appendChild(tag);
  } else {
    Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
  }
};

const ensureLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export const usePageMeta = ({ title, description, image, url }) => {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pageImage = image || DEFAULT_IMAGE;
    const pageUrl = url || `${DEFAULT_BASE_URL}${window.location.pathname}`;

    document.title = pageTitle;

    ensureMeta('meta[name="description"]', { name: 'description', content: pageDescription });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: pageImage });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: pageUrl });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: DEFAULT_TITLE });
    ensureMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' });

    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: pageImage });
    ensureMeta('meta[name="twitter:url"]', { name: 'twitter:url', content: pageUrl });

    ensureLink('canonical', pageUrl);
  }, [title, description, image, url]);
};

