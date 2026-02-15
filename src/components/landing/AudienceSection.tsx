import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sprout, Building2, Truck, ShoppingBag } from "lucide-react";

const icons = [Sprout, Building2, Truck, ShoppingBag];

const AudienceSection = () => {
  const { t } = useTranslation();
  const audiences = t("audience.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section id="solutions" className="py-20 md:py-28 bg-section-alt">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("audience.eyebrow")}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            {t("audience.title")}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {audiences.map((a, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={a.title}
                className="bg-card rounded-xl p-7 border border-border text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-5">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
