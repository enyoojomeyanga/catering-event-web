import type { APIRoute } from 'astro';
import { canIndex, canonicalUrl, corePaths } from '../lib/seo';
import { publishedProjects } from '../lib/portfolio';
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const GET: APIRoute = async () => {
  const projects = canIndex ? await publishedProjects() : [];
  const paths = canIndex ? [...corePaths, ...(projects.length ? ['/gallery', ...projects.map(p => `/gallery/${p.id}`)] : [])] : [];
  const entries = paths.map(path => `<url><loc>${escapeXml(canonicalUrl(path)!)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
