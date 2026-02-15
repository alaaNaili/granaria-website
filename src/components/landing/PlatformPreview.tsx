import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";

const PlatformPreview = () => {
  const { t } = useTranslation();

  return (
    <section id="platform" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("platform.eyebrow")}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            {t("platform.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("platform.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
            <img
              src={dashboardMockup}
              alt={t("platform.imageAlt")}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformPreview;
