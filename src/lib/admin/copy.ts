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
  langEn: string;
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
  cms: {
    addVideo: string;
    addReview: string;
    addFaq: string;
    addPress: string;
    slot: string;
    slotHero: string;
    slotGallery: string;
    slotExperience: string;
    slotPage: string;
    source: string;
    youtube: string;
    file: string;
    youtubeUrl: string;
    youtubeHint: string;
    uploadVideo: string;
    videoHint: string;
    startAt: string;
    startAtHint: string;
    errVideoType: string;
    errVideoSize: string;
    invalidYoutube: string;
    sectionTitle: string;
    sectionLead: string;
    quote: string;
    name: string;
    country: string;
    photo: string;
    homeFaq: string;
    homeFaqHint: string;
    question: string;
    answer: string;
    sourceName: string;
    pressTitle: string;
    image: string;
    link: string;
    maps: string;
    mapsHint: string;
    address: string;
    station: string;
    walk: string;
    visitLead: string;
    howTitle: string;
    onlineLabel: string;
    whatsappHint: string;
    showOnline: string;
    showWhatsapp: string;
    showPhone: string;
    showEmail: string;
    showLine: string;
    tabHome: string;
    tabGroup: string;
    heroLoop: string;
    galleryClip: string;
    heroHint: string;
    galleryHint: string;
    groupHint: string;
    caption: string;
    channelLead: string;
    brandName: string;
    brandShort: string;
    brandSuffix: string;
    logo: string;
    logoHint: string;
    phone: string;
    email: string;
    hours: string;
    whatsapp: string;
    social: string;
    instagram: string;
    youtubeSocial: string;
    x: string;
    facebook: string;
    tiktok: string;
    line: string;
    footerCompany: string;
    saved: string;
    remove: string;
    removeAsk: string;
    empty: string;
    on: string;
    off: string;
    restore: string;
    sort: string;
    listed: string;
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
    cutHint: string;
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
  analytics: {
    compare: string;
    compareWeek: string;
    compareMonth: string;
    compareYear: string;
    apply: string;
    applyOk: string;
    rangeCaption: string;
    current: string;
    previous: string;
    metric: string;
    mode: string;
    day: string;
    sold: string;
    orders: string;
    bookings: string;
    completed: string;
    cancelled: string;
    revenue: string;
    profit: string;
    aov: string;
    bookingTrend: (days: number) => string;
    revenueTrend: (days: number) => string;
    planShare: string;
    channelShare: string;
    nations: string;
    gender: string;
    ages: string;
    daypart: string;
    people: string;
    empty: string;
    deltaNew: string;
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
    dateFrom: string;
    dateTo: string;
    today: string;
    allDates: string;
    search: string;
    allStatus: string;
    add: string;
    filtering: (date: string, n: number) => string;
    filteringFrom: (from: string, n: number) => string;
    filteringTo: (to: string, n: number) => string;
    filteringRange: (from: string, to: string, n: number) => string;
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
    docsTitle: string;
    docsHint: string;
    docPassport: string;
    docLicense: string;
    docIdp: string;
    note: string;
    detailTitle: (id: string) => string;
    addons: string;
    phone: string;
    nationality: string;
    idTaken: string;
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
    dayView: string;
    weekView: string;
    monthView: string;
    batchWeek: string;
    batchMonth: string;
    batchRange: string;
    batchRangeTitle: string;
    rangeFrom: string;
    rangeTo: string;
    rangeToday: string;
    rangeInvalid: string;
    rangeTooLong: string;
    rangePreview: (days: number, vehicles: number) => string;
    batchRangeLead: string;
    applyRange: string;
    allKart: string;
    rangeOpen: string;
    rangeClose: string;
    rangeSeats: string;
  };
  vehicles: {
    repairNote: (n: number) => string;
    availNote: (n: number) => string;
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
    logAdd: string;
    logEmpty: string;
    logPh: string;
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
    tabChannels: string;
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
    channels: string;
    channelLead: string;
    channelCut: string;
    channelLocked: string;
    channelSaved: string;
    saveChannels: string;
    addChannel: string;
    channelName: string;
    channelNamePh: string;
    channelNameRequired: string;
    removeChannel: string;
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
  langEn: "EN",
  langJa: "日本語",
  super: "超管",
  manager: "店长",
  orderDetail: "订单详情",
  orderLead: (id) => `预约号 ${id}`,
  nav: {
    "/admin/dashboard": "仪表盘",
    "/admin/bookings": "预约管理",
    "/admin/orders": "订单列表",
    "/admin/calendar": "日历",
    "/admin/inventory": "库存管理",
    "/admin/vehicles": "车辆管理",
    "/admin/plans": "套餐管理",
    "/admin/content": "内容管理",
    "/admin/content/videos": "视频管理",
    "/admin/content/reviews": "用户评价",
    "/admin/content/faq": "FAQ",
    "/admin/content/press": "新闻报道",
    "/admin/content/meetup": "集合地点",
    "/admin/affiliates": "推广代理",
    "/admin/bookings/how": "预约开关设置",
    "/admin/settings/booking": "预约开关设置",
    "/admin/reports": "财务报表",
    "/admin/reports/overview": "营收报表",
    "/admin/reports/analytics": "数据分析",
    "/admin/staff": "员工管理",
    "/admin/settings": "系统设置",
    "/admin/settings/pay": "支付配置",
    "/admin/settings/channels": "渠道设置",
    "/admin/settings/stores": "门店管理",
    "/admin/settings/email": "邮件设置",
    "/admin/settings/send": "邮件设置",
    "/admin/settings/mail": "邮件设置",
    "/admin/settings/logs": "操作日志",
    "/admin/site": "全站配置",
  },
  pages: {
    "/admin/dashboard": { title: "仪表盘", lead: "超管默认看全店合计，点分店可下钻。店长只看自己的店。" },
    "/admin/bookings": { title: "订单列表", lead: "列表处理订单。点状态可直接改，不必进详情。" },
    "/admin/orders": { title: "订单列表", lead: "列表处理订单。点状态可直接改，不必进详情。" },
    "/admin/calendar": { title: "日历", lead: "月 / 周 / 日看订单分布。点日期更新下方列表，点色块打开订单详情。" },
    "/admin/inventory": { title: "库存管理", lead: "日 / 周 / 月看车辆库存。可指定起止日期批量设置。" },
    "/admin/vehicles": { title: "车辆管理", lead: "10 辆车。维修中的会从当日库存扣除。" },
    "/admin/plans": { title: "套餐管理", lead: "编辑前台卡片：标题图、说明图、介绍与亮点，以及价格、时长和附加项。" },
    "/admin/content": { title: "视频管理", lead: "首页视频和展示组视频分开管理。每个卡片对应一个位置。" },
    "/admin/content/videos": { title: "视频管理", lead: "首页视频和展示组视频分开管理。每个卡片对应一个位置。" },
    "/admin/content/reviews": { title: "用户评价", lead: "对应前台「用户评价」。可改文案、姓名与照片。" },
    "/admin/content/faq": { title: "FAQ 管理", lead: "首页只显示勾了「首页」的条目，FAQ 页显示全部上架问题。" },
    "/admin/content/press": { title: "新闻报道", lead: "首页新闻区块最多显示 3 条上架内容。" },
    "/admin/content/meetup": { title: "集合地点", lead: "前台 Access 区块的集合文案。完整门牌只在预订后发送。" },
    "/admin/affiliates": { title: "推广代理", lead: "查看推广员列表，编辑资料。点进详情看推广链接和抽成费用。" },
    "/admin/bookings/how": { title: "预约开关设置", lead: "开关预约入口。关掉的渠道不会出现在官网。" },
    "/admin/settings/booking": { title: "预约开关设置", lead: "开关预约入口。关掉的渠道不会出现在官网。" },
    "/admin/site": { title: "全站配置", lead: "公司名称、Logo、电话邮箱和页脚社交媒体。" },
    "/admin/reports": { title: "营收报表", lead: "营收趋势与套餐销量。" },
    "/admin/reports/overview": { title: "营收报表", lead: "营收趋势与套餐销量。" },
    "/admin/reports/analytics": { title: "数据分析", lead: "本周对比上周、本月对比上月、本月对比去年同期。渠道分析、性别、国籍和时段一并统计。" },
    "/admin/staff": { title: "员工管理", lead: "超管可添加、改角色、重置密码和停用。" },
    "/admin/settings": { title: "支付配置", lead: "开关支付方式。官网结账页只显示已开启的方式。" },
    "/admin/settings/pay": { title: "支付配置", lead: "开关支付方式。官网结账页只显示已开启的方式。" },
    "/admin/settings/channels": { title: "渠道设置", lead: "渠道只记在后台，前台不展示。OTA 抽成用于报表的门店实收。" },
    "/admin/settings/stores": { title: "门店管理", lead: "电话、地址和营业时间会同步到官网。" },
    "/admin/settings/email": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
    "/admin/settings/send": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
    "/admin/settings/mail": { title: "邮件设置", lead: "绑定发信箱，并按客人语言编辑确认、提醒和退款文案。" },
    "/admin/settings/logs": { title: "操作日志", lead: "查看全部后台操作记录。" },
  },
  plans: {
    add: "添加套餐",
    edit: "编辑套餐",
    save: "保存",
    saved: "套餐已保存。图片存在本机，换电脑或清缓存需重新上传。",
    copyHint: "收起时只显示名称、介绍、亮点。点开后用下拉切换语言，一次填一种。",
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
  cms: {
    addVideo: "添加视频",
    addReview: "添加评价",
    addFaq: "添加问题",
    addPress: "添加报道",
    slot: "出现位置",
    slotHero: "首页主视觉",
    slotGallery: "现场画面",
    slotExperience: "体验视频",
    slotPage: "视频页列表",
    source: "来源",
    youtube: "YouTube 链接",
    file: "本地上传",
    youtubeUrl: "YouTube 链接或视频 ID",
    youtubeHint: "支持 youtube.com、youtu.be 或 11 位 ID。",
    uploadVideo: "上传视频",
    videoHint: "mp4 / webm，不超过 12MB。大文件存在本机，换电脑需重新上传。",
    startAt: "开始秒数",
    startAtHint: "同一支片子从不同时间播，六个画面才不会看起来一样。",
    errVideoType: "请上传 mp4 或 webm 视频",
    errVideoSize: "视频不能超过 12MB",
    invalidYoutube: "无法识别该 YouTube 链接",
    sectionTitle: "区块标题",
    sectionLead: "区块导语",
    quote: "评价内容",
    name: "姓名",
    country: "国家 / 地区",
    photo: "照片",
    homeFaq: "显示在首页",
    homeFaqHint: "勾选后会出现在首页 FAQ；FAQ 页仍显示全部上架问题。",
    question: "问题",
    answer: "回答",
    sourceName: "媒体名称",
    pressTitle: "标题",
    image: "配图",
    link: "链接（选填）",
    maps: "地图链接",
    mapsHint: "Google 地图或任何可打开的地址链接。",
    address: "地址",
    station: "车站",
    walk: "步行指引",
    visitLead: "导语",
    howTitle: "标题",
    onlineLabel: "线上预约按钮",
    whatsappHint: "WhatsApp 提示",
    showOnline: "线上预约",
    showWhatsapp: "WhatsApp",
    showPhone: "电话",
    showEmail: "邮件",
    showLine: "LINE",
    tabHome: "首页视频",
    tabGroup: "展示组视频",
    heroLoop: "顶部循环背景",
    galleryClip: "現場畫面",
    heroHint: "落地页最上方的循环背景片。",
    galleryHint: "套餐前面那条大片。一个标题对应一个文件或链接。",
    groupHint: "前台「體驗影片」六宫格。每个卡片对应一个格子。",
    caption: "标题",
    channelLead: "每个渠道可单独开关。关掉则官网预约区不显示。链接只作用于该入口。",
    brandName: "公司全称",
    brandShort: "简称（导航）",
    brandSuffix: "后缀（如 Osaka）",
    logo: "Logo",
    logoHint: "不上传则继续用文字标。建议正方形或横版透明底。",
    phone: "电话",
    email: "邮箱",
    hours: "营业时间",
    whatsapp: "WhatsApp 链接",
    social: "社交媒体",
    instagram: "Instagram",
    youtubeSocial: "YouTube",
    x: "X",
    facebook: "Facebook",
    tiktok: "TikTok",
    line: "LINE",
    footerCompany: "页脚公司行",
    saved: "已保存，前台会马上更新。",
    remove: "删除",
    removeAsk: "确定删除这条？",
    empty: "还没有内容。",
    on: "上架",
    off: "下架",
    restore: "恢复默认",
    sort: "排序",
    listed: "上架",
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
    Instagram: "Instagram",
    TikTok: "TikTok",
    携程: "携程",
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
    cutHint: "抽成会立刻重算到账，并同步到渠道设置。",
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
  analytics: {
    compare: "对比方式",
    compareWeek: "本周对比上周",
    compareMonth: "本月对比上月",
    compareYear: "本月对比去年同期",
    apply: "应用筛选",
    applyOk: "已按筛选刷新",
    rangeCaption: "本期",
    current: "本期",
    previous: "对比期",
    metric: "指标",
    mode: "对比",
    day: "日期",
    sold: "销量",
    orders: "订单",
    bookings: "预约数",
    completed: "已完成",
    cancelled: "已取消",
    revenue: "总营业额",
    profit: "预估利润",
    aov: "客单价",
    bookingTrend: (days) => `预约量趋势（${days}天）`,
    revenueTrend: (days) => `收入趋势（${days}天）`,
    planShare: "套餐占比",
    channelShare: "预约平台",
    nations: "国籍",
    gender: "性别",
    ages: "年龄段",
    daypart: "预订时段",
    people: "人数",
    empty: "这个区间还没有订单。",
    deltaNew: "新",
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
    dateFrom: "开始日期",
    dateTo: "结束日期",
    today: "今天",
    allDates: "全部日期",
    search: "搜索订单号/客户姓名/套餐",
    allStatus: "全部状态",
    add: "添加订单",
    filtering: (date, n) => `正在筛选 ${date} · ${n} 笔`,
    filteringFrom: (from, n) => `从 ${from} 起 · ${n} 笔`,
    filteringTo: (to, n) => `截至 ${to} · ${n} 笔`,
    filteringRange: (from, to, n) => `${from} – ${to} · ${n} 笔`,
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
    docsTitle: "证件录入",
    docsHint: "演示示意图，点击放大。",
    docPassport: "护照",
    docLicense: "驾照",
    docIdp: "IDP",
    note: "备注",
    detailTitle: (id) => `订单 ${id}`,
    addons: "附加项",
    phone: "电话",
    nationality: "国籍",
    idTaken: "订单号已被占用，请换一个。",
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
    empty: "这天还没有订单。点上方日期列可切换日期，点色块打开详情。",
    drill: "详情",
    heatOrders: "点击日期更新下方当日订单。深红 >20 单，橙色 10–20，绿色 <10。",
    heatStock: "绿=充足，橙=紧张，红=满员。点日期看时段。",
    dayHint: (iso) => `正在查看 ${iso}，下方是该日订单。`,
    time: "时间",
    compactHint: "竖屏每次看三天，点上方箭头换三天。手机横过来可看完整一周。",
    weekHint: "色块高度等于套餐时长。点击色块打开订单详情，点击日期列可切换下方当天列表。",
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
    dayView: "日",
    weekView: "周",
    monthView: "月",
    batchWeek: "本周",
    batchMonth: "本月",
    batchRange: "批量设置",
    batchRangeTitle: "批量设置库存",
    rangeFrom: "开始日期",
    rangeTo: "结束日期",
    rangeToday: "今天",
    rangeInvalid: "结束日期不能早于开始日期。",
    rangeTooLong: "一次最多 92 天，请缩短范围。",
    rangePreview: (days, vehicles) => `将应用到 ${days} 天 · ${vehicles} 辆车（当前列表筛选）。`,
    batchRangeLead: "自己选起止日期。也可先点本周 / 本月填入，再改某一头。套到这段里所有时段。",
    applyRange: "应用到所选日期",
    allKart: "全部车辆",
    rangeOpen: "全部营业",
    rangeClose: "全部休息",
    rangeSeats: "统一座位数",
  },
  vehicles: {
    repairNote: (n) => `维修中 ${n} 辆，已从当日可售库存扣除。`,
    availNote: (n) => `可用 ${n} 台。维修中的车辆已从当日可售库存扣除。`,
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
    logAdd: "添加记录",
    logEmpty: "暂无维修记录",
    logPh: "例如：刹车片更换",
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
    tabChannels: "渠道设置",
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
    channels: "渠道设置",
    channelLead: "渠道只记在后台，前台不展示。OTA 抽成用于报表的门店实收。",
    channelCut: "抽成 %",
    channelLocked: "官网渠道不可关闭",
    channelSaved: "渠道已保存，报表抽成与手工录单选项会同步",
    saveChannels: "保存渠道",
    addChannel: "增加渠道",
    channelName: "渠道名称",
    channelNamePh: "例如 GetYourGuide",
    channelNameRequired: "请填写渠道名称",
    removeChannel: "删除渠道",
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
    testSubject: "Future Kart Osaka 发信测试",
    testBody: (from, to) => `这是后台测试信。\n发信箱：${from}\n收件箱：${to}`,
    testOk: (to) => `测试信已发送 → ${to}`,
  },
};

const en: AdminCopy = {
  brandSub: "Admin",
  header: "Osaka kart operations",
  logout: "Sign out",
  entering: "Opening sign-in…",
  goLogin: "Go to sign-in",
  loginTitle: "Admin sign-in",
  loginLead: "Admin sign-in",
  loginHintAdmin: "Admin: admin@test.com (dashboard totals all stores; click a shop to drill in)",
  loginHintManager: "Manager: manager@test.com (locked to Namba)",
  loginHintAny: "Any password works. You will enter as “{role}”",
  loginAs: "You will enter as “{role}”",
  loginOnly: ", and can only see “{store}”",
  passwordPh: "Any password",
  login: "Sign in",
  nambaStore: "Namba flagship",
  langZh: "中文",
  langEn: "EN",
  langJa: "日本語",
  super: "Admin",
  manager: "Manager",
  orderDetail: "Order detail",
  orderLead: (id) => `Booking ${id}`,
  nav: {
    "/admin/dashboard": "Dashboard",
    "/admin/bookings": "Bookings",
    "/admin/orders": "Orders",
    "/admin/calendar": "Calendar",
    "/admin/inventory": "Inventory",
    "/admin/vehicles": "Vehicles",
    "/admin/plans": "Plans",
    "/admin/content": "Content",
    "/admin/content/videos": "Videos",
    "/admin/content/reviews": "Reviews",
    "/admin/content/faq": "FAQ",
    "/admin/content/press": "Press",
    "/admin/content/meetup": "Meetup",
    "/admin/affiliates": "Promo agents",
    "/admin/bookings/how": "Booking switches",
    "/admin/settings/booking": "Booking switches",
    "/admin/reports": "Reports",
    "/admin/reports/overview": "Revenue",
    "/admin/reports/analytics": "Analytics",
    "/admin/staff": "Staff",
    "/admin/settings": "Settings",
    "/admin/settings/pay": "Payments",
    "/admin/settings/channels": "Channels",
    "/admin/settings/stores": "Stores",
    "/admin/settings/email": "Email",
    "/admin/settings/send": "Email",
    "/admin/settings/mail": "Email",
    "/admin/settings/logs": "Activity log",
    "/admin/site": "Site",
  },
  pages: {
    "/admin/dashboard": { title: "Dashboard", lead: "Admins see all-store totals by default. Click a shop to drill down. Managers only see their own store." },
    "/admin/bookings": { title: "Orders", lead: "Handle bookings in the list. Change status here — no need to open the detail." },
    "/admin/orders": { title: "Orders", lead: "Handle bookings in the list. Change status here — no need to open the detail." },
    "/admin/calendar": { title: "Calendar", lead: "Month / week / day. Click a date to refresh the list below, or a block to open the order." },
    "/admin/inventory": { title: "Inventory", lead: "Day / week / month. Batch-set stock for any date range." },
    "/admin/vehicles": { title: "Vehicles", lead: "10 karts. Units in repair are pulled from that day’s sellable stock." },
    "/admin/plans": { title: "Plans", lead: "Edit the public cards: cover, route art, copy and highlights, plus price, duration and add-ons." },
    "/admin/content": { title: "Videos", lead: "Home videos and the experience set, each card is one slot." },
    "/admin/content/videos": { title: "Videos", lead: "Home videos and the experience set, each card is one slot." },
    "/admin/content/reviews": { title: "Reviews", lead: "Matches the public “Guest reviews” block. Edit quote, name and photo." },
    "/admin/content/faq": { title: "FAQ", lead: "Home only shows items marked for home. The FAQ page shows every listed question." },
    "/admin/content/press": { title: "Press", lead: "The home press block shows up to 3 listed items." },
    "/admin/content/meetup": { title: "Meetup", lead: "Access copy guests see. Full street number is sent after booking." },
    "/admin/affiliates": { title: "Promo agents", lead: "List and edit agents. Open one to see the promo link and commission." },
    "/admin/bookings/how": { title: "Booking switches", lead: "Toggle booking entries. Hidden channels stay off the site." },
    "/admin/settings/booking": { title: "Booking switches", lead: "Toggle booking entries. Hidden channels stay off the site." },
    "/admin/site": { title: "Site", lead: "Company name, logo, phone, email and footer socials." },
    "/admin/reports": { title: "Revenue", lead: "Revenue trend and plan sales." },
    "/admin/reports/overview": { title: "Revenue", lead: "Revenue trend and plan sales." },
    "/admin/reports/analytics": { title: "Analytics", lead: "This week vs last week, this month vs last month, this month vs the same month last year. Includes channel mix with commission, gender, nationality and time of day." },
    "/admin/staff": { title: "Staff", lead: "Admins can add people, change roles, reset passwords and disable accounts." },
    "/admin/settings": { title: "Payments", lead: "Toggle payment methods. Checkout only shows what is on." },
    "/admin/settings/pay": { title: "Payments", lead: "Toggle payment methods. Checkout only shows what is on." },
    "/admin/settings/channels": { title: "Channels", lead: "Channels stay in admin only. OTA cuts feed store net in reports." },
    "/admin/settings/stores": { title: "Stores", lead: "Phone, address and hours sync to the public site." },
    "/admin/settings/email": { title: "Email", lead: "Connect the sending inbox and edit confirm, reminder and refund copy per guest language." },
    "/admin/settings/send": { title: "Email", lead: "Connect the sending inbox and edit confirm, reminder and refund copy per guest language." },
    "/admin/settings/mail": { title: "Email", lead: "Connect the sending inbox and edit confirm, reminder and refund copy per guest language." },
    "/admin/settings/logs": { title: "Activity log", lead: "Every admin action." },
  },
  plans: {
    add: "Add plan",
    edit: "Edit plan",
    save: "Save",
    saved: "Plan saved. Images stay on this device — re-upload after a cache clear or a new computer.",
    copyHint: "Collapsed rows show name, intro and highlights. Open a row and switch language in the dropdown.",
    copy: "Copy",
    name: "Name",
    intro: "Intro",
    highlights: "Highlights",
    highlightHint: "One line per language. The site shows up to 3.",
    zh: "Chinese",
    en: "English",
    ja: "Japanese",
    ko: "Korean",
    cover: "Cover image",
    coverHint: "Top of the plan card. 16:9 (about 1600×900). Street default if empty.",
    route: "Detail image (route)",
    routeHint: "Namba, Tsutenkaku and Osaka Castle ship with a route map. Other plans hide the map until you upload one.",
    routeEmpty: "Not uploaded. The site will not show a route map.",
    upload: "Upload image",
    restore: "Restore default",
    remove: "Remove",
    next: "Next field",
    slug: "URL slug",
    price: "Price (JPY)",
    duration: "Duration (min)",
    distance: "Distance (km)",
    addons: "Add-ons",
    addonsHint: "Only checked items can be bought with this plan.",
    listed: "Listed",
    unfilled: "Empty",
    notUploaded: "Not uploaded",
    minutes: "min",
    km: "km",
    limitHint: "At least 600px on both sides, longest edge under 4000px, file under 2MB.",
    errSize: "Image must be under 2MB",
    errSmall: "Image is too small — width and height need 600px+",
    errLarge: "Image is too large — longest edge must stay under 4000px",
    errType: "Please upload a jpg, png or webp",
    errFail: "Could not read that image. Try another file.",
  },
  cms: {
    addVideo: "Add video",
    addReview: "Add review",
    addFaq: "Add question",
    addPress: "Add story",
    slot: "Placement",
    slotHero: "Home hero",
    slotGallery: "On the street",
    slotExperience: "Experience videos",
    slotPage: "Videos page",
    source: "Source",
    youtube: "YouTube link",
    file: "Upload file",
    youtubeUrl: "YouTube link or video ID",
    youtubeHint: "youtube.com, youtu.be, or an 11-character ID.",
    uploadVideo: "Upload video",
    videoHint: "mp4 / webm, max 12MB. Large files stay on this device.",
    startAt: "Start at (seconds)",
    startAtHint: "Start the same clip at different times so the six tiles don’t look identical.",
    errVideoType: "Please upload an mp4 or webm",
    errVideoSize: "Video must be under 12MB",
    invalidYoutube: "That YouTube link is not recognized",
    sectionTitle: "Section title",
    sectionLead: "Section lead",
    quote: "Review",
    name: "Name",
    country: "Country / region",
    photo: "Photo",
    homeFaq: "Show on home",
    homeFaqHint: "Checked items appear in the home FAQ. The FAQ page still lists every published question.",
    question: "Question",
    answer: "Answer",
    sourceName: "Outlet",
    pressTitle: "Headline",
    image: "Image",
    link: "Link (optional)",
    maps: "Map link",
    mapsHint: "Google Maps or any address URL.",
    address: "Address",
    station: "Station",
    walk: "Walking directions",
    visitLead: "Lead",
    howTitle: "Title",
    onlineLabel: "Online booking button",
    whatsappHint: "WhatsApp hint",
    showOnline: "Online booking",
    showWhatsapp: "WhatsApp",
    showPhone: "Phone",
    showEmail: "Email",
    showLine: "LINE",
    tabHome: "Home videos",
    tabGroup: "Gallery set",
    heroLoop: "Hero loop",
    galleryClip: "On the street",
    heroHint: "The looping clip behind the landing hero.",
    galleryHint: "The large clip before the plans. One title, one file or link.",
    groupHint: "The six experience tiles. Each card is one tile.",
    caption: "Title",
    channelLead: "Each channel has its own switch. Off means it will not show in the public booking block.",
    brandName: "Legal name",
    brandShort: "Short name (nav)",
    brandSuffix: "Suffix (e.g. Osaka)",
    logo: "Logo",
    logoHint: "Wordmark stays if empty. Square or landscape with a transparent background works best.",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    whatsapp: "WhatsApp link",
    social: "Social",
    instagram: "Instagram",
    youtubeSocial: "YouTube",
    x: "X",
    facebook: "Facebook",
    tiktok: "TikTok",
    line: "LINE",
    footerCompany: "Footer company line",
    saved: "Saved. The public site updates right away.",
    remove: "Delete",
    removeAsk: "Delete this item?",
    empty: "Nothing here yet.",
    on: "Listed",
    off: "Hidden",
    restore: "Restore default",
    sort: "Order",
    listed: "Listed",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    edit: "Edit",
    add: "Add",
    confirm: "Confirm",
    back: "Back",
    all: "All",
    none: "None",
    actions: "Actions",
    paid: "Paid",
    unpaid: "Unpaid",
    undecided: "TBD",
    notOpen: "Not live",
    wan: "k",
  },
  store: {
    all: "All stores",
    allSum: "All-store total",
    open: "Open",
    reserved: "Reserved",
    switchAria: "Switch store",
    locked: "Managers can only see their bound store",
    shops: "Stores",
    backAll: "Back to all stores",
    viewing: "Viewing",
    viewingAll: "Showing all-store totals. Click a shop card to see that store.",
  },
  storeNames: {
    namba: "Namba flagship",
    shinsaibashi: "Shinsaibashi (reserved)",
    umeda: "Umeda (reserved)",
  },
  storeAddresses: {
    namba: "Namba, Chuo-ku, Osaka",
    shinsaibashi: "Shinsaibashi, Chuo-ku, Osaka",
    umeda: "Umeda, Kita-ku, Osaka",
  },
  orderStatus: {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  },
  channel: {
    官网: "Website",
    微信: "WeChat",
    线下: "Walk-in",
    Klook: "Klook",
    Viator: "Viator",
    WhatsApp: "WhatsApp",
    Instagram: "Instagram",
    TikTok: "TikTok",
    携程: "Ctrip",
  },
  vehicleStatus: {
    available: "Ready",
    repair: "In repair",
    retired: "Retired",
  },
  staffRole: {
    admin: "Admin",
    manager: "Manager",
    staff: "Staff",
  },
  daypart: {
    morning: "Morning",
    afternoon: "Afternoon",
    dusk: "Dusk",
    night: "Night",
  },
  gender: { male: "Male", female: "Female" },
  nation: {
    USA: "United States",
    TW: "Taiwan",
    CN: "China",
    JP: "Japan",
    KR: "Korea",
    UK: "United Kingdom",
    other: "Other",
  },
  logType: {
    登录: "Sign in",
    登出: "Sign out",
    订单修改: "Order edit",
    库存调整: "Inventory",
    套餐上下架: "Plan listing",
    员工变更: "Staff change",
  },
  logRole: {
    超管: "Admin",
    店长: "Manager",
    员工: "Staff",
    系统: "System",
  },
  mailType: {
    预订确认: "Booking confirm",
    出发提醒: "Departure reminder",
    退款通知: "Refund notice",
    回访评价: "Review follow-up",
  },
  mailLocale: { "zh-TW": "Chinese", en: "English", ja: "Japanese" },
  payName: { alipay: "Alipay (cross-border)", wechat: "WeChat Pay (cross-border)" },
  reports: {
    today: "Today",
    week: "This week",
    month: "This month",
    custom: "Custom",
    switched: (label) => `Switched to ${label}`,
    from: "From",
    to: "To",
    customHint: "Changing dates refreshes the report right away.",
    rangeCaption: "Range",
    revenue: "Revenue",
    orderCount: "Orders",
    aov: "Avg. order",
    refunds: "Refunds",
    trend: (days) => `${days}-day revenue (this period vs last)`,
    trendMobile: "Revenue trend",
    current: "This period",
    previous: "Last period",
    channels: "Channels",
    channel: "Channel",
    orders: "Orders",
    revenueCol: "Revenue",
    cut: "Cut",
    cutHint: "Cuts recalculate net at once and sync to channel settings.",
    net: "Net",
    channelCard: (orders, cut, net) => `${orders} orders · ${cut}% cut · net ${net}`,
    plans: "Plan sales",
    plan: "Plan",
    sold: "Sold",
    share: "Revenue share",
    planCard: (sold, share) => `${sold} sold · ${share}%`,
    nations: "Nationality",
    genderTitle: "Gender",
    ages: "Age",
    people: "People",
    daypartTitle: "Time of day",
    exportCsv: "Export CSV",
    exportOk: "Exported",
    unitOrders: " orders",
  },
  analytics: {
    compare: "Compare",
    compareWeek: "This week vs last week",
    compareMonth: "This month vs last month",
    compareYear: "This month vs same month last year",
    apply: "Apply",
    applyOk: "Filters applied",
    rangeCaption: "This period",
    current: "This period",
    previous: "Compare period",
    metric: "Metric",
    mode: "Compare",
    day: "Date",
    sold: "Sold",
    orders: "Orders",
    bookings: "Bookings",
    completed: "Completed",
    cancelled: "Cancelled",
    revenue: "Revenue",
    profit: "Est. profit",
    aov: "Avg. order",
    bookingTrend: (days) => `Bookings (${days} days)`,
    revenueTrend: (days) => `Revenue (${days} days)`,
    planShare: "Plan mix",
    channelShare: "Platform",
    nations: "Nationality",
    gender: "Gender",
    ages: "Age",
    daypart: "Time of day",
    people: "People",
    empty: "No orders in this range.",
    deltaNew: "New",
  },
  dashboard: {
    todayOrders: "Today’s orders",
    todayRevenue: "Today’s revenue",
    pending: "Pending",
    freeKarts: "Open karts",
    allSum: "All-store total",
    vsYesterday: "vs yesterday",
    storeRevenue: "Today’s store revenue",
    needHandle: "Needs attention",
    noPending: "Nothing pending",
    kartsOk: (free, total) => `${free}/${total} ready`,
    count: (n) => `${n}`,
    newOrder: "New order",
    inventory: "Adjust stock",
    reports: "Reports",
    staff: "Staff",
    branches: "Shops",
    todayLine: (orders, yen) => `Today ${orders} · ${yen}`,
    pendingKarts: (pending, karts) => `Pending ${pending} · ready ${karts}`,
    timeline: "Today’s order timeline",
    emptyAll: "No orders today",
    emptyStore: "No orders at this shop today",
    orderMeta: (customer, riders, yen) => `${customer} · ${riders} · ${yen}`,
    people: "pax",
    shortcuts: "Shortcuts",
    mobileHint: "Confirm orders and adjust stock from your phone.",
    weekChart: "Orders, last 7 days",
    chartOrders: "Orders",
    managerStaff: "Managers confirm bookings from the orders list",
    managerReport: "Reports are admin-only, so they stay on the dashboard",
  },
  orders: {
    date: "Date",
    dateFrom: "From",
    dateTo: "To",
    today: "Today",
    allDates: "All dates",
    search: "Search ID / guest / plan",
    allStatus: "All statuses",
    add: "Add order",
    filtering: (date, n) => `Filtering ${date} · ${n}`,
    filteringFrom: (from, n) => `From ${from} · ${n}`,
    filteringTo: (to, n) => `Through ${to} · ${n}`,
    filteringRange: (from, to, n) => `${from} – ${to} · ${n}`,
    allDatesCount: (n) => `All dates · ${n}`,
    allChannels: "All channels",
    id: "Order ID",
    channel: "Channel",
    time: "Time",
    customer: "Guest",
    plan: "Plan",
    riders: "Riders",
    amount: "Amount",
    status: "Status",
    ops: "Actions",
    empty: "No matching orders",
    mf: (male, female) => `(${male} M / ${female} F)`,
    channelChip: (label, n) => `${label} ${n}`,
    edit: "Edit",
    refund: "Refund",
    confirm: "Confirm",
    detail: "Detail",
    saved: "Order saved. Stock synced to party size.",
    editTitle: "Edit order",
    addTitle: "Add order",
    customerName: "Guest name",
    email: "Email",
    passport: "ID / passport",
    docsTitle: "ID documents",
    docsHint: "Specimen images — tap to enlarge.",
    docPassport: "Passport",
    docLicense: "Driver licence",
    docIdp: "IDP",
    note: "Note",
    detailTitle: (id) => `Order ${id}`,
    addons: "Add-ons",
    phone: "Phone",
    nationality: "Nationality",
    idTaken: "That order ID is taken. Use another.",
    refundTitle: "Refund / cancel?",
    refundOk: "Confirm cancel",
    refundLead: (id, name) => `${id} (${name}) will be marked cancelled. Demo only — no real payout.`,
    refundNote: "Admin refund / cancel",
  },
  calendar: {
    month: "Month",
    week: "Week",
    threeDay: "3 days",
    day: "Day",
    prev: "Previous",
    next: "Next",
    dayOrders: (iso) => `Orders on ${iso}`,
    count: (n) => `${n}`,
    empty: "No orders this day. Click a date column to switch days, or a block to open detail.",
    drill: "Detail",
    heatOrders: "Click a date to refresh today’s list. Deep red >20, orange 10–20, green <10.",
    heatStock: "Green = open, orange = tight, red = full. Click a date for slots.",
    dayHint: (iso) => `Viewing ${iso}. Orders for that day are below.`,
    time: "Time",
    compactHint: "Portrait phones show three days. Rotate for a full week.",
    weekHint: "Block height matches plan length. Click a block for detail, or a date column for that day’s list.",
    minutes: (n) => `${n} min`,
  },
  inventory: {
    free: "Open",
    tight: "Tight",
    full: "Full",
    idle: "Off",
    remain: (left, cap) => `${left}/${cap} left`,
    yest: "Yest",
    today: "Today",
    tom: "Tmw",
    filter: "Filter",
    filtered: " · filtered",
    closeFilter: "Close filter",
    vehiclePh: "Vehicle ID / model",
    allStatus: "All statuses",
    stAvail: "Free / ready",
    stRepair: "Repair",
    stRetired: "Retired",
    special: "Special dates",
    clearToday: "Clear today’s stock",
    reset: "Reset default stock",
    vehicle: "Vehicle",
    collapse: "Collapse",
    expand: "Expand",
    idleLong: "Repair / retired",
    mergeHint: "Matching neighbors merge into a bar you can drag to edit in bulk",
    tipCap: (cap, booked, left, tone) => `Seats ${cap} · booked ${booked} · left ${left} (${tone})`,
    tipClosed: "Status: repair / retired",
    tipGuests: (names) => `Guests: ${names}`,
    noGuests: "None",
    editTitle: (code) => `Edit stock · ${code}`,
    saved: "Stock saved. Public slot leftover will sync.",
    slot: "Slot",
    seats: "Seats",
    booked: "Booked",
    status: "Status",
    open: "Bookable",
    closed: "Repair / retired",
    batchTitle: (n) => `Bulk edit ${n} slots`,
    setRepair: "Set repair",
    setOpen: "Make bookable",
    batchLead: "Continuous slots selected. Set them all to repair or bookable.",
    clearAsk: "Clear today’s stock?",
    resetAsk: "Reset default stock?",
    clearOk: "Clear",
    resetOk: "Reset",
    clearLead: "Every vehicle slot today will be marked full. No more bookings that day.",
    resetLead: "Rebuild today’s timeline from vehicle status and orders.",
    closeSpecial: "Close special dates",
    specialAdded: "Special date added. Closed days hide on the public calendar.",
    date: "Date",
    reason: "Reason",
    reasonPh: "e.g. extra night run",
    type: "Type",
    closeDay: "Closed all day",
    extra: "Extra session",
    dayView: "Day",
    weekView: "Week",
    monthView: "Month",
    batchWeek: "This week",
    batchMonth: "This month",
    batchRange: "Batch set",
    batchRangeTitle: "Batch set inventory",
    rangeFrom: "Start date",
    rangeTo: "End date",
    rangeToday: "Today",
    rangeInvalid: "End date can’t be before start date.",
    rangeTooLong: "Max 92 days at a time. Shorten the range.",
    rangePreview: (days, vehicles) => `Applies to ${days} days · ${vehicles} karts (current list filter).`,
    batchRangeLead: "Pick start and end dates. This week / this month only fill the fields — you can still edit them.",
    applyRange: "Apply to these dates",
    allKart: "All karts",
    rangeOpen: "Open all",
    rangeClose: "Close all",
    rangeSeats: "Set seats",
  },
  vehicles: {
    repairNote: (n) => `${n} in repair, pulled from today’s sellable stock.`,
    availNote: (n) => `${n} available. Vehicles in repair are excluded from today’s sellable stock.`,
    add: "Add vehicle",
    code: "ID",
    model: "Model",
    status: "Status",
    service: "Last service",
    note: "Note",
    logs: "Repair log",
    title: "Vehicle",
    saved: "Vehicle saved",
    logsTitle: (code) => `${code} repair log`,
    logAdd: "Add entry",
    logEmpty: "No repair log yet",
    logPh: "e.g. brake pads replaced",
  },
  staff: {
    add: "Add staff",
    name: "Name",
    email: "Email",
    role: "Role",
    store: "Store",
    status: "Status",
    lastLogin: "Last sign-in",
    on: "Active",
    off: "Disabled",
    reset: "Reset password",
    title: "Staff",
    saved: "Staff saved",
    password: "Starter password",
    passwordPh: "Any password in this demo",
    resetAsk: "Reset password?",
    offAsk: "Disable this account?",
    resetOk: "Password reset to a temp code",
    offOk: "Account disabled",
    demo: "Demo only changes memory. No real email is sent.",
  },
  settings: {
    tabPay: "Payments",
    tabChannels: "Channels",
    tabStores: "Stores",
    tabSend: "Sending",
    tabMail: "Templates",
    tabLogs: "Activity log",
    pay: "Payments",
    reserved: "Reserved — not live yet",
    on: "On",
    off: "Off",
    testMode: "Test mode",
    paySaved: "Payments saved. Checkout only shows methods that are on.",
    savePay: "Save payments",
    channels: "Channels",
    channelLead: "Channels stay in admin. OTA cuts feed store net in reports.",
    channelCut: "Cut %",
    channelLocked: "The website channel cannot be turned off",
    channelSaved: "Channels saved. Report cuts and manual order options sync.",
    saveChannels: "Save channels",
    addChannel: "Add channel",
    channelName: "Channel name",
    channelNamePh: "e.g. GetYourGuide",
    channelNameRequired: "Please enter a channel name",
    removeChannel: "Remove channel",
    stores: "Stores",
    addStore: "Add store",
    send: "Sending",
    sendLead:
      "A static site cannot store a mailbox password. Bind Gmail / Outlook on emailjs.com, set the template to {{to_email}}, {{subject}}, {{message}}, and add this domain to Allowed Origins. Guest mail goes to the order email; manager copies go to the inbox.",
    mailFrom: "From",
    mailTo: "Inbox",
    mailToPh: "New bookings and copies",
    sendSaved: "Sending settings saved",
    testing: "Sending…",
    testSend: "Send test",
    templates: "Templates",
    type: "Type",
    locale: "Language",
    updated: "Updated",
    logs: "Activity log",
    detail: "Detail",
    tplTitle: (type, locale) => `Edit template · ${type} (${locale})`,
    tplEdit: "Edit template",
    tplSaved: "Template saved",
    tplVars: "Variables: {{customer_name}} {{booking_id}} {{date}} {{time}} {{plan_name}} {{riders}} {{total}}",
    storeTitle: "Store",
    storeSaved: "Store saved. Public hours and phone will sync.",
    storeName: "Name",
    address: "Address",
    phone: "Phone",
    hours: "Hours",
  },
  logsPage: {
    title: "Activity log",
    back: "Back to settings",
    allActors: "Everyone",
    allTypes: "All types",
    recent: (shown, extra) =>
      extra ? `Latest ${shown}, ${extra} after filter` : `Latest ${shown}`,
    total: (n) => `${n} total`,
    time: "Time",
    actor: "Actor",
    role: "Role",
    type: "Type",
    detail: "Detail",
    empty: "No matching logs",
  },
  addons: {
    add: "Add add-on",
    max: (n) => `Max ${n}`,
    editTitle: "Edit add-on",
    addTitle: "Add add-on",
    saved: "Add-on saved. Public prices will sync.",
    nameZh: "Chinese name",
    desc: "Description",
    price: "Price",
    maxQty: "Max qty",
    icon: "Icon",
    camera: "Camera",
    costume: "Suit",
    photos: "Photos",
    insurance: "Insurance",
    delAsk: "Delete?",
    think: "Keep it",
    del: "Delete",
    deleted: "Add-on deleted",
    delLead: "It will drop off the public add-on list right away.",
  },
  roleGate: {
    title: "Admins only",
    lead: "Sign in with admin@test.com to open this page. Managers can handle today’s orders from the dashboard.",
  },
  notify: {
    status: (label) => `Changed to ${label}`,
    statusNoMail: (label) => `Changed to ${label}. Sending is not set up — add from, inbox and EmailJS in settings`,
    statusOk: (label, extra) => `Changed to ${label}. ${extra}`,
    statusFail: (label, extra) => `Changed to ${label}, but mail failed: ${extra}`,
    newOrderSubject: (id) => `New website order ${id}`,
    newOrderBody: (order) =>
      [
        "A website payment just finished. Waiting for admin confirm.",
        "",
        `Booking: ${order.id}`,
        `Guest: ${order.customer}`,
        `Email: ${order.email}`,
        `Phone: ${order.phone}`,
        `Plan: ${order.planName}`,
        `When: ${order.date} ${order.time}`,
        `Riders: ${order.riders}`,
        `Total: ${order.total}`,
      ].join("\n"),
    testNeed: "Fill from, inbox and EmailJS first",
    testSubject: "Future Kart Osaka send test",
    testBody: (from, to) => `Admin test mail.\nFrom: ${from}\nInbox: ${to}`,
    testOk: (to) => `Test mail sent → ${to}`,
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
  langEn: "EN",
  langJa: "日本語",
  super: "管理者",
  manager: "店長",
  orderDetail: "予約詳細",
  orderLead: (id) => `予約番号 ${id}`,
  nav: {
    "/admin/dashboard": "ダッシュボード",
    "/admin/bookings": "予約管理",
    "/admin/orders": "予約一覧",
    "/admin/calendar": "カレンダー",
    "/admin/inventory": "在庫管理",
    "/admin/vehicles": "車両管理",
    "/admin/plans": "コース管理",
    "/admin/content": "コンテンツ管理",
    "/admin/content/videos": "動画管理",
    "/admin/content/reviews": "レビュー管理",
    "/admin/content/faq": "FAQ",
    "/admin/content/press": "メディア掲載",
    "/admin/content/meetup": "集合場所",
    "/admin/affiliates": "紹介代理",
    "/admin/bookings/how": "予約スイッチ設定",
    "/admin/settings/booking": "予約スイッチ設定",
    "/admin/reports": "売上レポート",
    "/admin/reports/overview": "売上概況",
    "/admin/reports/analytics": "データ分析",
    "/admin/staff": "スタッフ管理",
    "/admin/settings": "システム設定",
    "/admin/settings/pay": "決済",
    "/admin/settings/channels": "チャネル設定",
    "/admin/settings/stores": "店舗",
    "/admin/settings/email": "メール設定",
    "/admin/settings/send": "メール設定",
    "/admin/settings/mail": "メール設定",
    "/admin/settings/logs": "操作ログ",
    "/admin/site": "サイト設定",
  },
  pages: {
    "/admin/dashboard": { title: "ダッシュボード", lead: "管理者は全店舗の合計が初期表示されます。店舗カードを選択すると、その店舗のデータを確認できます。店長は自店舗のデータのみ表示されます。" },
    "/admin/bookings": { title: "予約一覧", lead: "予約を一覧で管理できます。ステータスをクリックすると、詳細画面を開かずに直接変更できます。" },
    "/admin/orders": { title: "予約一覧", lead: "予約を一覧で管理できます。ステータスをクリックすると、詳細画面を開かずに直接変更できます。" },
    "/admin/calendar": { title: "カレンダー", lead: "月・週・日単位で予約を確認できます。日付を選択して一覧を切り替え、色付きのブロックから予約詳細を確認できます。" },
    "/admin/inventory": { title: "在庫管理", lead: "日／週／月。任意の期間で車両在庫をまとめて設定できます。" },
    "/admin/vehicles": { title: "車両管理", lead: "整備中の車両は当日の販売在庫から除外されます。" },
    "/admin/plans": { title: "コース管理", lead: "カードの見出し画像・ルート図・紹介文・価格・所要時間・オプションを編集できます。" },
    "/admin/content": { title: "動画管理", lead: "トップページ動画とギャラリー動画を分けて管理します。各カードが1つの表示枠に対応しています。" },
    "/admin/content/videos": { title: "動画管理", lead: "トップページ動画とギャラリー動画を分けて管理します。各カードが1つの表示枠に対応しています。" },
    "/admin/content/reviews": { title: "レビュー管理", lead: "フロントの「ユーザーレビュー」に対応しています。レビュー内容、名前、写真を編集できます。" },
    "/admin/content/faq": { title: "FAQ", lead: "トップページには「トップページ」にチェックを入れた項目のみ表示され、FAQページには公開中の質問がすべて表示されます。" },
    "/admin/content/press": { title: "メディア掲載", lead: "トップページのニュースセクションには、公開中のコンテンツを最大3件まで表示します。" },
    "/admin/content/meetup": { title: "集合場所", lead: "フロントの「Access」セクションに表示する集合場所の案内文です。正確な住所は予約後にのみお送りします。" },
    "/admin/affiliates": { title: "紹介代理", lead: "紹介者の一覧と編集。詳細でリンクと手数料を確認。" },
    "/admin/bookings/how": { title: "予約スイッチ設定", lead: "予約受付の入口をオン／オフにします。オフにした入口は、公式サイトに表示されません。" },
    "/admin/settings/booking": { title: "予約スイッチ設定", lead: "予約受付の入口をオン／オフにします。オフにした入口は、公式サイトに表示されません。" },
    "/admin/site": { title: "サイト設定", lead: "会社名・ロゴ・電話番号・メールアドレス・フッターのSNSを設定します。" },
    "/admin/reports": { title: "売上レポート", lead: "売上推移とプラン別の販売状況を確認できます。" },
    "/admin/reports/overview": { title: "売上レポート", lead: "売上推移とプラン別の販売状況を確認できます。" },
    "/admin/reports/analytics": { title: "データ分析", lead: "今週と先週、今月と先月、今月と前年同月を比較できます。チャネル別、性別、国籍、予約時間帯もあわせて集計します。" },
    "/admin/staff": { title: "スタッフ管理", lead: "管理者はスタッフの追加、権限変更、パスワードのリセット、利用停止ができます。" },
    "/admin/settings": { title: "決済設定", lead: "公式サイトの決済画面には、オンになっている支払い方法のみ表示されます。" },
    "/admin/settings/pay": { title: "決済設定", lead: "公式サイトの決済画面には、オンになっている支払い方法のみ表示されます。" },
    "/admin/settings/channels": { title: "チャネル設定", lead: "チャネル情報は管理画面でのみ使用し、サイトには表示されません。OTAの手数料は、レポート上の店舗受取額の計算に使用されます。" },
    "/admin/settings/stores": { title: "店舗管理", lead: "電話・住所・営業時間はサイトにも同期されます。" },
    "/admin/settings/email": { title: "メール設定", lead: "送信元メールアドレスを設定し、お客様の言語に応じて予約確認・リマインダー・返金メールの文面を編集します。" },
    "/admin/settings/send": { title: "メール設定", lead: "送信元メールアドレスを設定し、お客様の言語に応じて予約確認・リマインダー・返金メールの文面を編集します。" },
    "/admin/settings/mail": { title: "メール設定", lead: "送信元メールアドレスを設定し、お客様の言語に応じて予約確認・リマインダー・返金メールの文面を編集します。" },
    "/admin/settings/logs": { title: "操作ログ", lead: "管理画面上のすべての操作履歴を確認できます。" },
  },
  plans: {
    add: "コースを追加",
    edit: "コースを編集",
    save: "保存",
    saved: "保存しました。画像はこのブラウザにあります。別の端末では再アップロードが必要です。",
    copyHint: "折りたたみ時は名称・紹介・ハイライトのみ表示されます。展開するとプルダウンから言語を切り替え、1言語ずつ入力できます。",
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
    coverHint: "プランカード上部の大きな画像です。16:9（約1600×900）を推奨します。画像をアップロードしない場合は、デフォルトの街並み画像が使用されます。",
    route: "ルート図",
    routeHint: "難波・通天閣・大阪城の3つのコースには標準のルート図が設定されています。その他のプランは、画像をアップロードしない場合、サイト上にルート図は表示されません。",
    routeEmpty: "未設定の場合、サイト上にルート図は表示されません。",
    upload: "画像をアップロード",
    restore: "デフォルトに戻す",
    remove: "削除",
    next: "次へ",
    slug: "URLコード",
    price: "料金（円）",
    duration: "所要時間（分）",
    distance: "距離（km）",
    addons: "選択可能なオプション",
    addonsHint: "チェックした項目のみ、このプランの予約時に選択できます。",
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
  cms: {
    addVideo: "動画を追加",
    addReview: "レビューを追加",
    addFaq: "質問を追加",
    addPress: "報道を追加",
    slot: "表示場所",
    slotHero: "トップ主映像",
    slotGallery: "現場映像",
    slotExperience: "体験動画",
    slotPage: "動画ページ",
    source: "ソース",
    youtube: "YouTubeリンク",
    file: "ローカルアップロード",
    youtubeUrl: "YouTubeリンクまたはID",
    youtubeHint: "youtube.com、youtu.be、または11桁のID。",
    uploadVideo: "動画をアップロード",
    videoHint: "mp4 / webm、12MB以下。大容量ファイルはこの端末に保存されるため、別のPCでは再度アップロードする必要があります。",
    startAt: "開始秒数",
    startAtHint: "同じ映像でも開始位置をずらすと、6枚が同じ画面になりません。",
    errVideoType: "mp4 または webm をアップロードしてください",
    errVideoSize: "動画は12MB以下にしてください",
    invalidYoutube: "YouTubeリンクを認識できません",
    sectionTitle: "セクションタイトル",
    sectionLead: "セクション説明",
    quote: "レビュー内容",
    name: "氏名",
    country: "国・地域",
    photo: "写真",
    homeFaq: "トップページに表示",
    homeFaqHint: "チェックすると、トップページに表示されます。FAQページには、掲載中の質問がすべて表示されます。",
    question: "質問",
    answer: "回答",
    sourceName: "媒体名",
    pressTitle: "見出し",
    image: "画像",
    link: "リンク（任意）",
    maps: "地図リンク",
    mapsHint: "Googleマップまたは、住所が掲載される任意のリンクを設定できます。",
    address: "住所",
    station: "最寄駅",
    walk: "徒歩案内",
    visitLead: "リード",
    howTitle: "見出し",
    onlineLabel: "オンライン予約ボタン",
    whatsappHint: "WhatsAppのヒント",
    showOnline: "オンライン予約",
    showWhatsapp: "WhatsApp",
    showPhone: "電話",
    showEmail: "メール",
    showLine: "LINE",
    tabHome: "トップページ動画",
    tabGroup: "ギャラリー動画",
    heroLoop: "トップ背景ループ動画",
    galleryClip: "実際の走行風景",
    heroHint: "ランディングページ最上部でループ再生する背景動画です。",
    galleryHint: "プラン紹介の前に表示する大きな動画です。1つのタイトルにつき、1つのファイルまたはリンクを設定できます。",
    groupHint: "フロントの「体験動画」に表示される動画です。各カードが1つの表示枠に対応しています。",
    caption: "見出し",
    channelLead: "各入口を個別にオン／オフできます。オフにすると、公式サイトの予約エリアに表示されなくなります。リンクは各予約入口にのみ適用されます。",
    brandName: "正式名称",
    brandShort: "略称（ナビゲーション）",
    brandSuffix: "サフィックス（例：Osaka）",
    logo: "ロゴ",
    logoHint: "アップロードしない場合は、テキストロゴが引き続き使用されます。正方形または横長の透過背景画像を推奨します。",
    phone: "電話",
    email: "メール",
    hours: "営業時間",
    whatsapp: "WhatsAppリンク",
    social: "SNS",
    instagram: "Instagram",
    youtubeSocial: "YouTube",
    x: "X",
    facebook: "Facebook",
    tiktok: "TikTok",
    line: "LINE",
    footerCompany: "フッターの会社行",
    saved: "保存しました。サイトにすぐ反映されます。",
    remove: "削除",
    removeAsk: "この項目を削除しますか？",
    empty: "まだありません。",
    on: "掲載中",
    off: "非掲載",
    restore: "デフォルトに戻す",
    sort: "並び",
    listed: "掲載",
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
    viewingAll: "現在は全店舗の合計を表示しています。店舗カードを選択すると、その店舗のデータを表示します。",
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
    pending: "確認待ち",
    confirmed: "確定済",
    cancelled: "キャンセル",
    completed: "完了",
  },
  channel: {
    官网: "公式サイト",
    微信: "WeChat",
    线下: "現地受付",
    Klook: "Klook",
    Viator: "Viator",
    WhatsApp: "WhatsApp",
    Instagram: "Instagram",
    TikTok: "TikTok",
    携程: "Ctrip",
  },
  vehicleStatus: {
    available: "利用可能",
    repair: "整備中",
    retired: "使用停止",
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
    aov: "平均客単価",
    refunds: "返金総額",
    trend: (days) => `${days}日間の売上推移（今期 vs 前期）`,
    trendMobile: "売上推移",
    current: "当期",
    previous: "前期",
    channels: "チャネル",
    channel: "予約チャネル",
    orders: "件数",
    revenueCol: "売上",
    cut: "手数料",
    cutHint: "手数料を変更すると入金額が即時に再計算され、チャネル設定にも反映されます。",
    net: "入金",
    channelCard: (orders, cut, net) => `${orders}件・手数料${cut}%・入金${net}`,
    plans: "プラン別販売数",
    plan: "プラン",
    sold: "販売数",
    share: "売上構成比",
    planCard: (sold, share) => `${sold}件・${share}%`,
    nations: "国籍",
    genderTitle: "男女比",
    ages: "年代",
    people: "人数",
    daypartTitle: "出発時間帯",
    exportCsv: "CSVをエクスポート",
    exportOk: "書き出しました",
    unitOrders: "件",
  },
  analytics: {
    compare: "比較方法",
    compareWeek: "今週と先週",
    compareMonth: "今月と先月",
    compareYear: "今月と前年同月",
    apply: "フィルターを適用",
    applyOk: "条件で更新しました",
    rangeCaption: "当期",
    current: "当期",
    previous: "比較期",
    metric: "指標",
    mode: "比較",
    day: "日付",
    sold: "件数",
    orders: "予約",
    bookings: "予約数",
    completed: "完了",
    cancelled: "キャンセル",
    revenue: "総売上",
    profit: "当期予想利益",
    aov: "平均客単価",
    bookingTrend: (days) => `予約数の推移（${days}日）`,
    revenueTrend: (days) => `売上の推移（${days}日）`,
    planShare: "プラン構成",
    channelShare: "予約チャネル",
    nations: "国籍",
    gender: "男女比",
    ages: "年代",
    daypart: "出発時間帯",
    people: "人数",
    empty: "この期間の予約はありません。",
    deltaNew: "新規",
  },
  dashboard: {
    todayOrders: "本日の予約",
    todayRevenue: "本日の売上",
    pending: "確認待ち",
    freeKarts: "利用可能",
    allSum: "全店舗合計",
    vsYesterday: "前日比",
    storeRevenue: "本日の店舗売上",
    needHandle: "早めに確認してください",
    noPending: "確認待ちはありません",
    kartsOk: (free, total) => `${free}/${total}台利用可能`,
    count: (n) => `${n}件`,
    newOrder: "予約を追加",
    inventory: "在庫を調整",
    reports: "レポートを見る",
    staff: "スタッフ管理",
    branches: "店舗",
    todayLine: (orders, yen) => `本日${orders}件・${yen}`,
    pendingKarts: (pending, karts) => `確認待ち${pending}件・利用可能な車両${karts}台`,
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
    dateFrom: "開始日",
    dateTo: "終了日",
    today: "今日",
    allDates: "全日付",
    search: "予約番号／氏名／コース",
    allStatus: "全ステータス",
    add: "予約を追加",
    filtering: (date, n) => `${date}を表示・${n}件`,
    filteringFrom: (from, n) => `${from}以降・${n}件`,
    filteringTo: (to, n) => `${to}まで・${n}件`,
    filteringRange: (from, to, n) => `${from}〜${to}・${n}件`,
    allDatesCount: (n) => `全日付・${n}件`,
    allChannels: "全チャネル",
    id: "予約番号",
    channel: "予約チャネル",
    time: "時刻",
    customer: "名前",
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
    docsTitle: "身分証の登録",
    docsHint: "見本画像です。タップで拡大します。",
    docPassport: "パスポート",
    docLicense: "運転免許証",
    docIdp: "IDP",
    note: "メモ",
    detailTitle: (id) => `予約 ${id}`,
    addons: "オプション",
    phone: "電話",
    nationality: "国籍",
    idTaken: "この予約番号は既に使われています。",
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
    empty: "この日の予約はありません。上の日付列で日付を切り替え、色ブロックで詳細を開けます。",
    drill: "詳細",
    heatOrders: "日付を押すと下の当日一覧が変わります。濃い赤は20件超、橙は10–20、緑は10件未満。",
    heatStock: "緑＝余裕、橙＝逼迫、赤＝満席。日付を押すと時間帯を見ます。",
    dayHint: (iso) => `${iso}を表示中。下にその日の予約一覧があります。`,
    time: "時刻",
    compactHint: "縦向きでは3日ずつ。矢印で移動。横向きにすると1週間が見えます。",
    weekHint: "色付きブロックの高さはプランの所要時間を表しています。選択すると予約詳細を確認でき、日付の列を選択すると下の一覧がその日の予約に切り替わります。",
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
    stAvail: "利用可能",
    stRepair: "整備中",
    stRetired: "使用停止",
    special: "特別日",
    clearToday: "本日在庫を空にする",
    reset: "標準在庫に戻す",
    vehicle: "車両",
    collapse: "閉じる",
    expand: "開く",
    idleLong: "整備 / 使用停止",
    mergeHint: "同じ状態が続くと1本にまとまり、ドラッグでまとめて変更できます",
    tipCap: (cap, booked, left, tone) => `座席${cap}・予約済${booked}・残${left}（${tone}）`,
    tipClosed: "状態：整備 / 使用停止",
    tipGuests: (names) => `お客さま：${names}`,
    noGuests: "なし",
    editTitle: (code) => `在庫を編集 · ${code}`,
    saved: "在庫を保存しました。サイトの空きも同期されます",
    slot: "時間帯",
    seats: "総座席",
    booked: "予約数",
    status: "状態",
    open: "予約可",
    closed: "整備 / 使用停止",
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
    dayView: "日",
    weekView: "週",
    monthView: "月",
    batchWeek: "今週",
    batchMonth: "今月",
    batchRange: "一括設定",
    batchRangeTitle: "在庫を一括設定",
    rangeFrom: "開始日",
    rangeTo: "終了日",
    rangeToday: "今日",
    rangeInvalid: "終了日は開始日より前にできません。",
    rangeTooLong: "一度に最大92日です。期間を短くしてください。",
    rangePreview: (days, vehicles) => `${days}日・${vehicles}台に適用します（現在の絞り込み）。`,
    batchRangeLead: "開始日と終了日を指定します。今週／今月は入力補助で、あとから直せます。",
    applyRange: "この日付に適用",
    allKart: "全車両",
    rangeOpen: "すべて営業",
    rangeClose: "すべて休業",
    rangeSeats: "座席数を揃える",
  },
  vehicles: {
    repairNote: (n) => `整備中${n}台。当日の販売在庫から除外されています。`,
    availNote: (n) => `利用可能${n}台。整備中の車両は当日の販売在庫から除外されます。`,
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
    logAdd: "記録を追加",
    logEmpty: "整備記録はまだありません",
    logPh: "例：ブレーキパッド交換",
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
    tabChannels: "チャネル",
    tabStores: "店舗",
    tabSend: "メール送信",
    tabMail: "メール文面",
    tabLogs: "操作ログ",
    pay: "決済設定",
    reserved: "準備中の経路です",
    on: "オン",
    off: "オフ",
    testMode: "テストモード",
    paySaved: "決済を保存しました。公式サイトの会計はオンの方法だけ出ます",
    savePay: "設定を保存",
    channels: "チャネル設定",
    channelLead: "チャネル情報は管理画面でのみ使用し、サイトには表示されません。OTAの手数料は、レポート上の店舗受取額の計算に使用されます。",
    channelCut: "手数料%",
    channelLocked: "公式サイトのチャネルは無効にできません。",
    channelSaved: "チャネルを保存しました。手数料と手入力の選択肢も同期されます",
    saveChannels: "チャネルを保存",
    addChannel: "チャネルを追加",
    channelName: "チャネル名",
    channelNamePh: "例：GetYourGuide",
    channelNameRequired: "チャネル名を入力してください",
    removeChannel: "チャネルを削除",
    stores: "店舗管理",
    addStore: "店舗を追加",
    send: "メール送信",
    sendLead:
      "静的サイトではメールアドレスのパスワードを入力できません。emailjs.com で送信元メールアドレスをGmail / Outlookと連携してください。テンプレートの宛先には {{to_email}}、件名には {{subject}}、本文には {{message}} を設定してください。Allowed Originsには本サイトのドメインを追加してください。お客様へのメールは予約時に登録されたメールアドレスへ送信され、店長にはCCで受信トレイに送信されます。",
    mailFrom: "送信元メールアドレス",
    mailTo: "受信トレイ",
    mailToPh: "新予約とコピーの宛先",
    sendSaved: "送信設定を保存しました",
    testing: "送信中…",
    testSend: "テストメールを送信",
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
    storeSaved: "店舗を保存しました。電話番号・住所・営業時間はサイトにも同期されます",
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
    testSubject: "Future Kart Osaka 送信テスト",
    testBody: (from, to) => `管理画面のテストメールです。\n送信元：${from}\n受信箱：${to}`,
    testOk: (to) => `テストメールを送信しました → ${to}`,
  },
};

export function adminCopy(locale: string): AdminCopy {
  if (locale.startsWith("ja")) return ja;
  if (locale.startsWith("en")) return en;
  return zh;
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
