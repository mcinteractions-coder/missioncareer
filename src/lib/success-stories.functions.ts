// Public read of student success stories for the /success-stories page.
// Runs server-side (SSR + loader) so Google sees the real student names in HTML.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type SuccessStory = {
  id: string;
  name: string;
  university: string;
  course: string;
  destination: string;
  flagCode: string;
  gender: "male" | "female";
  prevCollege: string;
  prevCourse: string;
  image: string | null;
};

export type RecentAdmit = { name: string; university: string };

export type SuccessStoriesData = {
  stories: SuccessStory[];
  admits: RecentAdmit[];
};

const EMPTY: SuccessStoriesData = { stories: [], admits: [] };

const COLUMNS =
  "id, title, university, course, destination, flag_code, gender, prev_college, prev_course, image";

type PostRow = {
  id?: string;
  title: string;
  university?: string | null;
  course?: string | null;
  destination?: string | null;
  flag_code?: string | null;
  gender?: string | null;
  prev_college?: string | null;
  prev_course?: string | null;
  image?: string | null;
};

const FLAG_BY_COUNTRY: Record<string, string> = {
  Germany: "de",
  Canada: "ca",
  USA: "us",
  "United States": "us",
  UK: "gb",
  "United Kingdom": "gb",
  Australia: "au",
  Ireland: "ie",
  France: "fr",
};

function flagCode(row: PostRow): string {
  const code = (row.flag_code || "").toLowerCase().trim();
  if (code && code !== "un") return code;
  return FLAG_BY_COUNTRY[(row.destination || "").trim()] || "un";
}

// Only pass through real image URLs — base64 blobs would bloat the page HTML.
function safeImage(row: PostRow): string | null {
  const img = row.image || "";
  return /^https?:\/\//.test(img) ? img : null;
}

function toStory(row: PostRow, index: number): SuccessStory {
  return {
    id: row.id || `story-${index}`,
    name: row.title,
    university: row.university || "",
    course: row.course || "",
    destination: row.destination || "",
    flagCode: flagCode(row),
    gender: row.gender === "female" ? "female" : "male",
    prevCollege: row.prev_college || "",
    prevCourse: row.prev_course || "",
    image: safeImage(row),
  };
}

export const getSuccessStories = createServerFn({ method: "GET" }).handler(
  async (): Promise<SuccessStoriesData> => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      console.error("[success-stories] missing backend environment variables");
      return EMPTY;
    }

    // Public read-only client: the posts table has a public SELECT policy.
    const client = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const [storiesRes, admitsRes] = await Promise.all([
      client
        .from("posts")
        .select(COLUMNS)
        .eq("kind", "success")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      client
        .from("posts")
        .select("title, university")
        .eq("kind", "admit")
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    if (storiesRes.error) {
      console.error("[success-stories] story read failed:", storiesRes.error.message);
    }
    if (admitsRes.error) {
      console.error("[success-stories] admit read failed:", admitsRes.error.message);
    }

    const rows = (storiesRes.data ?? []) as unknown as PostRow[];
    const seen = new Set<string>();
    const stories: SuccessStory[] = [];
    rows.forEach((row, i) => {
      const key = `${row.title}::${row.university || ""}`.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      stories.push(toStory(row, i));
    });

    const admitRows = (admitsRes.data ?? []) as unknown as PostRow[];
    const admits: RecentAdmit[] = admitRows
      .filter((r) => r.title && r.university)
      .map((r) => ({ name: r.title, university: r.university as string }));

    return { stories, admits };
  },
);
