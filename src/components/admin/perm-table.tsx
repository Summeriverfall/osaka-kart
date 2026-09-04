import { b2Copy } from "@/lib/admin/b2-copy";
import { PERM_MODULES, type MockRole, type PermFlags, type PermModule } from "@/lib/mock/permissions";

export function moduleLabel(id: PermModule, locale: string) {
  const map: Record<PermModule, { zh: string; en: string; ja: string }> = {
    dashboard: { zh: "仪表盘", en: "Dashboard", ja: "ダッシュボード" },
    orders: { zh: "订单", en: "Orders", ja: "注文" },
    calendar: { zh: "日历", en: "Calendar", ja: "カレンダー" },
    inventory: { zh: "库存", en: "Inventory", ja: "在庫" },
    vehicles: { zh: "车辆", en: "Vehicles", ja: "車両" },
    plans: { zh: "套餐", en: "Plans", ja: "コース" },
    addons: { zh: "附加项", en: "Add-ons", ja: "オプション" },
    content: { zh: "内容", en: "Content", ja: "コンテンツ" },
    affiliates: { zh: "推广代理", en: "Affiliates", ja: "アフィリエイト" },
    reports: { zh: "报表", en: "Reports", ja: "レポート" },
    staff: { zh: "员工", en: "Staff", ja: "スタッフ" },
    settings: { zh: "系统设置", en: "Settings", ja: "設定" },
    site: { zh: "全站配置", en: "Site", ja: "サイト設定" },
    permissions: { zh: "权限", en: "Permissions", ja: "権限" },
  };
  if (locale.startsWith("ja")) return map[id].ja;
  if (locale.startsWith("en")) return map[id].en;
  return map[id].zh;
}

export function roleLabel(item: MockRole, locale: string) {
  if (locale.startsWith("ja")) return item.nameJa || item.name;
  if (locale.startsWith("en")) return item.nameEn || item.name;
  return item.name;
}

export function cloneRole(row: MockRole): MockRole {
  return {
    ...row,
    perms: Object.fromEntries(PERM_MODULES.map((mod) => [mod.id, { ...row.perms[mod.id] }])) as MockRole["perms"],
  };
}

export function PermTable({
  flags,
  locked,
  locale,
  b2,
  allow,
  onChange,
}: {
  flags: Record<PermModule, PermFlags>;
  locked?: boolean;
  locale: string;
  b2: ReturnType<typeof b2Copy>;
  allow?: Record<PermModule, PermFlags>;
  onChange: (mod: PermModule, next: PermFlags) => void;
}) {
  return (
    <table className="perm-table">
      <thead>
        <tr>
          <th>{b2.permModCol}</th>
          <th>{b2.permView}</th>
          <th>{b2.permEdit}</th>
        </tr>
      </thead>
      <tbody>
        {PERM_MODULES.map((mod) => {
          const row = flags[mod.id];
          const cap = allow?.[mod.id];
          return (
            <tr key={mod.id}>
              <td>{moduleLabel(mod.id, locale)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={row.view}
                  disabled={locked || (cap ? !cap.view : false)}
                  aria-label={`${moduleLabel(mod.id, locale)} ${b2.permView}`}
                  onChange={(event) =>
                    onChange(mod.id, { view: event.target.checked, edit: event.target.checked ? row.edit : false })
                  }
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.edit}
                  disabled={locked || (cap ? !cap.edit : false)}
                  aria-label={`${moduleLabel(mod.id, locale)} ${b2.permEdit}`}
                  onChange={(event) =>
                    onChange(mod.id, { view: event.target.checked || row.view, edit: event.target.checked })
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
