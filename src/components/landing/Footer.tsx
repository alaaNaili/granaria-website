import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      // Already on the page — just scroll smoothly
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // On a different page — navigate then scroll after mount
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300); // 300ms lets the new page render before scrolling
    }
  };
  return (
    <footer className="border-t border-border py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/logo2.png"
              alt={t("header.logoAlt")}
              className="h-14 w-auto"
            />
            <span className="text-xl font-heading font-bold text-foreground tracking-tight">
              Granaria
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {/* <button
              onClick={() => goToSection("features")}
              className="hover:text-foreground transition-colors"
            >
              {t("footer.features")}
            </button> */}
            <button
              onClick={() => goToSection("solutions")}
              className="hover:text-foreground transition-colors"
            >
              {t("footer.solutions")}
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://platform.granaria.tech",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="hover:text-foreground transition-colors"
            >
              {t("footer.platform")}
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="hover:text-foreground transition-colors"
            >
              {t("footer.blog")}
            </button>
            <button
              onClick={() => navigate("/guide")}
              className="hover:text-foreground transition-colors"
            >
              {t("footer.guide")}
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://platform.granaria.tech/legal?tab=privacy",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="hover:text-foreground transition-colors"
            >
              {t("footer.privacy")}
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://platform.granaria.tech/legal?tab=terms",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
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
