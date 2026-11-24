import { getCollection, type CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export type Photo = NonNullable<Project['data']['cover']>;
export async function publishedProjects() {
  const entries = await getCollection('projects');
  return entries.filter(entry => entry.id !== 'setup' && entry.data.published && entry.data.permission && entry.data.cover && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)).sort((a,b) => Number(b.data.featured)-Number(a.data.featured) || (b.data.date ?? '').localeCompare(a.data.date ?? '') || a.id.localeCompare(b.id));
}
export function projectPhotos(project: Project): Photo[] {
  return [...(project.data.cover ? [project.data.cover] : []), ...project.data.photos];
}
