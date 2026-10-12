import type { FeedPost, FeedUser } from "./types";

const API_BASE = "https://jsonplaceholder.typicode.com";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
}

export async function fetchFeed(): Promise<{ posts: FeedPost[]; users: FeedUser[] }> {
  const [posts, users] = await Promise.all([
    fetchJson<FeedPost[]>(`${API_BASE}/posts`),
    fetchJson<FeedUser[]>(`${API_BASE}/users`),
  ]);
  return { posts, users };
}