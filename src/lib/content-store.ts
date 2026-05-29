// Supabase-backed content store. Images are stored as base64 data URLs in the `image` column.
import { supabase } from "@/integrations/supabase/client";

export type PostKind = "blog" | "success" | "festival";

export interface Post {
  id: string;
  kind: PostKind;
  title: string;
  text: string;
  image?: string | null;
  active?: boolean;
  created_at: string;
  university?: string | null;
  course?: string | null;
  destination?: string | null;
  flag_code?: string | null;
  prev_course?: string | null;
  prev_college?: string | null;
  gender?: string | null;
}

export async function fetchPosts(kind?: PostKind): Promise<Post[]> {
  let q = supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) {
    console.error("fetchPosts", error);
    return [];
  }
  return (data ?? []) as Post[];
}

export async function fetchActiveFestival(): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("kind", "festival")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("fetchActiveFestival", error);
    return null;
  }
  return (data as Post | null) ?? null;
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
