export type AdminCopy = {
  brandSub: string;
  header: string;
  logout: string;
  entering: string;
  goLogin: string;
  loginTitle: string;
  loginLead: string;
  loginHintAdmin: string;
  loginHintManager: string;
  loginHintAny: string;
  loginAs: string;
  loginOnly: string;
  passwordPh: string;
  login: string;
  nambaStore: string;
  langZh: string;
  langJa: string;
  super: string;
  manager: string;
  orderDetail: string;
  orderLead: (id: string) => string;
  nav: Record<string, string>;
  pages: Record<string, { title: string; lead: string }>;
  plans: {
    add: string;
    edit: string;
    save: string;
    saved: string;
    copyHint: string;
    copy: string;
    name: string;
    intro: string;
    highlights: string;
    highlightHint: string;
    zh: string;
    en: string;
    ja: string;
    ko: string;
    cover: string;
    coverHint: string;
    route: string;
    routeHint: string;
    routeEmpty: string;
    upload: string;
    restore: string;
    remove: string;
    next: string;
    slug: string;
    price: string;
    duration: string;
    distance: string;
    addons: string;
    addonsHint: string;
    listed: string;
    unfilled: string;
    notUploaded: string;
    minutes: string;
    km: string;
    limitHint: string;
    errSize: string;
    errSmall: string;
    errLarge: string;
    errType: string;
    errFail: string;
  };
};

const zh: AdminCopy = {
  brandSub: "管理后台",
  header: "大阪卡丁车运营后台",
  logout: "退出",
  entering: "正在进入登录…",
  goLogin: "去登录",
  loginTitle: "管理后台登录",
  loginLead: "管理后台登录",
  loginHintAdmin: "超管：admin@test.com（仪表盘默认全店合计，可点进分店）",
  loginHintManager: "店长：manager@test.com（绑定难波本店）",
  loginHintAny: "任意密码都能登录。当前将以「{role}」进入",
  loginAs: "当前将以「{role}」进入",
  loginOnly: "，只能查看「{store}」",
  passwordPh: "任意密码",
  login: "登录",
  nambaStore: "难波本店",
  langZh: "中文",
  langJa: "日本語",
  super: "超管",
  manager: "店长",
  orderDetail: "订单详情",
  orderLead: (id) => `预约号 ${id}`,
  nav: {
    "/admin/dashboard": "仪表盘",
    "/admin/orders": "订单管理",
    "/admin/calendar": "日历",
    "/admin/inventory": "库存管理",
    "/admin/vehicles": "车辆管理",
    "/admin/plans": "套餐管理",
    "/admin/reports": "财务报表",
    "/admin/staff": "员工管理",
    "/admin/settings": "系统设置",
  },
  pages: {
    "/admin/dashboard": { title: "仪表盘", lead: "超管默认看全店合计，点分店可下钻。店长只看自己的店。" },
    "/admin/orders": { title: "订单管理", lead: "列表处理订单。点状态可直接改，不必进详情。" },
    "/admin/calendar": { title: "日历", lead: "月 / 周 / 日看订单分布。点日期下钻到当天列表。" },
    "/admin/inventory": { title: "库存管理", lead: "车辆时间轴。色块看出松紧，点击或拖拽即可改库存。" },
    "/admin/vehicles": { title: "车辆管理", lead: "10 辆车。维修中的会从当日库存扣除。" },
    "/admin/plans": { title: "套餐管理", lead: "编辑前台卡片：标题图、说明图、介绍与亮点，以及价格、时长和附加项。" },
    "/admin/reports": { title: "财务报表", lead: "营收趋势、渠道占比、用户画像。" },
    "/admin/staff": { title: "员工管理", lead: "超管可添加、改角色、重置密码和停用。" },
    "/admin/settings": { title: "系统设置", lead: "点标签跳到对应区块。手机上表格改成卡片，避免左右撑破。" },
    "/admin/settings/logs": { title: "操作日志详情", lead: "查看全部后台操作记录。" },
  },
  plans: {
    add: "添加套餐",
    edit: "编辑套餐",
    save: "保存",
    saved: "套餐已保存。图片存在本机，换电脑或清缓存需重新上传。",
    copyHint: "收起时只显示名称、介绍、亮点。点开某一项，在里面一次填中文、英文、日文、韩文。",
    copy: "文案",
    name: "名称",
    intro: "介绍",
    highlights: "亮点",
    highlightHint: "每种语言每行一条，前台最多显示 3 条。",
    zh: "中文",
    en: "英文",
    ja: "日文",
    ko: "韩文",
    cover: "标题图片",
    coverHint: "套餐卡顶部大图，建议 16:9（约 1600×900）。不上传则用默认街景。",
    route: "说明图片（路线图）",
    routeHint: "难波、通天阁、大阪城三个原套餐有自带路线图，不上传就用自带的。其他套餐不上传则前台不显示。",
    routeEmpty: "未上传。前台不会显示路线图。",
    upload: "上传图片",
    restore: "恢复默认",
    remove: "移除",
    next: "下一项",
    slug: "网址代号",
    price: "价格（日元）",
    duration: "时长（分钟）",
    distance: "距离（公里）",
    addons: "可购附加项",
    addonsHint: "勾选后，前台预订该套餐时才能买这一项。",
    listed: "上架",
    unfilled: "未填写",
    notUploaded: "尚未上传",
    minutes: "分钟",
    km: "公里",
    limitHint: "宽和高均不少于 600px，最长边不超过 4000px，文件不超过 2MB。",
    errSize: "图片文件不能超过 2MB",
    errSmall: "图片太小，宽和高都要至少 600px",
    errLarge: "图片太大，最长边不能超过 4000px",
    errType: "请上传 jpg、png 或 webp 图片",
    errFail: "图片读取失败，请换一张再试",
  },
};

const ja: AdminCopy = {
  brandSub: "管理画面",
  header: "大阪カート運営管理",
  logout: "ログアウト",
  entering: "ログインへ移動中…",
  goLogin: "ログイン",
  loginTitle: "管理画面ログイン",
  loginLead: "管理画面ログイン",
  loginHintAdmin: "管理者：admin@test.com（ダッシュボードは全店舗合計。店舗を選べます）",
  loginHintManager: "店長：manager@test.com（難波本店に固定）",
  loginHintAny: "パスワードは任意です。いまは「{role}」で入ります",
  loginAs: "いまは「{role}」で入ります",
  loginOnly: "。「{store}」のみ表示します",
  passwordPh: "任意のパスワード",
  login: "ログイン",
  nambaStore: "難波本店",
  langZh: "中文",
  langJa: "日本語",
  super: "管理者",
  manager: "店長",
  orderDetail: "予約詳細",
  orderLead: (id) => `予約番号 ${id}`,
  nav: {
    "/admin/dashboard": "ダッシュボード",
    "/admin/orders": "予約管理",
    "/admin/calendar": "カレンダー",
    "/admin/inventory": "在庫管理",
    "/admin/vehicles": "車両管理",
    "/admin/plans": "コース管理",
    "/admin/reports": "売上レポート",
    "/admin/staff": "スタッフ",
    "/admin/settings": "設定",
  },
  pages: {
    "/admin/dashboard": { title: "ダッシュボード", lead: "管理者は全店舗合計。店舗をクリックすると絞り込めます。店長は自店のみ。" },
    "/admin/orders": { title: "予約管理", lead: "一覧でステータスを変更できます。詳細を開く必要はありません。" },
    "/admin/calendar": { title: "カレンダー", lead: "月／週／日で予約を確認。日付を押すとその日の一覧へ。" },
    "/admin/inventory": { title: "在庫管理", lead: "車両タイムライン。色で空きを見て、クリックやドラッグで在庫を変更。" },
    "/admin/vehicles": { title: "車両管理", lead: "10台。整備中は当日在庫から外れます。" },
    "/admin/plans": { title: "コース管理", lead: "カードの見出し画像・ルート図・紹介文、価格と所要時間、オプションを編集。" },
    "/admin/reports": { title: "売上レポート", lead: "売上推移、流入元、お客さまの傾向。" },
    "/admin/staff": { title: "スタッフ", lead: "追加、権限変更、パスワード再設定、停止。" },
    "/admin/settings": { title: "設定", lead: "タブで該当ブロックへ。スマホでは表をカード表示にします。" },
    "/admin/settings/logs": { title: "操作ログ", lead: "管理画面の操作履歴。" },
  },
  plans: {
    add: "コースを追加",
    edit: "コースを編集",
    save: "保存",
    saved: "保存しました。画像はこのブラウザにあります。別の端末では再アップロードが必要です。",
    copyHint: "閉じると「名称・紹介・ハイライト」だけ見えます。開くと中・英・日・韓をまとめて入力できます。",
    copy: "文言",
    name: "名称",
    intro: "紹介",
    highlights: "ハイライト",
    highlightHint: "言語ごとに1行1項目。カードでは最大3件。",
    zh: "中国語",
    en: "英語",
    ja: "日本語",
    ko: "韓国語",
    cover: "見出し画像",
    coverHint: "カード上部の写真。16:9（約1600×900）推奨。未設定ならデフォルト写真。",
    route: "ルート図",
    routeHint: "難波・通天閣・大阪城の3コースは標準ルート図あり。他コースは未設定なら表示しません。",
    routeEmpty: "未設定。サイトにルート図は出ません。",
    upload: "画像をアップロード",
    restore: "標準に戻す",
    remove: "削除",
    next: "次へ",
    slug: "URLコード",
    price: "料金（円）",
    duration: "所要時間（分）",
    distance: "距離（km）",
    addons: "購入できるオプション",
    addonsHint: "チェックした項目だけ、このコースの予約で選べます。",
    listed: "掲載中",
    unfilled: "未入力",
    notUploaded: "未アップロード",
    minutes: "分",
    km: "km",
    limitHint: "幅・高さはともに600px以上、長辺は4000px以下、ファイルは2MB以下。",
    errSize: "画像は2MB以下にしてください",
    errSmall: "画像が小さすぎます。幅・高さはともに600px以上",
    errLarge: "画像が大きすぎます。長辺は4000px以下",
    errType: "jpg / png / webp をアップロードしてください",
    errFail: "画像を読み込めませんでした。別のファイルをお試しください",
  },
};

export function adminCopy(locale: string): AdminCopy {
  return locale.startsWith("ja") ? ja : zh;
}

export function adminRoleLabel(locale: string, role: "admin" | "manager") {
  const copy = adminCopy(locale);
  return role === "admin" ? copy.super : copy.manager;
}
