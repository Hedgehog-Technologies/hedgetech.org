import { getCollection } from 'astro:content';
import { getLatestRelease, getRepo, type Release, type Repo } from './github';

export interface ProjectWithData {
  slug: string;
  data: Awaited<ReturnType<typeof getCollection<'projects'>>>[number]['data'];
  entry: Awaited<ReturnType<typeof getCollection<'projects'>>>[number];
  repo?: Repo;
  release?: Release | null;
}

/** All published project pages, enriched with live GitHub data when available. */
export async function getProjects(): Promise<ProjectWithData[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  const list = await Promise.all(
    entries.map(async (entry) => {
      const repo = entry.data.repo ? await getRepo(entry.data.repo) : undefined;
      const release = entry.data.repo ? await getLatestRelease(entry.data.repo) : null;
      return { slug: entry.id, data: entry.data, entry, repo, release };
    }),
  );
  return list.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
