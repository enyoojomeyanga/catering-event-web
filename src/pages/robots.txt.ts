import type { APIRoute } from 'astro';
import { canIndex, canonicalUrl } from '../lib/seo';
export const GET: APIRoute = () => new Response(
  `User-agent: *\nAllow: /\n${canIndex ? `Sitemap: ${canonicalUrl('/')?.replace(/\/$/, '')}/sitemap.xml\n` : ''}`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
