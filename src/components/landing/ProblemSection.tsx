import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

const ProblemSection = () => {
  const { t } = useTranslation();
  const problems = t("problem.problems", { returnObjects: true }) as string[];
  const solutions = t("problem.solutions", { returnObjects: true }) as string[];

  return (
    <section className="py-20 md:py-28 bg-section-alt">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16" {...fadeInUp} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            {t("problem.title")}
            <br />
            <span className="text-primary">{t("problem.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-4xl mx-auto">
          <motion.div
            className="bg-card rounded-xl p-8 border border-border shadow-sm"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{t("problem.challenge")}</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-card rounded-xl p-8 border border-primary/20 shadow-sm ring-1 ring-primary/10"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{t("problem.granariaWay")}</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
