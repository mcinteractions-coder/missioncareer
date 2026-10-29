// Per-post SEO overrides for blog posts, keyed by URL slug.
export interface BlogSeo {
  postId: string;
  slug: string;
  seoTitle: string;
  description: string;
  h1: string;
  focusKeyword: string;
  keywords: string[];
  imageAlt: string;
  imageTitle: string;
  category: string;
  tags: string[];
}

export const BLOG_SEO: BlogSeo[] = [
  {
    postId: "fd561dbc-7ccf-4e9d-97b0-e27776cc1824",
    slug: "international-students-global-economy",
    seoTitle: "International Students & the Global Economy | Mission Career",
    description:
      "Discover how international students contribute to the US, UK, Canada and Australia through education spending, employment and global talent.",
    h1: "International Students and the Global Economy: The Value of Education Beyond University Fees",
    focusKeyword: "International students and global economy",
    keywords: [
      "International students and global economy",
      "Economic impact of international students",
      "Study abroad benefits",
      "International education economy",
      "Study in USA, UK, Canada and Australia",
      "Global graduate employment",
      "Study abroad for Indian students",
    ],
    imageAlt:
      "3D cartoon illustration of an international student exploring study abroad opportunities in the USA, UK, Canada and Australia.",
    imageTitle: "Beyond Borders: International Students and the Global Economy",
    category: "Study Abroad News",
    tags: ["International Students", "Global Education", "Study Abroad", "International Careers", "Mission Career"],
  },
];

export const seoBySlugOrId = (key: string) =>
  BLOG_SEO.find((s) => s.slug === key || s.postId === key);
export const slugForPost = (id: string) => BLOG_SEO.find((s) => s.postId === id)?.slug ?? id;
