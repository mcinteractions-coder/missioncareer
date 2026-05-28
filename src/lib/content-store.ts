// Simple localStorage-backed content store for admin-managed posts.
// Images are stored as base64 data URLs.

export type PostKind = "blog" | "success" | "festival";

export interface Post {
  id: string;
  kind: PostKind;
  title: string;
  text: string;
  image?: string; // data URL
  active?: boolean; // for festival
  createdAt: number;
}

const KEY = "mc_content_v1";

function read(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(posts: Post[]) {
  localStorage.setItem(KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event("mc-content-updated"));
}

export function getPosts(kind?: PostKind): Post[] {
  const all = read().sort((a, b) => b.createdAt - a.createdAt);
  return kind ? all.filter((p) => p.kind === kind) : all;
}

export function addPost(p: Omit<Post, "id" | "createdAt">): Post {
  const post: Post = { ...p, id: crypto.randomUUID(), createdAt: Date.now() };
  write([post, ...read()]);
  return post;
}

export function deletePost(id: string) {
  write(read().filter((p) => p.id !== id));
}

export function updatePost(id: string, patch: Partial<Post>) {
  write(read().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function getActiveFestival(): Post | null {
  return getPosts("festival").find((p) => p.active) || null;
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function useContentVersion() {
  // helper for components to re-render on updates
  if (typeof window === "undefined") return 0;
  return 0;
}
