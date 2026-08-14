-- Seed: 3 plans + 2 addons, 5 locales.

insert into public.plans (
  id, slug, duration_minutes, distance_km, base_price_jpy, max_participants, is_active
) values
  ('a1111111-1111-4111-8111-111111111111', 'standard', 60, 8, 8000, 4, true),
  ('a2222222-2222-4222-8222-222222222222', 'night-run', 60, 10, 9800, 4, true),
  ('a3333333-3333-4333-8333-333333333333', 'grand-tour', 90, 15, 12800, 4, true)
on conflict (slug) do nothing;

insert into public.plan_translations (
  plan_id, locale, name, description, highlights, route_summary, includes, requirements
) values
  ('a1111111-1111-4111-8111-111111111111', 'en', 'Standard Street Run', 'The first-timer favorite. Drive a street-legal kart through Osaka neon streets with a professional guide.', array['60 minutes on the street', 'Dotonbori night lights', 'Suit and helmet included'], 'Namba check-in → Dotonbori loop → Shinsaibashi return.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a1111111-1111-4111-8111-111111111111', 'zh-CN', '标准街头体验', '初次体验首选。在专业向导带领下，驾驶合法上路的卡丁车穿行大阪霓虹街道。', array['街头驾驶 60 分钟', '道顿堀夜景', '含赛车服与头盔'], '难波集合 → 道顿堀环线 → 心斋桥返回。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a1111111-1111-4111-8111-111111111111', 'zh-TW', '標準街頭體驗', '初次體驗首選。在專業嚮導帶領下，駕駛合法上路的卡丁車穿行大阪霓虹街道。', array['街頭駕駛 60 分鐘', '道頓堀夜景', '含賽車服與頭盔'], '難波集合 → 道頓堀環線 → 心齋橋返回。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a1111111-1111-4111-8111-111111111111', 'ja', 'スタンダード街乗り', '初めての方に人気。プロのガイドとともに、大阪のネオン街を公道カートで走ります。', array['ストリート走行60分', '道頓堀の夜景', 'スーツとヘルメット込み'], '難波集合 → 道頓堀ループ → 心斎橋へ戻る。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a1111111-1111-4111-8111-111111111111', 'ko', '스탠다드 스트리트 런', '처음 방문하는 분께 추천. 전문 가이드와 함께 오사카 네온 거리를 스트리트 카트로 달립니다.', array['스트리트 주행 60분', '도톤보리 야경', '슈트와 헬멧 포함'], '난바 체크인 → 도톤보리 루프 → 신사이바시 복귀.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발']),
  ('a2222222-2222-4222-8222-222222222222', 'en', 'Night Dotonbori Run', 'After-dark streets, denser neon, and a route timed for the brightest Osaka night.', array['Best after sunset', 'Photo-ready neon', 'Guide-led convoy'], 'Evening departure from Namba through Dotonbori and the inner-city lights.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a2222222-2222-4222-8222-222222222222', 'zh-CN', '夜间道顿堀骑行', '日落后出发，霓虹更密，路线对准大阪最亮的夜景时段。', array['日落后来最好', '适合拍照的霓虹', '向导车队带领'], '傍晚从难波出发，穿行道顿堀与市中心灯光带。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a2222222-2222-4222-8222-222222222222', 'zh-TW', '夜間道頓堀騎行', '日落後出發，霓虹更密，路線對準大阪最亮的夜景時段。', array['日落後來最好', '適合拍照的霓虹', '嚮導車隊帶領'], '傍晚從難波出發，穿行道頓堀與市中心燈光帶。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a2222222-2222-4222-8222-222222222222', 'ja', 'ナイト道頓堀ラン', '日没後の街並み。ネオンがより強く、大阪の夜が一番明るい時間に合わせたルートです。', array['日没後がおすすめ', '写真映えするネオン', 'ガイド隊列'], '夕方に難波を出発し、道頓堀と都心の明かりを走ります。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a2222222-2222-4222-8222-222222222222', 'ko', '나이트 도톤보리 런', '해가 진 뒤 출발합니다. 네온이 더 진하고, 오사카 밤이 가장 밝은 시간대에 맞춘 코스입니다.', array['일몰 이후 추천', '사진용 네온', '가이드 대열'], '저녁에 난바를 출발해 도톤보리와 도심 조명 구간을 달립니다.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발']),
  ('a3333333-3333-4333-8333-333333333333', 'en', 'Grand City Tour', 'A longer street kart run covering more of central Osaka. Built for riders who want extra time on the road.', array['90 minutes', 'Extended city loop', 'More photo stops'], 'Namba → Dotonbori → wider inner-city loop → return to base.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a3333333-3333-4333-8333-333333333333', 'zh-CN', '城市长线体验', '更长的街头卡丁车路线，覆盖大阪市中心更多路段，适合想多开一会儿的车手。', array['90 分钟', '加长市区环线', '更多拍照停留'], '难波 → 道顿堀 → 更宽的市区环线 → 返回集合点。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a3333333-3333-4333-8333-333333333333', 'zh-TW', '城市長線體驗', '更長的街頭卡丁車路線，覆蓋大阪市中心更多路段，適合想多開一會兒的車手。', array['90 分鐘', '加長市區環線', '更多拍照停留'], '難波 → 道頓堀 → 更寬的市區環線 → 返回集合點。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a3333333-3333-4333-8333-333333333333', 'ja', 'グランドシティツアー', '大阪都心をより広く走る長めのストリートカート。もっと走りたい方向けです。', array['90分', '拡張シティループ', '撮影スポット多め'], '難波 → 道頓堀 → より広い都心ループ → 基地へ戻る。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a3333333-3333-4333-8333-333333333333', 'ko', '그랜드 시티 투어', '오사카 도심을 더 넓게 도는 긴 스트리트 카트 코스. 조금 더 달리고 싶은 분께 맞습니다.', array['90분', '확장 도심 루프', '포토 스톱 추가'], '난바 → 도톤보리 → 더 넓은 도심 루프 → 베이스 복귀.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발'])
on conflict (plan_id, locale) do nothing;

insert into public.addons (id, slug, price_jpy, max_qty, is_active) values
  ('b1111111-1111-4111-8111-111111111111', 'gopro', 2000, 1, true),
  ('b2222222-2222-4222-8222-222222222222', 'costume', 1500, 1, true)
on conflict (slug) do nothing;

insert into public.addon_translations (addon_id, locale, name, description) values
  ('b1111111-1111-4111-8111-111111111111', 'en', 'GoPro recording', 'Front-mounted camera so you can keep the ride.'),
  ('b1111111-1111-4111-8111-111111111111', 'zh-CN', 'GoPro 录像', '车头固定摄像头，把整段骑行留下来。'),
  ('b1111111-1111-4111-8111-111111111111', 'zh-TW', 'GoPro 錄影', '車頭固定攝影機，把整段騎行留下來。'),
  ('b1111111-1111-4111-8111-111111111111', 'ja', 'GoPro撮影', '前方カメラで走行を記録できます。'),
  ('b1111111-1111-4111-8111-111111111111', 'ko', 'GoPro 촬영', '전방 카메라로 주행을 남길 수 있습니다.'),
  ('b2222222-2222-4222-8222-222222222222', 'en', 'Costume upgrade', 'Pick a themed racing suit for photos on the street.'),
  ('b2222222-2222-4222-8222-222222222222', 'zh-CN', '服装升级', '可选主题赛车服，方便在街头拍照。'),
  ('b2222222-2222-4222-8222-222222222222', 'zh-TW', '服裝升級', '可選主題賽車服，方便在街頭拍照。'),
  ('b2222222-2222-4222-8222-222222222222', 'ja', 'コスチュームアップグレード', 'ストリート撮影向けのテーマスーツを選べます。'),
  ('b2222222-2222-4222-8222-222222222222', 'ko', '의상 업그레이드', '거리에서 사진 찍기 좋은 테마 슈트를 고를 수 있습니다.')
on conflict (addon_id, locale) do nothing;
