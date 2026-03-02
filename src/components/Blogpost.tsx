import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Newspaper,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import {
  getBlogPost,
  type BlogPost,
  getStrapiMediaUrl,
  formatDate,
  calculateReadingTime,
} from "@/services/strapi";
import Header from "./landing/Header";
import Footer from "./landing/Footer";
import { getPostImages } from "@/pages/Blog";

// ─── Image Gallery ────────────────────────────────────────────────────────────

const ImageGallery = ({
  images,
  altBase,
}: {
  images: string[];
  altBase: string;
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number, inLightbox = false) => {
      if (animating) return;
      const next = (index + images.length) % images.length;
      setAnimating(true);
      if (inLightbox) setLightboxIndex(next);
      else setActiveIndex(next);
      setTimeout(() => setAnimating(false), 280);
    },
    [images.length, animating],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(lightboxIndex - 1, true);
      if (e.key === "ArrowRight") goTo(lightboxIndex + 1, true);
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, lightboxIndex, goTo]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        className="mb-12 overflow-hidden rounded-xl border border-border shadow-2xl shadow-primary/10 cursor-zoom-in"
        onClick={() => {
          setLightboxIndex(0);
          setLightboxOpen(true);
        }}
      >
        <img
          src={getStrapiMediaUrl(images[0])}
          alt={altBase}
          className="w-full h-auto"
        />
        {lightboxOpen && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNav={(i) => goTo(i, true)}
            animating={animating}
            t={t}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-12 space-y-3">
        {/* Main slide */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border shadow-2xl shadow-primary/10 bg-muted cursor-zoom-in"
          style={{ aspectRatio: "16/9" }}
          onClick={() => {
            setLightboxIndex(activeIndex);
            setLightboxOpen(true);
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                pointerEvents: i === activeIndex ? "auto" : "none",
              }}
            >
              <img
                src={getStrapiMediaUrl(img)}
                alt={`${altBase} — ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          {/* Zoom hint */}
          <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <ZoomIn className="h-3 w-3" />
            {t("blog.zoom", "Agrandir")}
          </div>

          {/* Counter */}
          <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Arrows — stop propagation to avoid opening lightbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(activeIndex - 1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-primary/70 transition-colors focus:outline-none"
            aria-label={t("blog.prevImage", "Image précédente")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goTo(activeIndex + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-primary/70 transition-colors focus:outline-none"
            aria-label={t("blog.nextImage", "Image suivante")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(i);
                }}
                className="h-2 rounded-full transition-all focus:outline-none"
                style={{
                  width: i === activeIndex ? "24px" : "8px",
                  backgroundColor:
                    i === activeIndex
                      ? "hsl(var(--primary))"
                      : "rgba(255,255,255,0.5)",
                }}
                aria-label={`${t("blog.goToImage", "Aller à l'image")} ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-16 w-24 flex-none overflow-hidden rounded-lg transition-all focus:outline-none"
              style={{
                opacity: i === activeIndex ? 1 : 0.5,
                boxShadow:
                  i === activeIndex ? "0 0 0 2px hsl(var(--primary))" : "none",
                  margin: i === 0 ? "4px 0 0 4px" : i === images.length - 1 ? "4px 4px 0 0" : "0 4px",
              }}
              aria-label={`${t("blog.thumbnailAlt", "Vignette")} ${i + 1}`}
            >
              <img
                src={getStrapiMediaUrl(img)}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNav={(i) => goTo(i, true)}
          animating={animating}
          t={t}
        />
      )}
    </>
  );
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

const Lightbox = ({
  images,
  index,
  onClose,
  onNav,
  animating,
  t,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
  animating: boolean;
  t: (key: string, fallback: string) => string;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
    onClick={onClose}
  >
    <button
      className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      onClick={onClose}
      aria-label={t("blog.close", "Fermer")}
    >
      <X className="h-5 w-5" />
    </button>

    <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
      {index + 1} / {images.length}
    </div>

    <div
      className="relative mx-16 max-h-[85vh] max-w-5xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={getStrapiMediaUrl(images[index])}
        alt=""
        className="mx-auto max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl transition-opacity duration-280"
        style={{ opacity: animating ? 0 : 1 }}
      />
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onNav(index - 1);
      }}
      className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary/60 transition-colors"
      aria-label={t("blog.prevImage", "Image précédente")}
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onNav(index + 1);
      }}
      className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary/60 transition-colors"
      aria-label={t("blog.nextImage", "Image suivante")}
    >
      <ChevronRight className="h-6 w-6" />
    </button>

    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onNav(i);
          }}
          className="h-12 w-16 flex-none overflow-hidden rounded-md transition-all"
          style={{
            opacity: i === index ? 1 : 0.35,
            boxShadow: i === index ? "0 0 0 2px hsl(var(--primary))" : "none",
          }}
        >
          <img
            src={getStrapiMediaUrl(img)}
            alt=""
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  </div>
);

// ─── Blog Post Page ───────────────────────────────────────────────────────────

const GranariaBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogPost(slug);
      if (!data) {
        setError("Post not found");
        return;
      }
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (
    platform?: "facebook" | "twitter" | "linkedin",
  ) => {
    const url = window.location.href;
    const title = post?.titre || "";
    if (platform === "facebook")
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      );
    else if (platform === "twitter")
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        "_blank",
      );
    else if (platform === "linkedin")
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
      );
    else if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    }
  };

  if (loading) return <PostSkeleton />;

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Newspaper className="h-9 w-9 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground mb-3">
              {t("blog.postNotFound", "Article non trouvé")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error ||
                t(
                  "blog.postNotFoundDescription",
                  "L'article que vous recherchez n'existe pas ou a été supprimé.",
                )}
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.goBack", "Retour")}
              </Button>
              <Button onClick={() => navigate("/blog")}>
                {t("blog.viewAllPosts", "Voir tous les articles")}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = getPostImages(post);
  const readingTime = calculateReadingTime(post.contenu);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">
        {/* ── Back bar ── */}
        {/* <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
          <div className="container mx-auto px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/blog")}
              className="group text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("blog.backToBlog", "Retour aux actualités")}
            </Button>
          </div>
        </div> */}

        <article className="py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* ── Header ── */}
              <motion.header
                className="mb-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {post.category && (
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    <Tag className="h-3.5 w-3.5" />
                    {post.category.nom}
                  </div>
                )}

                <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-5">
                  {post.titre}
                </h1>

                {post.extrait && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {post.extrait}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground border-y border-border py-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    {readingTime} {t("blog.minRead", "min")}
                  </span>
                  {images.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-primary"
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
                      {images.length}{" "}
                      {images.length === 1
                        ? t("blog.photo", "photo")
                        : t("blog.photos", "photos")}
                    </span>
                  )}

                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare()}
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                      {t("blog.share", "Partager")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("facebook")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("twitter")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("linkedin")}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.header>

              {/* ── Gallery ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {images.length > 0 ? (
                  <ImageGallery images={images} altBase={post.titre} />
                ) : (
                  <div className="mb-12 flex h-56 w-full items-center justify-center rounded-xl border border-border bg-primary/5">
                    <Newspaper className="h-14 w-14 text-primary/20" />
                  </div>
                )}
              </motion.div>

              {/* ── Content ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="prose prose-lg max-w-none
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground
                  prose-img:rounded-xl prose-img:border prose-img:border-border
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
              >
                <ReactMarkdown>{post.contenu}</ReactMarkdown>
              </motion.div>

              {/* ── Footer ── */}
              <footer className="mt-14 border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/blog")}
                  className="group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {t("blog.backToBlog", "Retour aux actualités")}
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("blog.shareArticle", "Partager cet article")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare("facebook")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare("twitter")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare("linkedin")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const PostSkeleton = () => (
  <>
    <Header />
    <div className="min-h-screen bg-background pt-16">
      <div className="border-b border-border h-12" />
      <div className="container mx-auto px-4 py-14">
        <div className="mx-auto max-w-4xl space-y-5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-4 py-4 border-y border-border">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-24 flex-none rounded-lg" />
            ))}
          </div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 w-full"
                style={{ width: `${85 + Math.random() * 15}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default GranariaBlogPost;
