import { ORG } from './site';

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

export interface Release {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string;
  body: string | null;
  prerelease: boolean;
}

const API = 'https://api.github.com';

async function gh<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'hedgetech-docs-build',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${API}${path}`, { headers });
    if (res.status === 404) return null; // e.g. repo has no releases yet
    if (!res.ok) {
      console.warn(`[github] ${path} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // Never fail the build because GitHub is unreachable or rate limited.
    console.warn(`[github] ${path} failed: ${(err as Error).message}`);
    return null;
  }
}

let repoCache: Promise<Repo[]> | undefined;
/** All public, non-archived org repos (one API call per build). */
export function getOrgRepos(): Promise<Repo[]> {
  repoCache ??= gh<Repo[]>(`/orgs/${ORG}/repos?per_page=100&type=public`).then((r) => r ?? []);
  return repoCache;
}

const releaseCache = new Map<string, Promise<Release | null>>();
/** Latest published release for a repo, or null if none / unavailable. */
export function getLatestRelease(repo: string): Promise<Release | null> {
  if (!releaseCache.has(repo)) releaseCache.set(repo, gh<Release>(`/repos/${ORG}/${repo}/releases/latest`));
  return releaseCache.get(repo)!;
}

export async function getRepo(name: string): Promise<Repo | undefined> {
  return (await getOrgRepos()).find((r) => r.name.toLowerCase() === name.toLowerCase());
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
