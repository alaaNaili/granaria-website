const STRAPI_URL = "https://blog.granaria.tech";
// const STRAPI_URL = "http://localhost:1338";

export interface BlogPost {
  id: number;
  documentId: string;
  titre: string;
  slug: string;
  extrait: string;
  contenu: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  images?: {
    id: number;
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }[];
  category?: {
    id: number;
    nom: string;
    slug: string;
  } | null;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch all blog posts with pagination
 */
export async function getBlogPosts(
  page = 1,
  pageSize = 9,
): Promise<StrapiResponse<BlogPost[]>> {
  try {
    const params = new URLSearchParams({
      "pagination[page]": page.toString(),
      "pagination[pageSize]": pageSize.toString(),
      "sort[0]": "publishedAt:desc",
      "populate[1]": "category",
      "populate[2]": "images",
      publicationState: "live",
    });

    const response = await fetch(`${STRAPI_URL}/api/blog-posts?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const params = new URLSearchParams({
      "filters[slug][$eq]": slug,
      "populate[0]": "category",
      "populate[1]": "images",
      publicationState: "live",
    });

    const response = await fetch(`${STRAPI_URL}/api/blog-posts?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data: StrapiResponse<BlogPost[]> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

/**
 * Get the full URL for a Strapi media file
 */
export function getStrapiMediaUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}

/**
 * Format date for display in French
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Calculate reading time based on content
 */
export function calculateReadingTime(contenu: string): number {
  const wordsPerMinute = 200;
  const wordCount = contenu.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
