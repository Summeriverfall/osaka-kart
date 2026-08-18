-- Seed: 3 plans + 3 addons, 5 locales.
-- Run after supabase/migrations/20260814120000_init_catalog.sql

insert into public.plans (
  id, slug, duration_minutes, distance_km, base_price_jpy, max_participants, is_active
) values
  ('a1111111-1111-4111-8111-111111111111', 'standard', 60, 8, 12800, 4, true),
  ('a2222222-2222-4222-8222-222222222222', 'night-run', 90, 10, 15800, 4, true),
  ('a3333333-3333-4333-8333-333333333333', 'grand-tour', 120, 15, 18800, 4, true)
on conflict (slug) do update set
  duration_minutes = excluded.duration_minutes,
  distance_km = excluded.distance_km,
  base_price_jpy = excluded.base_price_jpy,
  max_participants = excluded.max_participants,
  is_active = excluded.is_active;

insert into public.plan_translations (
  plan_id, locale, name, description, highlights, route_summary, includes, requirements
) values
  ('a1111111-1111-4111-8111-111111111111', 'en', 'Namba 60-minute course', 'A 60-minute run through Namba in central Osaka. See the busy streets and famous sights while you drive. Built for first-timers, so you can feel the city on a short loop.', array['60 minutes in Namba', 'Famous streets and sights', 'Easy for first-timers'], 'Namba check-in → Dotonbori loop → Shinsaibashi return.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a1111111-1111-4111-8111-111111111111', 'zh-CN', '难波60分钟套餐', '在大阪市中心的难波，体验60分钟的冒险。您可以一边欣赏热门景点和热闹街景，一边感受速度的激情。路线专为新手设计，即使是第一次体验的人也能放心参与，在短时间内充分感受大阪的活力氛围。', array['难波 60 分钟', '热门街景', '适合新手'], '难波集合 → 道顿堀环线 → 心斋桥返回。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a1111111-1111-4111-8111-111111111111', 'zh-TW', '難波60分鐘套餐', '在大阪市中心的難波，體驗60分鐘的冒險。您可以一邊欣賞熱門景點和熱鬧街景，一邊感受速度的激情。路線專為新手設計，即使是第一次體驗的人也能放心參與，在短時間內充分感受大阪的活力氛圍。', array['難波 60 分鐘', '熱門街景', '適合新手'], '難波集合 → 道頓堀環線 → 心齋橋返回。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a1111111-1111-4111-8111-111111111111', 'ja', '難波60分コース', '大阪都心の難波を走る60分。人気スポットと賑わいを見ながらスピードを楽しめます。初めての方でも安心して乗れる短いコースです。', array['難波60分', '人気の街並み', '初めてでも安心'], '難波集合 → 道頓堀ループ → 心斎橋へ戻る。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a1111111-1111-4111-8111-111111111111', 'ko', '난바 60분 코스', '오사카 도심 난바에서 60분. 인기 명소와 붐비는 거리를 보며 달립니다. 처음 타는 분도 짧은 코스로 오사카의 활기를 느낄 수 있습니다.', array['난바 60분', '인기 거리', '초심자용'], '난바 체크인 → 도톤보리 루프 → 신사이바시 복귀.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발']),
  ('a2222222-2222-4222-8222-222222222222', 'en', 'Tsutenkaku 90-minute course', 'A 90-minute ride centered on Tsutenkaku. More local streets, more landmarks, and a longer loop so you can take the city in at an easier pace.', array['90 minutes', 'Tsutenkaku', 'Local Osaka sights'], 'Namba → Nipponbashi → Shinsekai / Tsutenkaku → return.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a2222222-2222-4222-8222-222222222222', 'zh-CN', '通天阁90分钟套餐', '以大阪地标通天阁为中心，体验90分钟的行程。感受地道风情，游览多处著名景点，深入体验大阪的独特魅力。路线较长，亮点丰富，让您可以悠闲地享受并充分体验冒险的乐趣。', array['通天阁 90 分钟', '地道风情', '著名景点'], '难波 → 日本桥 → 新世界／通天阁 → 返回。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a2222222-2222-4222-8222-222222222222', 'zh-TW', '通天閣90分鐘套餐', '以大阪地標通天閣為中心，體驗90分鐘的行程。感受地道風情，遊覽多處著名景點，深入體驗大阪的獨特魅力。路線較長，亮點豐富，讓您可以悠閒地享受並充分體驗冒險的樂趣。', array['通天閣 90 分鐘', '地道風情', '著名景點'], '難波 → 日本橋 → 新世界／通天閣 → 返回。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a2222222-2222-4222-8222-222222222222', 'ja', '通天閣90分コース', '大阪のランドマーク通天閣を中心に走る90分。ローカルな街並みと名所をまわり、長めのコースで冒険をゆっくり楽しめます。', array['通天閣90分', 'ローカルな街', '名所めぐり'], '難波 → 日本橋 → 新世界／通天閣 → 戻る。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a2222222-2222-4222-8222-222222222222', 'ko', '츠텐카쿠 90분 코스', '오사카의 상징 츠텐카쿠를 중심으로 90분. 로컬 거리와 명소를 돌며, 여유 있게 모험을 즐길 수 있는 긴 코스입니다.', array['츠텐카쿠 90분', '로컬 분위기', '명소'], '난바 → 닛폰바시 → 신세카이/츠텐카쿠 → 복귀.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발']),
  ('a3333333-3333-4333-8333-333333333333', 'en', 'Osaka Castle 120-minute course', 'A 120-minute kart run with Osaka Castle as the backdrop. History and the modern city on one loop — for visitors who want the landmarks at an easier pace.', array['120 minutes', 'Osaka Castle', 'History and the city'], 'Namba → castle loop → return to base.', array['Kart rental', 'Helmet and racing suit', 'Insurance', 'Guide', 'Safety briefing'], array['Valid driving license or International Driving Permit', 'Minimum age 18', 'Closed-toe shoes']),
  ('a3333333-3333-4333-8333-333333333333', 'zh-CN', '大阪城120分钟套餐', '以历史悠久的大阪城为背景，体验120分钟的特别卡丁车之旅。游览大阪历史与现代交融的景点，充分享受卡丁车的乐趣。非常适合喜欢悠闲游览大阪代表性景点的游客。', array['大阪城 120 分钟', '历史与现代', '悠闲游览'], '难波 → 大阪城环线 → 返回集合点。', array['卡丁车租赁', '头盔与赛车服', '保险', '向导', '安全说明'], array['有效驾照或国际驾驶许可', '年满 18 岁', '穿包头鞋']),
  ('a3333333-3333-4333-8333-333333333333', 'zh-TW', '大阪城120分鐘套餐', '以歷史悠久的大阪城為背景，體驗120分鐘的特別卡丁車之旅。遊覽大阪歷史與現代交融的景點，充分享受卡丁車的樂趣。非常適合喜歡悠閒遊覽大阪代表性景點的遊客。', array['大阪城 120 分鐘', '歷史與現代', '悠閒遊覽'], '難波 → 大阪城環線 → 返回集合點。', array['卡丁車租賃', '頭盔與賽車服', '保險', '嚮導', '安全說明'], array['有效駕照或國際駕駛許可', '年滿 18 歲', '穿包頭鞋']),
  ('a3333333-3333-4333-8333-333333333333', 'ja', '大阪城120分コース', '歴史ある大阪城を背景に走る120分。歴史と今が交わるスポットをまわり、代表的な名所をゆっくり楽しめます。', array['大阪城120分', '歴史と今', 'ゆったり名所'], '難波 → 大阪城ループ → 基地へ戻る。', array['カートレンタル', 'ヘルメットとレーシングスーツ', '保険', 'ガイド', '安全説明'], array['有効な運転免許証または国際運転免許証', '18歳以上', 'つま先の閉じた靴']),
  ('a3333333-3333-4333-8333-333333333333', 'ko', '오사카성 120분 코스', '유서 깊은 오사카성을 배경으로 120분. 역사와 현대가 어우러진 명소를 돌며, 여유 있게 오사카를 둘러보고 싶은 분께 맞습니다.', array['오사카성 120분', '역사와 현대', '여유 있는 관광'], '난바 → 오사카성 루프 → 베이스 복귀.', array['카트 대여', '헬멧과 레이싱 슈트', '보험', '가이드', '안전 교육'], array['유효한 운전면허 또는 국제운전면허', '만 18세 이상', '앞이 막힌 신발'])
on conflict (plan_id, locale) do update set
  name = excluded.name,
  description = excluded.description,
  highlights = excluded.highlights,
  route_summary = excluded.route_summary,
  includes = excluded.includes,
  requirements = excluded.requirements;

insert into public.addons (id, slug, price_jpy, max_qty, is_active) values
  ('b1111111-1111-4111-8111-111111111111', 'gopro', 2000, 1, true),
  ('b2222222-2222-4222-8222-222222222222', 'costume', 1000, 1, true),
  ('b3333333-3333-4333-8333-333333333333', 'photos', 500, 1, true)
on conflict (slug) do update set price_jpy = excluded.price_jpy, max_qty = excluded.max_qty;

insert into public.addon_translations (addon_id, locale, name, description) values
  ('b1111111-1111-4111-8111-111111111111', 'en', 'GoPro recording', 'Pro GoPro footage, delivered within 24 hours. Relive the run.'),
  ('b1111111-1111-4111-8111-111111111111', 'zh-CN', 'GoPro 录像', '专业 GoPro 影像，24 小时内交付。重温你的街头骑行。'),
  ('b1111111-1111-4111-8111-111111111111', 'zh-TW', 'GoPro錄影', '專業 GoPro 影像，24 小時內交付。重溫你的精彩冒險！'),
  ('b1111111-1111-4111-8111-111111111111', 'ja', 'GoPro撮影', 'プロのGoPro映像。24時間以内に納品。走行を残せます。'),
  ('b1111111-1111-4111-8111-111111111111', 'ko', 'GoPro 촬영', '프로 GoPro 영상, 24시간 내 전달. 주행을 다시 볼 수 있습니다.'),
  ('b2222222-2222-4222-8222-222222222222', 'en', 'Premium costumes', 'Upgrade to character suits (Mario, Luigi, Yoshi, and more).'),
  ('b2222222-2222-4222-8222-222222222222', 'zh-CN', '高级服装', '升级为高级角色服装（马里奥、路易吉、耀西等）。'),
  ('b2222222-2222-4222-8222-222222222222', 'zh-TW', '高級服裝', '升級為高級角色服裝（瑪利歐、路易吉、耀西等）。'),
  ('b2222222-2222-4222-8222-222222222222', 'ja', 'プレミアム衣装', 'キャラクター衣装にアップグレード（マリオ、ルイージ、ヨッシーなど）。'),
  ('b2222222-2222-4222-8222-222222222222', 'ko', '프리미엄 의상', '캐릭터 의상으로 업그레이드 (마리오, 루이지, 요시 등).'),
  ('b3333333-3333-4333-8333-333333333333', 'en', 'Photo pack', '10 pro photos from the ride, delivered digitally.'),
  ('b3333333-3333-4333-8333-333333333333', 'zh-CN', '照片套餐', '骑行途中拍摄 10 张专业照片，以数字方式交付。'),
  ('b3333333-3333-4333-8333-333333333333', 'zh-TW', '照片套餐', '騎行途中拍攝 10 張專業照片，以數位方式交付。'),
  ('b3333333-3333-4333-8333-333333333333', 'ja', 'フォトパック', '走行中のプロ写真10枚をデジタルで納品。'),
  ('b3333333-3333-4333-8333-333333333333', 'ko', '포토 패키지', '주행 중 전문 사진 10장, 디지털로 전달.')
on conflict (addon_id, locale) do update set name = excluded.name, description = excluded.description;
