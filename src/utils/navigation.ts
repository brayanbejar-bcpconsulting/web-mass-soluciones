/**
 * Utilidades centralizadas de navegación
 * Evita duplicación de lógica entre Header, SubHeader y NavMobile
 */

export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  children?: {
    name: string;
    href: string;
    description?: string;
  }[];
}

export interface ClientTab {
  name: string;
  href: string;
  icon: string;
  active: boolean;
  description: string;
}

/**
 * Opciones de navegación principal
 */
export const NAV_OPTIONS: NavItem[] = [
  { name: "Inicio", href: "/", iconName: "home" },
  { name: "Nosotros", href: "/nosotros", iconName: "users" },
  {
    name: "Beneficios",
    href: "/beneficios",
    iconName: "check-circle",
    children: [
      {
        name: "Cupón de bienvenida",
        href: "/beneficios/cupones",
        description: "Mejora tu tipo de cambio desde tu primera operación",
      },
      {
        name: "Programa de referidos",
        href: "/beneficios/referidos",
        description: "Gana beneficios invitando a tus amigos",
      },
    ],
  },
  { name: "Ayuda y Soporte", href: "/ayuda", iconName: "help-circle" },
  { name: "Blog", href: "/blog", iconName: "list" },
];


/**
 * Configuración de URLs de la aplicación
 */

const URL_APP_MD = "https://app.market-dollar.com/";

export const APP_URLS = {
  login: `${URL_APP_MD}login`,
  register: `${URL_APP_MD}register`,
  whatsappSupport:
    "https://wa.me/51933214054?text=Hola%2C%20buen%20d%C3%ADa.%20Me%20contacto%20con%20el%20equipo%20de%20Market%20Dollar%20porque%20he%20tenido%20un%20inconveniente%20durante%20mi%20experiencia%20y%20requiero%20de%20su%20asistencia.%20Agradecer%C3%ADa%20mucho%20que%20pudieran%20ayudarme%20a%20resolverlo%20lo%20antes%20posible.%20Quedo%20a%20la%20espera%20de%20su%20respuesta.",
  whatsappContact:
    "https://wa.me/51933214054?text=Hola%2C%20buen%20d%C3%ADa.%20Me%20comunico%20con%20el%20equipo%20de%20Market%20Dollar%20para%20solicitar%20asesor%C3%ADa%20sobre%20el%20sistema.%20Quedo%20atento(a).%20%C2%A1Gracias!",
} as const;

/**
 * Normaliza el pathname eliminando trailing slash
 */
export function normalizePath(pathname: string): string {
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
}

/**
 * Verifica si un href está activo basado en el pathname actual
 */
export function isActive(href: string, pathname: string): boolean {
  if (href === "/" && pathname !== "/") return false;
  const cleanPath = normalizePath(pathname);
  const cleanHref = normalizePath(href);
  return cleanPath === cleanHref;
}

/**
 * Genera los tabs de tipo de cliente con estado activo
 */
export function getClientTabs(pathname: string): ClientTab[] {
  const normalizedPath = normalizePath(pathname);
  const isEmpresas =
    normalizedPath === "/empresas" || normalizedPath.startsWith("/empresas/");
  const isPersonas =
    !isEmpresas && (normalizedPath === "/" || normalizedPath === "");

  return [
    {
      name: "Personas",
      href: "/",
      icon: "user",
      active: isPersonas,
      description: "Servicios para personas naturales",
    },
    {
      name: "Empresas",
      href: "/empresas",
      icon: "users",
      active: isEmpresas,
      description: "Servicios para empresas con RUC",
    },
  ];
}

/**
 * Badges de confianza
 */
export const TRUST_BADGES = [
  { text: "+1,000 usuarios registrados", icon: "check-circle" },
  { text: "Operaciones verificadas", icon: "shield-check" },
] as const;