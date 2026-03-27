import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronRight,
  ChevronDown,
  Users,
  Warehouse,
  Package,
  BarChart3,
  Link2,
  ShieldCheck,
  Globe,
  Building2,
  Search,
  X,
  Menu,
  Wheat,
  TrendingUp,
  FileText,
  ShoppingCart,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role =
  | "owner"
  | "employee"
  | "farmer"
  | "customer"
  | "admin"
  | "orsre"
  | "anida"
  | "semig"
  | "public";

interface Feature {
  id: string;
  videoFile: string;
  roles: Role[];
  note?: string; // e.g. "employee requires permission"
  infoNote?: string;
}

interface Section {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  features: Feature[];
}

interface InstitutionSection {
  id: string;
  type: "orsre" | "anida" | "semig";
  icon: React.ComponentType<{ className?: string }>;
  features: Feature[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<Role, string> = {
  owner: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  employee: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  farmer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  customer: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  admin: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  orsre: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  anida: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  semig: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  public: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const SECTIONS: Section[] = [
  {
    id: "platform-access",
    icon: Globe,
    features: [
      {
        id: "access-platform-user",
        videoFile: "access-platform-user.mp4",
        roles: ["owner", "employee", "farmer", "customer"],
      },
      {
        id: "access-platform-agence",
        videoFile: "access-platform-agence.mp4",
        roles: ["admin"],
      },
      {
        id: "create-account",
        videoFile: "create-account.mp4",
        roles: ["owner"],
      },
    ],
  },
  {
    id: "user-management",
    icon: Users,
    features: [
      {
        id: "invite-farmer",
        videoFile: "invite-farmer.mp4",
        roles: ["owner"],
        infoNote: "guide.infoNotes.emailCredentials",
      },
      {
        id: "invite-employee",
        videoFile: "invite-employee.mp4",
        roles: ["owner"],
        infoNote: "guide.infoNotes.emailCredentials",
      },
      {
        id: "invite-customer",
        videoFile: "invite-customer.mp4",
        roles: ["owner"],
        infoNote: "guide.infoNotes.emailCredentials",
      },
      {
        id: "add-employee",
        videoFile: "add-employee.mp4",
        roles: ["owner"],
        infoNote: "guide.infoNotes.emailCredentials",
      },
      {
        id: "add-farmer",
        videoFile: "add-farmer.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
        infoNote: "guide.infoNotes.emailCredentials",
      },
      {
        id: "add-customer",
        videoFile: "add-customer.mp4",
        roles: ["owner", "employee", "customer"],
        note: "employee-permission",
        infoNote: "guide.infoNotes.emailCredentials",
      },
    ],
  },
  {
    id: "warehouse-management",
    icon: Warehouse,
    features: [
      {
        id: "add-warehouse",
        videoFile: "add-warehouse.mp4",
        roles: ["owner"],
      },
      {
        id: "create-rental-contract-existing-farmer",
        videoFile: "create-rental-contract-existing-farmer.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
      {
        id: "create-rental-contract-new-farmer",
        videoFile: "create-rental-contract-new-farmer.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
    ],
  },
  {
    id: "institution-linking",
    icon: Link2,
    features: [
      {
        id: "send-link-request-owner",
        videoFile: "send-link-request-owner.mp4",
        roles: ["owner"],
      },
      {
        id: "send-link-request-admin",
        videoFile: "send-link-request-admin.mp4",
        roles: ["admin"],
      },
      {
        id: "accept-link-request-admin",
        videoFile: "accept-link-request-admin.mp4",
        roles: ["admin"],
      },
      {
        id: "remove-link-admin",
        videoFile: "remove-link-admin.mp4",
        roles: ["admin"],
      },
    ],
  },
  {
    id: "products-stock",
    icon: Package,
    features: [
      {
        id: "create-product",
        videoFile: "create-product.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
        infoNote: "guide.infoNotes.stockThreshold",
      },
      {
        id: "view-public-product-page",
        videoFile: "view-public-product-page.mp4",
        roles: ["owner", "employee", "public"],
        note: "generate-permission",
      },
      {
        id: "mass-import-products",
        videoFile: "mass-import-products.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
      {
        id: "add-stock",
        videoFile: "add-stock.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
      {
        id: "manage-order-status",
        videoFile: "manage-order-status.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
    ],
  },
  {
    id: "reports",
    icon: BarChart3,
    features: [
      {
        id: "generate-products-report",
        videoFile: "generate-products-report.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
      {
        id: "generate-stock-report",
        videoFile: "generate-stock-report.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
      {
        id: "generate-product-report",
        videoFile: "generate-product-report.mp4",
        roles: ["owner", "employee"],
        note: "employee-permission",
      },
    ],
  },
  {
    id: "farmer-portal",
    icon: Wheat,
    features: [
      {
        id: "view-contracts-farmer",
        videoFile: "view-contracts-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "add-client-farmer",
        videoFile: "add-client-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "trace-product-by-qr-code-farmer",
        videoFile: "trace-product-by-qr-code-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "download-product-excel-report-farmer",
        videoFile: "download-product-excel-report-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "download-product-pdf-report-farmer",
        videoFile: "download-product-pdf-report-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "view-inventory-farmer",
        videoFile: "view-inventory-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "view-sales-farmer",
        videoFile: "view-sales-farmer.mp4",
        roles: ["farmer"],
      },
      {
        id: "check-order-status-farmer",
        videoFile: "check-order-status-farmer.mp4",
        roles: ["farmer"],
      },
    ],
  },
  {
    id: "customer-portal",
    icon: ShoppingCart,
    features: [
      {
        id: "browse-products-and-buy-customer",
        videoFile: "browse-products-and-buy-customer.mp4",
        roles: ["customer"],
      },
      {
        id: "view-order-status-customer",
        videoFile: "view-order-status-customer.mp4",
        roles: ["customer"],
      },
    ],
  },
  {
    id: "public-features",
    icon: Globe,
    features: [
      {
        id: "visit-blog",
        videoFile: "visit-blog.mp4",
        roles: ["public"],
      },
      {
        id: "get-custom-price-for-enterprises",
        videoFile: "get-custom-price-for-enterprises.mp4",
        roles: ["admin"],
      },
    ],
  },
];

const SHARED_ADMIN_SECTION: Section = {
  id: "admin-shared",
  icon: ShieldCheck,
  features: [
    {
      id: "view-warehouse-details-admin",
      videoFile: "view-warehouse-details-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "warehouses-map-view-admin",
      videoFile: "warehouses-map-view-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "filter-warehouses-by-region-admin",
      videoFile: "filter-warehouses-by-region-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "filter-warehouses-by-product-categories-admin",
      videoFile: "filter-warehouses-by-product-categories-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "view-stock-and-products-movement-admin",
      videoFile: "view-stock-and-products-movement-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "export-stock-and-products-movement-report-admin",
      videoFile: "export-stock-and-products-movement-report-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "view-and-manage-alerts-admin",
      videoFile: "view-and-manage-alerts-admin.mp4",
      roles: ["admin"],
    },
    {
      id: "generate-a-report-admin",
      videoFile: "generate-a-report-admin.mp4",
      roles: ["admin"],
    },
  ],
};

const INSTITUTION_SECTIONS: InstitutionSection[] = [
  {
    id: "orsre",
    type: "orsre",
    icon: FileText,
    features: [
      {
        id: "orsre-special-dashboard-overview",
        videoFile: "orsre-special-dashboard-overview.mp4",
        roles: ["orsre"],
      },
      {
        id: "orsre-warehouse-report",
        videoFile: "orsre-warehouse-report.mp4",
        roles: ["orsre"],
      },
    ],
  },
  {
    id: "anida",
    type: "anida",
    icon: Wheat,
    features: [
      {
        id: "anida-special-dashboard-overview",
        videoFile: "anida-special-dashboard-overview.mp4",
        roles: ["anida"],
      },
      {
        id: "anida-revenue-analysis-per-campaign",
        videoFile: "anida-revenue-analysis-per-campaign.mp4",
        roles: ["anida"],
      },
      {
        id: "anida-add-product-label",
        videoFile: "anida-add-product-label.mp4",
        roles: ["anida"],
      },
      {
        id: "change-retention-rate-period-admin",
        videoFile: "change-retention-rate-period-admin.mp4",
        roles: ["anida"],
      },
      {
        id: "customise-employment-goal-admin",
        videoFile: "customise-employment-goal-admin.mp4",
        roles: ["anida"],
      },
    ],
  },
  {
    id: "semig",
    type: "semig",
    icon: TrendingUp,
    features: [
      {
        id: "semig-special-dashboard-overview",
        videoFile: "semig-special-dashboard-overview.mp4",
        roles: ["semig"],
      },
    ],
  },
];

// ─── Lazy Video Component ─────────────────────────────────────────────────────

const LazyVideo = ({ src, title }: { src: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-black/40 border border-border/50"
    >
      {isVisible ? (
        <>
          <video
            ref={videoRef}
            src={src}
            className="w-full h-auto object-contain"
            preload="metadata"
            playsInline
            controls
            onLoadedMetadata={() => setIsLoaded(true)}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
        </>
      ) : (
        <div className="h-48 bg-muted animate-pulse" />
      )}
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────

const RoleBadge = ({ role }: { role: Role }) => {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[role]}`}
    >
      {t(`guide.roles.${role}`)}
    </span>
  );
};

// ─── Feature Card ─────────────────────────────────────────────────────────────

const FeatureCard = ({
  feature,
  sectionId,
}: {
  feature: Feature;
  sectionId: string;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const videoPath = `/videos/guide/${feature.videoFile}`;
  const titleKey = `guide.features.${feature.id}.title`;
  const descKey = `guide.features.${feature.id}.description`;

  return (
    <motion.div
      id={`feature-${feature.id}`}
      className="rounded-xl border border-border bg-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <button
        className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-base text-foreground mb-2">
            {t(titleKey)}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {feature.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
          </div>
          {feature.note && (
            <p className="mt-2 text-xs text-muted-foreground italic">
              {t(`guide.notes.${feature.note}`)}
            </p>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-none mt-0.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(descKey)}
              </p>
              {feature.infoNote && <InfoNote text={t(feature.infoNote)} />}
              <LazyVideo src={videoPath} title={t(titleKey)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Section Block ────────────────────────────────────────────────────────────

const SectionBlock = ({
  section,
  isInstitution = false,
  institutionType,
}: {
  section: Section | InstitutionSection;
  isInstitution?: boolean;
  institutionType?: "orsre" | "anida" | "semig";
}) => {
  const { t } = useTranslation();
  const Icon = section.icon;

  const titleKey = isInstitution
    ? `guide.institutionSections.${section.id}.title`
    : `guide.sections.${section.id}.title`;
  const descKey = isInstitution
    ? `guide.institutionSections.${section.id}.description`
    : `guide.sections.${section.id}.description`;

  const accentClass = institutionType
    ? {
        orsre: "text-cyan-400",
        anida: "text-teal-400",
        semig: "text-indigo-400",
      }[institutionType]
    : "text-primary";

  const bgClass = institutionType
    ? {
        orsre: "bg-cyan-500/10",
        anida: "bg-teal-500/10",
        semig: "bg-indigo-500/10",
      }[institutionType]
    : "bg-primary/10";

  return (
    <div id={`section-${section.id}`} className="scroll-mt-24">
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-2.5 rounded-xl ${bgClass} flex-none`}>
          <Icon className={`h-5 w-5 ${accentClass}`} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground">
            {t(titleKey)}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t(descKey)}</p>
        </div>
      </div>
      <div className="space-y-3">
        {section.features.map((f) => (
          <FeatureCard key={f.id} feature={f} sectionId={section.id} />
        ))}
      </div>
    </div>
  );
};

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const SidebarNav = ({
  activeSection,
  onClose,
}: {
  activeSection: string;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose?.();
  };

  const navItem = (
    id: string,
    Icon: React.ComponentType<{ className?: string }>,
    labelKey: string,
  ) => (
    <button
      key={id}
      onClick={() => scrollTo(id)}
      className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-left ${
        activeSection === id
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
    >
      <Icon className="h-4 w-4 flex-none" />
      <span className="truncate">{t(labelKey)}</span>
      {activeSection === id && (
        <ChevronRight className="h-3 w-3 ml-auto text-primary flex-none" />
      )}
    </button>
  );

  return (
    <nav className="space-y-1">
      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {t("guide.nav.generalFeatures")}
      </p>
      {SECTIONS.map((s) =>
        navItem(s.id, s.icon, `guide.sections.${s.id}.title`),
      )}

      <div className="pt-3">
        <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("guide.nav.institutionDashboard")}
        </p>
        {navItem(
          SHARED_ADMIN_SECTION.id,
          ShieldCheck,
          `guide.sections.${SHARED_ADMIN_SECTION.id}.title`,
        )}
        {INSTITUTION_SECTIONS.map((s) =>
          navItem(s.id, s.icon, `guide.institutionSections.${s.id}.title`),
        )}
      </div>
    </nav>
  );
};

// ─── Search ───────────────────────────────────────────────────────────────────

const SearchBar = ({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("guide.search.placeholder")}
        className="w-full rounded-lg border border-border bg-muted/50 pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

// ─── Role Filter ──────────────────────────────────────────────────────────────

const ROLE_FILTER_OPTIONS: Role[] = [
  "owner",
  "employee",
  "farmer",
  "customer",
  "admin",
];

const RoleFilter = ({
  active,
  onToggle,
}: {
  active: Role | null;
  onToggle: (r: Role) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
        {t("guide.nav.filterByRole")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ROLE_FILTER_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => onToggle(r)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
              active === r
                ? ROLE_COLORS[r]
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
          >
            {t(`guide.roles.${r}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const GuidePage = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Track active section via scroll
  useEffect(() => {
    const allSectionIds = [
      ...SECTIONS.map((s) => s.id),
      SHARED_ADMIN_SECTION.id,
      ...INSTITUTION_SECTIONS.map((s) => s.id),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("section-", "");
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    allSectionIds.forEach((id) => {
      const el = document.getElementById(`section-${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleRoleFilter = (r: Role) => {
    setRoleFilter((prev) => (prev === r ? null : r));
  };

  // Filter features based on search + role
  const filterFeature = (feature: Feature): boolean => {
    const matchesRole = roleFilter ? feature.roles.includes(roleFilter) : true;
    if (!matchesRole) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleKey = `guide.features.${feature.id}.title`;
    // We can only match on the id itself in JS (translations resolved in render)
    const title = t(titleKey).toLowerCase();
    const desc = t(`guide.features.${feature.id}.description`).toLowerCase();
    return (
      title.includes(q) ||
      desc.includes(q) ||
      feature.id.toLowerCase().includes(q)
    );
  };

  const filterSection = (section: Section | InstitutionSection) =>
    section.features.filter(filterFeature);

  const allSections: (Section | InstitutionSection)[] = [
    ...SECTIONS,
    SHARED_ADMIN_SECTION,
    ...INSTITUTION_SECTIONS,
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-16">
        {/* Page Hero */}
        <div className="border-b border-border bg-card/40">
          <div className="container mx-auto px-4 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                {t("guide.hero.eyebrow")}
              </span>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mt-2 mb-3">
                {t("guide.hero.title")}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {t("guide.hero.subtitle")}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-64 flex-none">
              <div className="sticky top-24 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery("")}
                />
                <RoleFilter active={roleFilter} onToggle={toggleRoleFilter} />
                <SidebarNav activeSection={activeSection} />
              </div>
            </aside>

            {/* ── Mobile Sidebar Toggle ── */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <Button
                size="sm"
                className="rounded-full shadow-xl gap-2"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
                {t("guide.nav.menu")}
              </Button>
            </div>

            {/* ── Mobile Sidebar Drawer ── */}
            <AnimatePresence>
              {mobileSidebarOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileSidebarOpen(false)}
                  />
                  <motion.div
                    className="fixed inset-y-0 left-0 w-80 bg-background border-r border-border z-50 lg:hidden overflow-y-auto p-5"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-heading font-bold text-foreground">
                        {t("guide.nav.navigation")}
                      </span>
                      <button onClick={() => setMobileSidebarOpen(false)}>
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    </div>
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onClear={() => setSearchQuery("")}
                    />
                    <RoleFilter
                      active={roleFilter}
                      onToggle={toggleRoleFilter}
                    />
                    <SidebarNav
                      activeSection={activeSection}
                      onClose={() => setMobileSidebarOpen(false)}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <main className="flex-1 min-w-0 space-y-16">
              {/* General Sections */}
              {SECTIONS.map((section) => {
                const filtered = filterSection(section);
                if (filtered.length === 0) return null;
                return (
                  <SectionBlock
                    key={section.id}
                    section={{ ...section, features: filtered }}
                  />
                );
              })}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border" />
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {t("guide.sections.institutionDivider")}
                  </span>
                </div>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Shared Admin */}
              {(() => {
                const filtered = filterSection(SHARED_ADMIN_SECTION);
                if (filtered.length === 0) return null;
                return (
                  <SectionBlock
                    section={{ ...SHARED_ADMIN_SECTION, features: filtered }}
                  />
                );
              })()}

              {/* Institution-specific */}
              {INSTITUTION_SECTIONS.map((section) => {
                const filtered = filterSection(section);
                if (filtered.length === 0) return null;
                return (
                  <SectionBlock
                    key={section.id}
                    section={{ ...section, features: filtered }}
                    isInstitution
                    institutionType={section.type}
                  />
                );
              })}

              {/* Empty state */}
              {allSections.every((s) => filterSection(s).length === 0) && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    {t("guide.search.noResults")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setRoleFilter(null);
                    }}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    {t("guide.search.clearFilters")}
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const InfoNote = ({ text }: { text: string }) => (
  <div className="flex gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2.5 mt-3">
    <Info className="h-4 w-4 text-primary flex-none mt-0.5" />
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

export default GuidePage;
