import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ScanLine, Layers, Scale, Eye } from "lucide-react";

const icons = [ScanLine, Layers, Scale, Eye];

const TrustSection = () => {
  const { t } = useTranslation();
  const benefits = t("trust.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="py-20 md:py-28 bg-section-alt">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            {t("trust.title")}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={b.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
