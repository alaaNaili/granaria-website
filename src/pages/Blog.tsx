import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost, calculateReadingTime, formatDate, getBlogPosts, getStrapiMediaUrl } from "@/services/strapi";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// ─── helpers ────────────────────────────────────────────────────────────────

export const getPostImages = (post: BlogPost): string[] => {
  if (!Array.isArray(post.images)) return [];
  return post.images
    .map(
      (img) =>
        img?.formats?.large?.url || img?.formats?.medium?.url || img?.url,
    )
    .filter(Boolean) as string[];
};

// ─── Page ───────────────────────────────────────────────────────────────────

const GranariaBlog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    loadBlogPosts();
  }, [currentPage]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogPosts(currentPage, pageSize);
      setPosts(response.data);
      setTotalPages(response.meta.pagination?.pageCount || 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load blog posts",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Decorative glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                {t("blog.eyebrow", "Ressources")}
              </span>
              <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-5">
                {t("blog.title", "Actualités")}{" "}
                <span className="text-primary">&</span>{" "}
                {t("blog.titleAccent", "Nouvelles")}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {t(
                  "blog.description",
                  "Restez informé des dernières nouvelles, mises à jour et histoires de notre communauté.",
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {error && (
              <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadBlogPosts} variant="outline">
                  {t("blog.retry", "Réessayer")}
                </Button>
              </div>
            )}

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: pageSize }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                className="py-24 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Newspaper className="h-9 w-9 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                  {t("blog.noPosts", "Aucun article disponible")}
                </h3>
                <p className="text-muted-foreground">
                  {t(
                    "blog.noPostsDescription",
                    "Revenez bientôt pour de nouvelles actualités!",
                  )}
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-14 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {t("blog.previous", "Précédent")}
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="h-10 w-10 p-0"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {t("blog.next", "Suivant")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

// ─── Card ───────────────────────────────────────────────────────────────────

const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const { t } = useTranslation();
  const images = getPostImages(post);
  const firstImage = images[0] ?? null;
  const extraCount = images.length - 1;
  const readingTime = calculateReadingTime(post.contenu);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group flex flex-col h-full bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-muted flex-none">
          {firstImage ? (
            <>
              <img
                src={getStrapiMediaUrl(firstImage)}
                alt={post.titre}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {extraCount > 0 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="2"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="2"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                      strokeWidth="2"
                    />
                  </svg>
                  +{extraCount}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/5">
              <Newspaper className="h-10 w-10 text-primary/20" />
            </div>
          )}

          {post.category && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              {post.category.nom}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} {t("blog.minRead", "min")}
            </span>
          </div>

          <h3 className="font-heading font-semibold text-lg text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
            {post.titre}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed flex-1">
            {post.extrait}
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
            {t("blog.readMore", "Lire plus")}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const CardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-20 mt-2" />
    </div>
  </div>
);

export default GranariaBlog;
