import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt={t("hero.heroImageAlt")} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36 lg:py-44">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-primary-foreground text-sm font-medium mb-6 border border-accent/30">
              {t("hero.badge")}
            </span> */}
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8">
              {t("hero.requestDemo")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="#solutions"
              className="inline-flex items-center justify-center border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ minHeight: '3rem' }}
            >
              <Play className="mr-2 h-5 w-5" />
              {t("hero.seeHowItWorks")}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
