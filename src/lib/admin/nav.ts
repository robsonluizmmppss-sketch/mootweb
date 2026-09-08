import type { Role } from "@prisma/client";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string; // nome do ícone lucide (resolvido em <AdminIcon />)
  minRole?: Role;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

/**
 * Estrutura do menu lateral do painel — espelha a especificação "MENU ADMIN".
 * A maioria das rotas de CRUD é servida pelo motor genérico em
 * `src/app/(admin)/admin/[resource]`.
 */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "Visão geral",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    ],
  },
  {
    title: "Conteúdo",
    items: [
      { label: "Projetos", href: "/admin/projetos", icon: "FolderKanban" },
      { label: "Categorias", href: "/admin/categorias", icon: "Tags" },
      { label: "Tecnologias", href: "/admin/tecnologias", icon: "Cpu" },
      { label: "Portfólio", href: "/admin/portfolio", icon: "GalleryHorizontalEnd" },
      { label: "Serviços", href: "/admin/servicos", icon: "Boxes" },
      { label: "Processo", href: "/admin/processo", icon: "Workflow" },
      { label: "Blog", href: "/admin/blog", icon: "Newspaper" },
      { label: "Landing Pages", href: "/admin/landing-pages", icon: "LayoutTemplate" },
      { label: "FAQ", href: "/admin/faq", icon: "HelpCircle" },
      { label: "Páginas & Seções", href: "/admin/paginas", icon: "FileStack" },
    ],
  },
  {
    title: "Relacionamento",
    items: [
      { label: "Clientes", href: "/admin/clientes", icon: "Building2" },
      { label: "Depoimentos", href: "/admin/depoimentos", icon: "Quote" },
      { label: "Equipe", href: "/admin/equipe", icon: "Users" },
      { label: "Parceiros", href: "/admin/parceiros", icon: "Handshake" },
    ],
  },
  {
    title: "Comercial",
    items: [
      { label: "Leads (CRM)", href: "/admin/leads", icon: "Target" },
      { label: "Orçamentos", href: "/admin/orcamentos", icon: "FileSpreadsheet" },
      { label: "Mensagens", href: "/admin/mensagens", icon: "MailOpen" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: "Megaphone" },
      { label: "Popups", href: "/admin/popups", icon: "MessageSquareWarning" },
      { label: "CTA", href: "/admin/cta", icon: "MousePointerClick" },
      { label: "SEO", href: "/admin/seo", icon: "Search" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { label: "Menu", href: "/admin/menu", icon: "ListTree" },
      { label: "Mídias & Arquivos", href: "/admin/midias", icon: "Image" },
      { label: "Configurações", href: "/admin/configuracoes", icon: "Settings", minRole: "ADMIN" },
      { label: "Usuários", href: "/admin/usuarios", icon: "ShieldCheck", minRole: "ADMIN" },
      { label: "Backup", href: "/admin/backup", icon: "DatabaseBackup", minRole: "ADMIN" },
      { label: "Logs", href: "/admin/logs", icon: "ScrollText", minRole: "ADMIN" },
    ],
  },
];
