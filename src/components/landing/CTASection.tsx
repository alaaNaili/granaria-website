import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROFILES = [
  { key: "distributor", form: "A" },
  { key: "wholesaler", form: "A" },
  { key: "cooperative", form: "A" },
  { key: "processor", form: "A" },
  { key: "bigTrader", form: "A" },
  { key: "storageCompany", form: "A" },
  { key: "publicAgency", form: "B" },
  { key: "ministry", form: "B" },
];

const CTASection = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof PROFILES[0] | null>(null);

  const handleSelect = (profile: typeof PROFILES[0]) => {
    setSelected(profile);
    setOpen(false);
  };

  const handleNavigate = () => {
    if (!selected) return;
    window.open(
      `https://platform.granaria.tech/enterprise-inquiry?profile=${selected.key}&form=${selected.form}`,
      "_blank"
    );
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center bg-hero-gradient rounded-2xl p-10 md:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
            {/* Dropdown */}
            <div className="relative w-full">
              <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-primary-foreground hover:bg-white/20 transition-all"
              >
                <span className={selected ? "text-sm font-medium" : "text-sm text-primary-foreground/60"}>
                  {selected ? t(`enterprise.profiles.${selected.key}`) : t("cta.selectProfile")}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* Form A group */}
                    <div className="px-3 pt-3 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">
                        {t("enterprise.formA.groupLabel")}
                      </p>
                      {PROFILES.filter(p => p.form === "A").map((profile) => (
                        <button
                          key={profile.key}
                          onClick={() => handleSelect(profile)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors text-left"
                        >
                          {t(`enterprise.profiles.${profile.key}`)}
                          {selected?.key === profile.key && <Check className="w-3.5 h-3.5 text-black" />}
                        </button>
                      ))}
                    </div>

                    <div className="mx-3 my-1 border-t border-gray-100" />

                    {/* Form B group */}
                    <div className="px-3 pb-3 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">
                        {t("enterprise.formB.groupLabel")}
                      </p>
                      {PROFILES.filter(p => p.form === "B").map((profile) => (
                        <button
                          key={profile.key}
                          onClick={() => handleSelect(profile)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors text-left"
                        >
                          {t(`enterprise.profiles.${profile.key}`)}
                          {selected?.key === profile.key && <Check className="w-3.5 h-3.5 text-black" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleNavigate}
              disabled={!selected}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("cta.getStarted")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;