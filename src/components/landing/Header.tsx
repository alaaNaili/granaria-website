import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navKeys = ["features", "solutions", "platform", "pricing"] as const;
const PRICING_URL = "https://granaria.tech/pricing";

const getNavHref = (key: (typeof navKeys)[number]) =>
  key === "pricing" ? PRICING_URL : `#${key}`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 ">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo2.png" alt={t("header.logoAlt")} className="h-14 w-auto" />
            <span className="text-xl font-heading font-bold text-foreground tracking-tight">Granaria</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navKeys.map((key) => (
            <a
              key={key}
              href={getNavHref(key)}
              {...(key === "pricing" && { target: "_blank", rel: "noopener noreferrer" })}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t(`header.nav.${key}`)}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
                {i18n.language === "en" ? "EN" : "FR"}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                English{i18n.language === "en" && " ✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("fr")}>
                Français{i18n.language === "fr" && " ✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href={PRICING_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              {t("header.signIn")}
            </Button>
          </a>

          <Button size="sm">{t("header.requestDemo")}</Button>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          <nav className="flex flex-col gap-3">
            {navKeys.map((key) => (
              <a
                key={key}
                href={getNavHref(key)}
                {...(key === "pricing" && { target: "_blank", rel: "noopener noreferrer" })}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {t(`header.nav.${key}`)}
              </a>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2 gap-1.5 font-medium w-full justify-start">
                  {i18n.language === "en" ? "EN" : "FR"}
                  <ChevronDown className="h-4 w-4 opacity-70 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                  English{i18n.language === "en" && " ✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage("fr")}>
                  Français{i18n.language === "fr" && " ✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href={PRICING_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                {t("header.signIn")}
              </Button>
            </a>
            <Button size="sm" className="mt-2">{t("header.requestDemo")}</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
