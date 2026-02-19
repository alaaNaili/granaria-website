import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <footer className="border-t border-border py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
          <img src="/logo2.png" alt={t("header.logoAlt")} className="h-14 w-auto" />
          <span className="text-xl font-heading font-bold text-foreground tracking-tight">Granaria</span>
        </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">{t("footer.features")}</a>
            <a href="#solutions" className="hover:text-foreground transition-colors">{t("footer.solutions")}</a>
            <button onClick={() => navigate("https://platform.granaria.tech")} className="hover:text-foreground transition-colors">{t("footer.platform")}</button>
<button
  onClick={() => window.location.href = "https://platform.granaria.tech/legal?tab=privacy"}
  className="hover:text-foreground transition-colors"
>
  {t("footer.privacy")}
</button>

<button
  onClick={() => window.location.href = "https://platform.granaria.tech/legal?tab=terms"}
  className="hover:text-foreground transition-colors"
>
  {t("footer.terms")}
</button>

          </nav>

          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
