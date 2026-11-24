import { business } from '../data/business';
export function whatsappLink(message?: string): string {
  return `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
