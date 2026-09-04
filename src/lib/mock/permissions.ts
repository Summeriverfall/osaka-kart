export type PermModule =
  | "dashboard"
  | "orders"
  | "calendar"
  | "inventory"
  | "vehicles"
  | "plans"
  | "addons"
  | "content"
  | "affiliates"
  | "reports"
  | "staff"
  | "settings"
  | "site"
  | "permissions";

export type PermFlags = { view: boolean; edit: boolean };

export const PERM_MODULES: { id: PermModule; parent?: PermModule }[] = [
  { id: "dashboard" },
  { id: "orders" },
  { id: "calendar" },
  { id: "inventory" },
  { id: "vehicles" },
  { id: "plans" },
  { id: "addons", parent: "plans" },
  { id: "content" },
  { id: "affiliates" },
  { id: "reports" },
  { id: "staff" },
  { id: "settings" },
  { id: "site" },
  { id: "permissions" },
];

export type MockRole = {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  builtin?: "admin" | "manager" | "staff";
  perms: Record<PermModule, PermFlags>;
};

function all(on: boolean): Record<PermModule, PermFlags> {
  return Object.fromEntries(PERM_MODULES.map((item) => [item.id, { view: on, edit: on }])) as Record<
    PermModule,
    PermFlags
  >;
}

function mix(
  base: Record<PermModule, PermFlags>,
  patch: Partial<Record<PermModule, PermFlags>>,
): Record<PermModule, PermFlags> {
  return { ...base, ...patch };
}

const STAFF_PERMS = mix(all(false), {
  dashboard: { view: true, edit: false },
  orders: { view: true, edit: true },
  calendar: { view: true, edit: false },
  inventory: { view: true, edit: false },
});

const MANAGER_PERMS = mix(all(true), {
  settings: { view: false, edit: false },
  site: { view: false, edit: false },
  staff: { view: true, edit: true },
  permissions: { view: true, edit: true },
});

export const MOCK_ROLES: MockRole[] = [
  {
    id: "role-admin",
    name: "超管",
    nameEn: "Admin",
    nameJa: "管理者",
    builtin: "admin",
    perms: all(true),
  },
  {
    id: "role-manager",
    name: "店长",
    nameEn: "Manager",
    nameJa: "店長",
    builtin: "manager",
    perms: MANAGER_PERMS,
  },
  {
    id: "role-staff",
    name: "员工",
    nameEn: "Staff",
    nameJa: "スタッフ",
    builtin: "staff",
    perms: STAFF_PERMS,
  },
];

export function blankRole(): MockRole {
  return {
    id: `role-${Date.now().toString(36)}`,
    name: "",
    nameEn: "",
    nameJa: "",
    perms: mix(all(false), { dashboard: { view: true, edit: false } }),
  };
}

export function mergePerms(
  role: MockRole | undefined,
  overrides?: Partial<Record<PermModule, PermFlags>>,
): Record<PermModule, PermFlags> {
  const base = role?.perms ?? STAFF_PERMS;
  if (!overrides) return base;
  const next = { ...base };
  for (const key of Object.keys(overrides) as PermModule[]) {
    next[key] = { ...base[key], ...overrides[key] };
  }
  return next;
}

export function refreshBuiltinRoles(list?: MockRole[]) {
  const current = list ?? [];
  const custom = current.filter((item) => !item.builtin);
  const byId = new Map(current.map((item) => [item.id, item]));
  return [
    ...MOCK_ROLES.map((seed) => {
      const prev = byId.get(seed.id);
      if (!prev) return seed;
      return {
        ...prev,
        ...seed,
        name: prev.name || seed.name,
        nameEn: prev.nameEn || seed.nameEn,
        nameJa: prev.nameJa || seed.nameJa,
        perms: seed.perms,
      };
    }),
    ...custom,
  ];
}

export function rankFromBuiltin(builtin?: string | null) {
  if (builtin === "admin") return 3;
  if (builtin === "manager") return 2;
  return 1;
}

export function rankOfRole(role?: MockRole) {
  return rankFromBuiltin(role?.builtin);
}

export function capPermsByActor(
  flags: Record<PermModule, PermFlags>,
  actor: Record<PermModule, PermFlags>,
): Record<PermModule, PermFlags> {
  return Object.fromEntries(
    PERM_MODULES.map((mod) => {
      const want = flags[mod.id] ?? { view: false, edit: false };
      const mine = actor[mod.id] ?? { view: false, edit: false };
      const view = Boolean(want.view && mine.view);
      const edit = Boolean(want.edit && mine.edit && view);
      return [mod.id, { view, edit }];
    }),
  ) as Record<PermModule, PermFlags>;
}

export function permDiff(
  role: MockRole,
  flags: Record<PermModule, PermFlags>,
): Partial<Record<PermModule, PermFlags>> {
  const out: Partial<Record<PermModule, PermFlags>> = {};
  for (const mod of PERM_MODULES) {
    const a = flags[mod.id];
    const b = role.perms[mod.id];
    if (a.view !== b.view || a.edit !== b.edit) out[mod.id] = { ...a };
  }
  return out;
}

export function moduleFromHref(href: string): PermModule {
  if (href.startsWith("/admin/orders") || href === "/admin/bookings") return "orders";
  if (href.startsWith("/admin/calendar")) return "calendar";
  if (href.startsWith("/admin/inventory")) return "inventory";
  if (href.startsWith("/admin/vehicles")) return "vehicles";
  if (href.startsWith("/admin/plans") || href.startsWith("/admin/addons")) return "plans";
  if (href.startsWith("/admin/content")) return "content";
  if (href.startsWith("/admin/affiliates")) return "affiliates";
  if (href.startsWith("/admin/reports")) return "reports";
  if (href.startsWith("/admin/staff")) return "staff";
  if (href.startsWith("/admin/settings")) return "settings";
  if (href.startsWith("/admin/site")) return "site";
  if (href.startsWith("/admin/permissions")) return "permissions";
  return "dashboard";
}
