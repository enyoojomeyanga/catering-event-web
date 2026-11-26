import { business } from '../data/business';

const raw = (import.meta.env.PUBLIC_SITE_URL ?? '').trim();
function parseOrigin(value: string): URL | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || !url.hostname.includes('.') || url.hostname.endsWith('.localhost')) {
    throw new Error('PUBLIC_SITE_URL must be the confirmed HTTPS production origin, without a path, credentials, query or fragment.');
  }
  return url;
}
export const siteOrigin = parseOrigin(raw);
export const indexingEnabled = import.meta.env.PUBLIC_ENABLE_INDEXING === 'true';
if (indexingEnabled && (!siteOrigin || !business.displayName)) {
  throw new Error('Indexing requires a confirmed production origin and approved business.displayName.');
}
export const canIndex = indexingEnabled && Boolean(siteOrigin && business.displayName);
export function canonicalUrl(path: string): string | undefined {
  return siteOrigin ? new URL(path === '/' ? '/' : `${path.replace(/\/$/, '')}/`, siteOrigin).href : undefined;
}
export const corePaths = ['/', '/services', '/services/catering', '/services/decoration', '/services/baking', '/services/confectionery', '/about', '/faq', '/contact'] as const;
export function businessSchema() {
  if (!canIndex) return undefined;
  return {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: business.displayName, legalName: business.registeredName,
    url: canonicalUrl('/'), telephone: '+234' + business.phones[0].slice(1),
    email: business.email,
    address: { '@type': 'PostalAddress', streetAddress: business.offices[0].address, addressLocality: 'Idah', addressRegion: 'Kogi', addressCountry: 'NG' },
    areaServed: { '@type': 'Country', name: 'Nigeria' },
  };
}
