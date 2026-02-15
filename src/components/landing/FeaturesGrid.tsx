import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Warehouse, ScanLine, ShoppingCart, Bot, BarChart3, ShieldCheck } from "lucide-react";

const icons = [Warehouse, ScanLine, ShoppingCart, Bot, BarChart3, ShieldCheck];

const FeaturesGrid = () => {
  const { t } = useTranslation();
  const features = t("features.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("features.eyebrow")}</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={feature.title}
                className="group bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
