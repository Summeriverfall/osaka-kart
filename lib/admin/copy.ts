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
  common: {
    save: string;
    cancel: string;
    close: string;
    edit: string;
    add: string;
    confirm: string;
    back: string;
    all: string;
    none: string;
    actions: string;
    paid: string;
    unpaid: string;
    undecided: string;
    notOpen: string;
    wan: string;
  };
  store: {
    all: string;
    allSum: string;
    open: string;
    reserved: string;
    switchAria: string;
    locked: string;
    shops: string;
    backAll: string;
    viewing: string;
    viewingAll: string;
  };
  storeNames: Record<string, string>;
  storeAddresses: Record<string, string>;
  orderStatus: Record<string, string>;
  channel: Record<string, string>;
  vehicleStatus: Record<string, string>;
  staffRole: Record<string, string>;
  daypart: Record<string, string>;
  gender: { male: string; female: string };
  nation: Record<string, string>;
  logType: Record<string, string>;
  logRole: Record<string, string>;
  mailType: Record<string, string>;
  mailLocale: Record<string, string>;
  payName: Record<string, string>;
  reports: {
    today: string;
    week: string;
    month: string;
    custom: string;
    switched: (label: string) => string;
    from: string;
    to: string;
    customHint: string;
    rangeCaption: string;
    revenue: string;
    orderCount: string;
    aov: string;
    refunds: string;
    trend: (days: number) => string;
    trendMobile: string;
    current: string;
    previous: string;
    channels: string;
    channel: string;
    orders: string;
    revenueCol: string;
    cut: string;
    net: string;
    channelCard: (orders: number, cut: number, net: string) => string;
    plans: string;
    plan: string;
    sold: string;
    share: string;
    planCard: (sold: number, share: number) => string;
    nations: string;
    genderTitle: string;
    ages: string;
    people: string;
    daypartTitle: string;
    exportCsv: string;
    exportOk: string;
    unitOrders: string;
  };
  dashboard: {
    todayOrders: string;
    todayRevenue: string;
    pending: string;
    freeKarts: string;
    allSum: string;
    vsYesterday: string;
    storeRevenue: string;
    needHandle: string;
    noPending: string;
    kartsOk: (free: number, total: number) => string;
    count: (n: number) => string;
    newOrder: string;
    inventory: string;
    reports: string;
    staff: string;
    branches: string;
    todayLine: (orders: number, yen: string) => string;
    pendingKarts: (pending: number, karts: number) => string;
    timeline: string;
    emptyAll: string;
    emptyStore: string;
    orderMeta: (customer: string, riders: number, yen: string) => string;
    people: string;
    shortcuts: string;
    mobileHint: string;
    weekChart: string;
    chartOrders: string;
    managerStaff: string;
    managerReport: string;
  };
  orders: {
    date: string;
    today: string;
    allDates: string;
    search: string;
    allStatus: string;
    add: string;
    filtering: (date: string, n: number) => string;
    allDatesCount: (n: number) => string;
    allChannels: string;
    id: string;
    channel: string;
    time: string;
    customer: string;
    plan: string;
    riders: string;
    amount: string;
    status: string;
    ops: string;
    empty: string;
    mf: (male: number, female: number) => string;
    channelChip: (label: string, n: number) => string;
    edit: string;
    refund: string;
    confirm: string;
    detail: string;
    saved: string;
    editTitle: string;
    addTitle: string;
    customerName: string;
    email: string;
    passport: string;
    note: string;
    detailTitle: (id: string) => string;
    addons: string;
    phone: string;
    nationality: string;
    refundTitle: string;
    refundOk: string;
    refundLead: (id: string, name: string) => string;
    refundNote: string;
  };
  calendar: {
    month: string;
    week: string;
    threeDay: string;
    day: string;
    prev: string;
    next: string;
    dayOrders: (iso: string) => string;
    count: (n: number) => string;
    empty: string;
    drill: string;
    heatOrders: string;
    heatStock: string;
    dayHint: (iso: string) => string;
    time: string;
    compactHint: string;
    weekHint: string;
    minutes: (n: number) => string;
  };
  inventory: {
    free: string;
    tight: string;
    full: string;
    idle: string;
    remain: (left: number, cap: number) => string;
    yest: string;
    today: string;
    tom: string;
    filter: string;
    filtered: string;
    closeFilter: string;
    vehiclePh: string;
    allStatus: string;
    stAvail: string;
    stRepair: string;
    stRetired: string;
    special: string;
    clearToday: string;
    reset: string;
    vehicle: string;
    collapse: string;
    expand: string;
    idleLong: string;
    mergeHint: string;
    tipCap: (cap: number, booked: number, left: number, tone: string) => string;
    tipClosed: string;
    tipGuests: (names: string) => string;
    noGuests: string;
    editTitle: (code: string) => string;
    saved: string;
    slot: string;
    seats: string;
    booked: string;
    status: string;
    open: string;
    closed: string;
    batchTitle: (n: number) => string;
    setRepair: string;
    setOpen: string;
    batchLead: string;
    clearAsk: string;
    resetAsk: string;
    clearOk: string;
    resetOk: string;
    clearLead: string;
    resetLead: string;
    closeSpecial: string;
    specialAdded: string;
    date: string;
    reason: string;
    reasonPh: string;
    type: string;
    closeDay: string;
    extra: string;
  };
  vehicles: {
    repairNote: (n: number) => string;
    add: string;
    code: string;
    model: string;
    status: string;
    service: string;
    note: string;
    logs: string;
    title: string;
    saved: string;
    logsTitle: (code: string) => string;
  };
  staff: {
    add: string;
    name: string;
    email: string;
    role: string;
    store: string;
    status: string;
    lastLogin: string;
    on: string;
    off: string;
    reset: string;
    title: string;
    saved: string;
    password: string;
    passwordPh: string;
    resetAsk: string;
    offAsk: string;
    resetOk: string;
    offOk: string;
    demo: string;
  };
  settings: {
    tabPay: string;
    tabStores: string;
    tabSend: string;
    tabMail: string;
    tabLogs: string;
    pay: string;
    reserved: string;
    on: string;
    off: string;
    testMode: string;
    paySaved: string;
    savePay: string;
    stores: string;
    addStore: string;
    send: string;
    sendLead: string;
    mailFrom: string;
    mailTo: string;
    mailToPh: string;
    sendSaved: string;
    testing: string;
    testSend: string;
    templates: string;
    type: string;
    locale: string;
    updated: string;
    logs: string;
    detail: string;
    tplTitle: (type: string, locale: string) => string;
    tplEdit: string;
    tplSaved: string;
    tplVars: string;
    storeTitle: string;
    storeSaved: string;
    storeName: string;
    address: string;
    phone: string;
    hours: string;
  };
  logsPage: {
    title: string;
    back: string;
    allActors: string;
    allTypes: string;
    recent: (shown: number, extra?: number) => string;
    total: (n: number) => string;
    time: string;
    actor: string;
    role: string;
    type: string;
    detail: string;
    empty: string;
  };
  addons: {
    add: string;
    max: (n: number) => string;
    editTitle: string;
    addTitle: string;
    saved: string;
    nameZh: string;
    desc: string;
    price: string;
    maxQty: string;
    icon: string;
    camera: string;
    costume: string;
    photos: string;
    insurance: string;
    delAsk: string;
    think: string;
    del: string;
    deleted: string;
    delLead: string;
  };
  roleGate: { title: string; lead: string };
  notify: {
    status: (label: string) => string;
    statusNoMail: (label: string) => string;
    statusOk: (label: string, extra: string) => string;
    statusFail: (label: string, extra: string) => string;
    newOrderSubject: (id: string) => string;
    newOrderBody: (order: {
      id: string;
      customer: string;
      email: string;
      phone: string;
      planName: string;
      date: string;
      time: string;
      riders: number;
      total: string;
    }) => string;
    testNeed: string;
    testSubject: string;
    testBody: (from: string, to: string) => string;
    testOk: (to: string) => string;
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
  common: {
    save: "保存",
    cancel: "取消",
    close: "关闭",
    edit: "编辑",
    add: "添加",
    confirm: "确认",
    back: "返回",
    all: "全部",
    none: "无",
    actions: "操作",
    paid: "已支付",
    unpaid: "未支付",
    undecided: "待定",
    notOpen: "待开通",
    wan: "万",
  },
  store: {
    all: "全部店铺",
    allSum: "全店合计",
    open: "营业中",
    reserved: "预留",
    switchAria: "切换店铺",
    locked: "店长仅能查看绑定门店",
    shops: "店铺",
    backAll: "返回全部店铺",
    viewing: "正在查看",
    viewingAll: "当前为全店合计。点分店卡片可查看该店数据。",
  },
  storeNames: {
    namba: "难波本店",
    shinsaibashi: "心斋桥（预留）",
    umeda: "梅田（预留）",
  },
  storeAddresses: {
    namba: "大阪市中央区难波",
    shinsaibashi: "大阪市中央区心斋桥",
    umeda: "大阪市北区梅田",
  },
  orderStatus: {
    pending: "待确认",
    confirmed: "已确认",
    cancelled: "已取消",
    completed: "已完成",
  },
  channel: {
    官网: "官网",
    微信: "微信",
    线下: "线下",
    Klook: "Klook",
    Viator: "Viator",
    WhatsApp: "WhatsApp",
  },
  vehicleStatus: {
    available: "可用",
    repair: "维修中",
    retired: "停用",
  },
  staffRole: {
    admin: "超管",
    manager: "店长",
    staff: "员工",
  },
  daypart: {
    morning: "上午",
    afternoon: "下午",
    dusk: "傍晚",
    night: "夜晚",
  },
  gender: { male: "男", female: "女" },
  nation: {
    USA: "美国",
    TW: "台湾",
    CN: "中国",
    JP: "日本",
    KR: "韩国",
    UK: "英国",
    other: "其他",
  },
  logType: {
    登录: "登录",
    登出: "登出",
    订单修改: "订单修改",
    库存调整: "库存调整",
    套餐上下架: "套餐上下架",
    员工变更: "员工变更",
  },
  logRole: {
    超管: "超管",
    店长: "店长",
    员工: "员工",
    系统: "系统",
  },
  mailType: {
    预订确认: "预订确认",
    出发提醒: "出发提醒",
    退款通知: "退款通知",
    回访评价: "回访评价",
  },
  mailLocale: { "zh-TW": "中文", en: "English", ja: "日本語" },
  payName: { alipay: "支付宝跨境", wechat: "微信支付跨境" },
  reports: {
    today: "今日",
    week: "本周",
    month: "本月",
    custom: "自定义",
    switched: (label) => `已切换${label}`,
    from: "开始",
    to: "结束",
    customHint: "改日期会立刻刷新报表。",
    rangeCaption: "统计区间",
    revenue: "总营收",
    orderCount: "总订单数",
    aov: "客单价",
    refunds: "退款总额",
    trend: (days) => `${days} 天营收趋势（本期 vs 上期）`,
    trendMobile: "营收趋势",
    current: "本期",
    previous: "上期",
    channels: "渠道分析",
    channel: "渠道",
    orders: "订单",
    revenueCol: "营收",
    cut: "抽成",
    net: "到账",
    channelCard: (orders, cut, net) => `${orders} 单 · 抽成 ${cut}% · 到账 ${net}`,
    plans: "套餐销量",
    plan: "套餐",
    sold: "销量",
    share: "营收占比",
    planCard: (sold, share) => `${sold} 单 · ${share}%`,
    nations: "国籍分布",
    genderTitle: "性别比例",
    ages: "年龄段",
    people: "人数",
    daypartTitle: "预订时间段",
    exportCsv: "导出 CSV",
    exportOk: "导出成功",
    unitOrders: "单",
  },
  dashboard: {
    todayOrders: "今日订单",
    todayRevenue: "今日营收",
    pending: "待确认",
    freeKarts: "空余车位",
    allSum: "全店合计",
    vsYesterday: "vs 昨日",
    storeRevenue: "今日该店营收",
    needHandle: "需尽快处理",
    noPending: "暂无待确认",
    kartsOk: (free, total) => `${free}/${total} 正常`,
    count: (n) => `${n} 笔`,
    newOrder: "新建订单",
    inventory: "调整库存",
    reports: "查看报表",
    staff: "管理员工",
    branches: "分店",
    todayLine: (orders, yen) => `今日 ${orders} 单 · ${yen}`,
    pendingKarts: (pending, karts) => `待确认 ${pending} · 可用车 ${karts}`,
    timeline: "今日订单时间线",
    emptyAll: "今日暂无订单",
    emptyStore: "该店今日暂无订单",
    orderMeta: (customer, riders, yen) => `${customer} · ${riders}人 · ${yen}`,
    people: "人",
    shortcuts: "快捷操作",
    mobileHint: "手机上可直接确认订单、调整库存。",
    weekChart: "最近 7 天订单量",
    chartOrders: "订单",
    managerStaff: "店长账号请从订单页确认预约",
    managerReport: "报表仅超管可见，已留在仪表盘",
  },
  orders: {
    date: "日期",
    today: "今天",
    allDates: "全部日期",
    search: "搜索订单号/客户姓名/套餐",
    allStatus: "全部状态",
    add: "添加订单",
    filtering: (date, n) => `正在筛选 ${date} · ${n} 笔`,
    allDatesCount: (n) => `全部日期 · ${n} 笔`,
    allChannels: "全部渠道",
    id: "订单号",
    channel: "渠道",
    time: "时间",
    customer: "客户",
    plan: "套餐",
    riders: "人数",
    amount: "金额",
    status: "状态",
    ops: "操作",
    empty: "没有符合条件的订单",
    mf: (male, female) => `（${male}男/${female}女）`,
    channelChip: (label, n) => `${label} ${n}`,
    edit: "编辑",
    refund: "退款",
    confirm: "确认",
    detail: "详情",
    saved: "订单已保存，库存已按人数同步",
    editTitle: "编辑订单",
    addTitle: "添加订单",
    customerName: "客户名",
    email: "邮箱",
    passport: "证件号",
    note: "备注",
    detailTitle: (id) => `订单 ${id}`,
    addons: "附加项",
    phone: "电话",
    nationality: "国籍",
    refundTitle: "确认退款 / 取消？",
    refundOk: "确认取消",
    refundLead: (id, name) => `将把 ${id}（${name}）标为已取消。此操作为演示状态流转，不会真正打款。`,
    refundNote: "后台退款取消",
  },
  calendar: {
    month: "月",
    week: "周",
    threeDay: "3日",
    day: "日",
    prev: "上一页",
    next: "下一页",
    dayOrders: (iso) => `${iso} 当日订单`,
    count: (n) => `${n} 笔`,
    empty: "这天还没有订单。点上方日期列或订单色块可切换日期。",
    drill: "钻取详情",
    heatOrders: "点击日期进入日列表。深红 >20 单，橙色 10–20，绿色 <10。",
    heatStock: "绿=充足，橙=紧张，红=满员。点日期看时段。",
    dayHint: (iso) => `正在查看 ${iso}，下方是该日完整订单列表。切回月/周可继续下钻。`,
    time: "时间",
    compactHint: "竖屏每次看三天，点上方箭头换三天。手机横过来可看完整一周。",
    weekHint: "色块高度=套餐时长。点击日期列或色块，下方列表切换到当天。",
    minutes: (n) => `${n} 分钟`,
  },
  inventory: {
    free: "宽松",
    tight: "紧张",
    full: "爆满",
    idle: "休",
    remain: (left, cap) => `剩 ${left}/${cap}`,
    yest: "昨",
    today: "今",
    tom: "明",
    filter: "筛选",
    filtered: " · 已筛",
    closeFilter: "关闭筛选",
    vehiclePh: "车辆编号 / 车型",
    allStatus: "全部状态",
    stAvail: "空闲/可用",
    stRepair: "维修",
    stRetired: "停驶",
    special: "特殊日期",
    clearToday: "一键清空今日库存",
    reset: "恢复默认库存",
    vehicle: "车辆",
    collapse: "收起",
    expand: "展开",
    idleLong: "维修 / 停驶",
    mergeHint: "相邻同状态会合并成长条，可拖拽批量修改",
    tipCap: (cap, booked, left, tone) => `总座位 ${cap} · 已订 ${booked} · 剩余 ${left}（${tone}）`,
    tipClosed: "状态：维修 / 停驶",
    tipGuests: (names) => `客人：${names}`,
    noGuests: "暂无",
    editTitle: (code) => `编辑库存 · ${code}`,
    saved: "库存已保存，官网时段余位会同步",
    slot: "时段",
    seats: "总座位数",
    booked: "已预订数",
    status: "状态",
    open: "可预订",
    closed: "维修 / 停驶",
    batchTitle: (n) => `批量修改 ${n} 个时段`,
    setRepair: "设为维修",
    setOpen: "恢复可订",
    batchLead: "已选中连续时段，可统一设为维修或恢复可订。",
    clearAsk: "确认清空今日库存？",
    resetAsk: "确认恢复默认库存？",
    clearOk: "确认清空",
    resetOk: "确认恢复",
    clearLead: "此操作会把当日所有车辆时段标为已满，无法继续预订。请确认后再执行。",
    resetLead: "将按当前车辆状态和订单重新生成当日时间轴。",
    closeSpecial: "关闭特殊日期",
    specialAdded: "特殊日期已添加，休业日官网日历会关闭",
    date: "日期",
    reason: "原因",
    reasonPh: "如：夏季夜跑加场",
    type: "类型",
    closeDay: "全天休业",
    extra: "加开",
  },
  vehicles: {
    repairNote: (n) => `维修中 ${n} 辆，已从当日可售库存扣除。`,
    add: "添加车辆",
    code: "编号",
    model: "车型",
    status: "状态",
    service: "最后维护",
    note: "备注",
    logs: "维修记录",
    title: "车辆",
    saved: "车辆已保存",
    logsTitle: (code) => `${code} 维修记录`,
  },
  staff: {
    add: "添加员工",
    name: "姓名",
    email: "邮箱",
    role: "角色",
    store: "门店",
    status: "状态",
    lastLogin: "最后登录",
    on: "在职",
    off: "停用",
    reset: "重置密码",
    title: "员工",
    saved: "员工已保存",
    password: "初始密码",
    passwordPh: "演示环境任意密码",
    resetAsk: "重置密码？",
    offAsk: "停用该账号？",
    resetOk: "密码已重置为临时口令",
    offOk: "账号已停用",
    demo: "演示环境只改内存状态，不会发真实邮件。",
  },
  settings: {
    tabPay: "支付配置",
    tabStores: "门店管理",
    tabSend: "邮件发送",
    tabMail: "邮件模板",
    tabLogs: "操作日志",
    pay: "支付配置",
    reserved: "预留通道，暂不开放",
    on: "已启用",
    off: "已关闭",
    testMode: "测试模式",
    paySaved: "支付通道已保存，官网结账页只显示已开启的方式",
    savePay: "保存配置",
    stores: "门店管理",
    addStore: "添加门店",
    send: "邮件发送",
    sendLead:
      "静态站不能填邮箱密码。请到 emailjs.com 用发信箱绑定 Gmail / Outlook，模板收件人填 {{to_email}}、主题 {{subject}}、正文 {{message}}。Allowed Origins 加上本站域名。客人信发到订单邮箱，店长抄送发到收件箱。",
    mailFrom: "发信箱",
    mailTo: "收件箱",
    mailToPh: "店长接收新订单和抄送",
    sendSaved: "发信设置已保存",
    testing: "发送中…",
    testSend: "发送测试信",
    templates: "邮件模板",
    type: "类型",
    locale: "语言",
    updated: "最后修改",
    logs: "操作日志",
    detail: "详情",
    tplTitle: (type, locale) => `编辑邮件模板 · ${type}（${locale}）`,
    tplEdit: "编辑邮件模板",
    tplSaved: "模板已保存",
    tplVars: "可用变量：{{customer_name}} {{booking_id}} {{date}} {{time}} {{plan_name}} {{riders}} {{total}}",
    storeTitle: "门店",
    storeSaved: "门店已保存，官网营业时间与电话会同步",
    storeName: "名称",
    address: "地址",
    phone: "电话",
    hours: "营业时间",
  },
  logsPage: {
    title: "全部操作日志",
    back: "返回系统设置",
    allActors: "全部操作人",
    allTypes: "全部类型",
    recent: (shown, extra) =>
      extra ? `最近 ${shown} 条，筛选后共 ${extra} 条` : `最近 ${shown} 条`,
    total: (n) => `共 ${n} 条`,
    time: "时间",
    actor: "操作人",
    role: "角色",
    type: "类型",
    detail: "详情",
    empty: "没有符合条件的日志",
  },
  addons: {
    add: "添加附加项",
    max: (n) => `最多 ${n} 件`,
    editTitle: "编辑附加项",
    addTitle: "添加附加项",
    saved: "附加项已保存，官网加项价格会同步",
    nameZh: "中文名",
    desc: "描述",
    price: "价格",
    maxQty: "数量上限",
    icon: "图标类型",
    camera: "相机",
    costume: "服装",
    photos: "照片",
    insurance: "保险",
    delAsk: "确认删除？",
    think: "再想想",
    del: "删除",
    deleted: "附加项已删除",
    delLead: "删除后官网加项列表会立刻少这一项。",
  },
  roleGate: {
    title: "仅超管可查看",
    lead: "请用 admin@test.com 登录后再打开这一页。店长账号请回仪表盘处理今日订单。",
  },
  notify: {
    status: (label) => `已改为${label}`,
    statusNoMail: (label) => `已改为${label}。尚未配置发信，请到系统设置填写发信箱、收件箱和 EmailJS`,
    statusOk: (label, extra) => `已改为${label}。${extra}`,
    statusFail: (label, extra) => `已改为${label}，但发信失败：${extra}`,
    newOrderSubject: (id) => `官网新订单 ${id}`,
    newOrderBody: (order) =>
      [
        "官网刚完成一笔支付，待后台确认。",
        "",
        `预约号：${order.id}`,
        `客人：${order.customer}`,
        `邮箱：${order.email}`,
        `电话：${order.phone}`,
        `套餐：${order.planName}`,
        `日期：${order.date} ${order.time}`,
        `人数：${order.riders}`,
        `金额：${order.total}`,
      ].join("\n"),
    testNeed: "请先填写发信箱、收件箱和 EmailJS 三项密钥",
    testSubject: "Furture Kart Osaka 发信测试",
    testBody: (from, to) => `这是后台测试信。\n发信箱：${from}\n收件箱：${to}`,
    testOk: (to) => `测试信已发送 → ${to}`,
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
  common: {
    save: "保存",
    cancel: "キャンセル",
    close: "閉じる",
    edit: "編集",
    add: "追加",
    confirm: "確定",
    back: "戻る",
    all: "すべて",
    none: "なし",
    actions: "操作",
    paid: "支払済",
    unpaid: "未払い",
    undecided: "未定",
    notOpen: "準備中",
    wan: "万",
  },
  store: {
    all: "全部店舗",
    allSum: "全店舗合計",
    open: "営業中",
    reserved: "準備中",
    switchAria: "店舗を切り替え",
    locked: "店長は担当店舗のみ表示できます",
    shops: "店舗",
    backAll: "全部店舗に戻る",
    viewing: "表示中",
    viewingAll: "いまは全店舗合計です。店舗カードを押すとその店だけ表示します。",
  },
  storeNames: {
    namba: "難波本店",
    shinsaibashi: "心斎橋（準備中）",
    umeda: "梅田（準備中）",
  },
  storeAddresses: {
    namba: "大阪市中央区難波",
    shinsaibashi: "大阪市中央区心斎橋",
    umeda: "大阪市北区梅田",
  },
  orderStatus: {
    pending: "未確認",
    confirmed: "確定済",
    cancelled: "キャンセル",
    completed: "完了",
  },
  channel: {
    官网: "公式サイト",
    微信: "WeChat",
    线下: "店頭",
    Klook: "Klook",
    Viator: "Viator",
    WhatsApp: "WhatsApp",
  },
  vehicleStatus: {
    available: "稼働中",
    repair: "整備中",
    retired: "廃車",
  },
  staffRole: {
    admin: "管理者",
    manager: "店長",
    staff: "スタッフ",
  },
  daypart: {
    morning: "午前",
    afternoon: "午後",
    dusk: "夕方",
    night: "夜",
  },
  gender: { male: "男性", female: "女性" },
  nation: {
    USA: "アメリカ",
    TW: "台湾",
    CN: "中国",
    JP: "日本",
    KR: "韓国",
    UK: "イギリス",
    other: "その他",
  },
  logType: {
    登录: "ログイン",
    登出: "ログアウト",
    订单修改: "予約変更",
    库存调整: "在庫調整",
    套餐上下架: "コース掲載",
    员工变更: "スタッフ変更",
  },
  logRole: {
    超管: "管理者",
    店长: "店長",
    员工: "スタッフ",
    系统: "システム",
  },
  mailType: {
    预订确认: "予約確定",
    出发提醒: "出発リマインド",
    退款通知: "キャンセル通知",
    回访评价: "フォロー",
  },
  mailLocale: { "zh-TW": "中国語", en: "English", ja: "日本語" },
  payName: { alipay: "Alipay（越境）", wechat: "WeChat Pay（越境）" },
  reports: {
    today: "今日",
    week: "今週",
    month: "今月",
    custom: "任意期間",
    switched: (label) => `${label}に切り替えました`,
    from: "開始",
    to: "終了",
    customHint: "日付を変えるとすぐに集計されます。",
    rangeCaption: "集計期間",
    revenue: "総売上",
    orderCount: "予約件数",
    aov: "客単価",
    refunds: "返金合計",
    trend: (days) => `${days}日間の売上推移（今期 vs 前期）`,
    trendMobile: "売上推移",
    current: "今期",
    previous: "前期",
    channels: "流入元",
    channel: "流入元",
    orders: "件数",
    revenueCol: "売上",
    cut: "手数料",
    net: "入金",
    channelCard: (orders, cut, net) => `${orders}件・手数料${cut}%・入金${net}`,
    plans: "コース販売",
    plan: "コース",
    sold: "件数",
    share: "売上構成",
    planCard: (sold, share) => `${sold}件・${share}%`,
    nations: "国籍",
    genderTitle: "男女比",
    ages: "年代",
    people: "人数",
    daypartTitle: "出発時間帯",
    exportCsv: "CSV出力",
    exportOk: "書き出しました",
    unitOrders: "件",
  },
  dashboard: {
    todayOrders: "本日の予約",
    todayRevenue: "本日の売上",
    pending: "未確認",
    freeKarts: "空き車両",
    allSum: "全店舗合計",
    vsYesterday: "vs 昨日",
    storeRevenue: "本日の店舗売上",
    needHandle: "早めに確認してください",
    noPending: "未確認はありません",
    kartsOk: (free, total) => `${free}/${total}台稼働`,
    count: (n) => `${n}件`,
    newOrder: "予約を追加",
    inventory: "在庫を調整",
    reports: "レポートを見る",
    staff: "スタッフ管理",
    branches: "店舗",
    todayLine: (orders, yen) => `本日${orders}件・${yen}`,
    pendingKarts: (pending, karts) => `未確認${pending}件・稼働${karts}台`,
    timeline: "本日の予約タイムライン",
    emptyAll: "本日の予約はありません",
    emptyStore: "この店の本日予約はありません",
    orderMeta: (customer, riders, yen) => `${customer}・${riders}名・${yen}`,
    people: "名",
    shortcuts: "ショートカット",
    mobileHint: "スマホからも予約確認と在庫調整ができます。",
    weekChart: "直近7日の予約件数",
    chartOrders: "予約",
    managerStaff: "店長は予約一覧から確定してください",
    managerReport: "レポートは管理者のみです",
  },
  orders: {
    date: "日付",
    today: "今日",
    allDates: "全日付",
    search: "予約番号／氏名／コース",
    allStatus: "全ステータス",
    add: "予約を追加",
    filtering: (date, n) => `${date}を表示・${n}件`,
    allDatesCount: (n) => `全日付・${n}件`,
    allChannels: "全流入元",
    id: "予約番号",
    channel: "流入元",
    time: "時刻",
    customer: "お客さま",
    plan: "コース",
    riders: "人数",
    amount: "金額",
    status: "ステータス",
    ops: "操作",
    empty: "条件に合う予約はありません",
    mf: (male, female) => `名（男${male}・女${female}）`,
    channelChip: (label, n) => `${label}（${n}）`,
    edit: "編集",
    refund: "返金",
    confirm: "確定",
    detail: "詳細",
    saved: "予約を保存し、在庫を人数に合わせて更新しました",
    editTitle: "予約を編集",
    addTitle: "予約を追加",
    customerName: "お名前",
    email: "メール",
    passport: "旅券番号",
    note: "メモ",
    detailTitle: (id) => `予約 ${id}`,
    addons: "オプション",
    phone: "電話",
    nationality: "国籍",
    refundTitle: "返金／キャンセルしますか？",
    refundOk: "キャンセルする",
    refundLead: (id, name) => `${id}（${name}）をキャンセルにします。デモのため実際の返金は行いません。`,
    refundNote: "管理画面からキャンセル",
  },
  calendar: {
    month: "月",
    week: "週",
    threeDay: "3日",
    day: "日",
    prev: "前へ",
    next: "次へ",
    dayOrders: (iso) => `${iso}の予約`,
    count: (n) => `${n}件`,
    empty: "この日の予約はありません。上の日付や色ブロックで日付を切り替えられます。",
    drill: "詳細へ",
    heatOrders: "日付を押すとその日の一覧へ。濃い赤は20件超、橙は10–20、緑は10件未満。",
    heatStock: "緑＝余裕、橙＝逼迫、赤＝満席。日付を押すと時間帯を見ます。",
    dayHint: (iso) => `${iso}を表示中。下にその日の予約一覧があります。`,
    time: "時刻",
    compactHint: "縦向きでは3日ずつ。矢印で移動。横向きにすると1週間が見えます。",
    weekHint: "色ブロックの高さはコース時間。日付列やブロックを押すと下の一覧がその日になります。",
    minutes: (n) => `${n}分`,
  },
  inventory: {
    free: "余裕",
    tight: "逼迫",
    full: "満席",
    idle: "休",
    remain: (left, cap) => `残${left}/${cap}`,
    yest: "昨",
    today: "今",
    tom: "明",
    filter: "絞り込み",
    filtered: " · 適用中",
    closeFilter: "絞り込みを閉じる",
    vehiclePh: "車両番号 / 車種",
    allStatus: "全ステータス",
    stAvail: "稼働",
    stRepair: "整備",
    stRetired: "廃車",
    special: "特別日",
    clearToday: "本日在庫を空にする",
    reset: "標準在庫に戻す",
    vehicle: "車両",
    collapse: "閉じる",
    expand: "開く",
    idleLong: "整備 / 廃車",
    mergeHint: "同じ状態が続くと1本にまとまり、ドラッグでまとめて変更できます",
    tipCap: (cap, booked, left, tone) => `座席${cap}・予約済${booked}・残${left}（${tone}）`,
    tipClosed: "状態：整備 / 廃車",
    tipGuests: (names) => `お客さま：${names}`,
    noGuests: "なし",
    editTitle: (code) => `在庫を編集 · ${code}`,
    saved: "在庫を保存しました。サイトの空きも同期されます",
    slot: "時間帯",
    seats: "総座席",
    booked: "予約数",
    status: "状態",
    open: "予約可",
    closed: "整備 / 廃車",
    batchTitle: (n) => `${n}件の時間帯を一括変更`,
    setRepair: "整備にする",
    setOpen: "予約可に戻す",
    batchLead: "連続した時間帯を、まとめて整備または予約可にできます。",
    clearAsk: "本日の在庫を空にしますか？",
    resetAsk: "標準在庫に戻しますか？",
    clearOk: "空にする",
    resetOk: "戻す",
    clearLead: "当日の全車両・全時間帯を満席にし、新規予約を止めます。",
    resetLead: "車両状態と予約から、当日のタイムラインを作り直します。",
    closeSpecial: "特別日を閉じる",
    specialAdded: "特別日を追加しました。休業日はサイトのカレンダーが閉じます",
    date: "日付",
    reason: "理由",
    reasonPh: "例：ナイトラン増便",
    type: "種類",
    closeDay: "終日休業",
    extra: "増便",
  },
  vehicles: {
    repairNote: (n) => `整備中${n}台。当日の販売在庫から外れています。`,
    add: "車両を追加",
    code: "番号",
    model: "車種",
    status: "状態",
    service: "最終整備",
    note: "メモ",
    logs: "整備記録",
    title: "車両",
    saved: "車両を保存しました",
    logsTitle: (code) => `${code}の整備記録`,
  },
  staff: {
    add: "スタッフを追加",
    name: "氏名",
    email: "メール",
    role: "権限",
    store: "店舗",
    status: "状態",
    lastLogin: "最終ログイン",
    on: "在籍",
    off: "停止",
    reset: "パスワード再設定",
    title: "スタッフ",
    saved: "スタッフを保存しました",
    password: "初期パスワード",
    passwordPh: "デモでは任意のパスワード",
    resetAsk: "パスワードを再設定しますか？",
    offAsk: "このアカウントを停止しますか？",
    resetOk: "仮パスワードにリセットしました",
    offOk: "アカウントを停止しました",
    demo: "デモではメモリ上の状態だけ変わり、実メールは送りません。",
  },
  settings: {
    tabPay: "決済",
    tabStores: "店舗",
    tabSend: "メール送信",
    tabMail: "メール文面",
    tabLogs: "操作ログ",
    pay: "決済設定",
    reserved: "準備中の経路です",
    on: "オン",
    off: "オフ",
    testMode: "テストモード",
    paySaved: "決済を保存しました。サイトの会計はオンの方法だけ出ます",
    savePay: "設定を保存",
    stores: "店舗管理",
    addStore: "店舗を追加",
    send: "メール送信",
    sendLead:
      "静的サイトではメールパスワードを置けません。emailjs.com で送信元の Gmail / Outlook を結び、テンプレートの宛先は {{to_email}}、件名 {{subject}}、本文 {{message}} にしてください。Allowed Origins に本サイトのドメインを追加。お客さまへは予約メール、店長へのコピーは受信箱へ。",
    mailFrom: "送信元",
    mailTo: "受信箱",
    mailToPh: "新予約とコピーの宛先",
    sendSaved: "送信設定を保存しました",
    testing: "送信中…",
    testSend: "テスト送信",
    templates: "メール文面",
    type: "種類",
    locale: "言語",
    updated: "最終更新",
    logs: "操作ログ",
    detail: "詳細",
    tplTitle: (type, locale) => `メール文面を編集 · ${type}（${locale}）`,
    tplEdit: "メール文面を編集",
    tplSaved: "文面を保存しました",
    tplVars: "使える変数：{{customer_name}} {{booking_id}} {{date}} {{time}} {{plan_name}} {{riders}} {{total}}",
    storeTitle: "店舗",
    storeSaved: "店舗を保存しました。サイトの営業時間と電話も同期されます",
    storeName: "名称",
    address: "住所",
    phone: "電話",
    hours: "営業時間",
  },
  logsPage: {
    title: "操作ログ一覧",
    back: "設定に戻る",
    allActors: "全員",
    allTypes: "全種類",
    recent: (shown, extra) =>
      extra ? `直近${shown}件、絞り込み後${extra}件` : `直近${shown}件`,
    total: (n) => `全${n}件`,
    time: "時刻",
    actor: "操作者",
    role: "権限",
    type: "種類",
    detail: "内容",
    empty: "条件に合うログはありません",
  },
  addons: {
    add: "オプションを追加",
    max: (n) => `最大${n}点`,
    editTitle: "オプションを編集",
    addTitle: "オプションを追加",
    saved: "オプションを保存しました。サイトの価格も同期されます",
    nameZh: "中国語名",
    desc: "説明",
    price: "料金",
    maxQty: "数量上限",
    icon: "アイコン",
    camera: "カメラ",
    costume: "ウェア",
    photos: "写真",
    insurance: "保険",
    delAsk: "削除しますか？",
    think: "やめる",
    del: "削除",
    deleted: "オプションを削除しました",
    delLead: "削除するとサイトのオプション一覧からも消えます。",
  },
  roleGate: {
    title: "管理者のみ",
    lead: "admin@test.com でログインしてください。店長はダッシュボードで本日の予約を処理できます。",
  },
  notify: {
    status: (label) => `${label}に変更しました`,
    statusNoMail: (label) => `${label}に変更しました。送信設定が未入力です。設定で送信元・受信箱・EmailJS を入れてください`,
    statusOk: (label, extra) => `${label}に変更しました。${extra}`,
    statusFail: (label, extra) => `${label}に変更しましたが、送信に失敗：${extra}`,
    newOrderSubject: (id) => `公式サイトの新規予約 ${id}`,
    newOrderBody: (order) =>
      [
        "公式サイトで支払いが完了しました。管理画面での確認待ちです。",
        "",
        `予約番号：${order.id}`,
        `お客さま：${order.customer}`,
        `メール：${order.email}`,
        `電話：${order.phone}`,
        `コース：${order.planName}`,
        `日時：${order.date} ${order.time}`,
        `人数：${order.riders}`,
        `金額：${order.total}`,
      ].join("\n"),
    testNeed: "送信元、受信箱、EmailJS の3項目を先に入力してください",
    testSubject: "Furture Kart Osaka 送信テスト",
    testBody: (from, to) => `管理画面のテストメールです。\n送信元：${from}\n受信箱：${to}`,
    testOk: (to) => `テストメールを送信しました → ${to}`,
  },
};

export function adminCopy(locale: string): AdminCopy {
  return locale.startsWith("ja") ? ja : zh;
}

export function adminRoleLabel(locale: string, role: "admin" | "manager" | "staff" | string) {
  const copy = adminCopy(locale);
  return copy.staffRole[role] ?? (role === "admin" ? copy.super : copy.manager);
}

export function adminOrderStatus(locale: string, status: string) {
  return adminCopy(locale).orderStatus[status] ?? status;
}

export function adminChannel(locale: string, channel: string) {
  return adminCopy(locale).channel[channel] ?? channel;
}

export function adminDaypart(locale: string, id: string) {
  return adminCopy(locale).daypart[id] ?? id;
}

export function adminGender(locale: string, gender: "male" | "female") {
  return adminCopy(locale).gender[gender];
}

export function adminNation(locale: string, code: string) {
  const map = adminCopy(locale).nation;
  return map[code] ?? map.other ?? code;
}

export function adminVehicleStatus(locale: string, status: string) {
  return adminCopy(locale).vehicleStatus[status] ?? status;
}

export function adminStaffRole(locale: string, role: string) {
  return adminCopy(locale).staffRole[role] ?? role;
}

export function adminStoreName(locale: string, id: string, fallback = "") {
  return adminCopy(locale).storeNames[id] ?? fallback;
}

export function adminStoreAddress(locale: string, id: string, fallback = "") {
  return adminCopy(locale).storeAddresses[id] ?? fallback;
}

export function adminStoreStatus(locale: string, status: string) {
  const copy = adminCopy(locale);
  if (status === "预留" || status === "準備中") return copy.store.reserved;
  return copy.store.open;
}

export function adminLogType(locale: string, type: string) {
  return adminCopy(locale).logType[type] ?? type;
}

export function adminLogRole(locale: string, role: string) {
  return adminCopy(locale).logRole[role] ?? adminStaffRole(locale, role);
}

export function adminMailType(locale: string, type: string) {
  return adminCopy(locale).mailType[type] ?? type;
}

export function adminMailLocale(locale: string, code: string) {
  return adminCopy(locale).mailLocale[code] ?? code;
}

export function adminPayName(locale: string, id: string, fallback: string) {
  return adminCopy(locale).payName[id] ?? fallback;
}

export function adminPlanName(
  locale: string,
  plan?: { name?: string; nameJa?: string; nameEn?: string } | null,
  fallback = "",
) {
  if (!plan) return fallback;
  if (locale.startsWith("ja") && plan.nameJa) {
    return plan.nameJa.replace(/([^\s\d])(\d+分)/g, "$1 $2");
  }
  if (locale.startsWith("en") && plan.nameEn) return plan.nameEn;
  return plan.name || fallback;
}
