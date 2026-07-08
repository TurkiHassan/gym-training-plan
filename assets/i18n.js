/* ==========================================================================
   i18n — Arabic (source of truth in HTML) ⇄ English
   Engine: walks text nodes and swaps exact trimmed matches; Arabic markup
   stays untouched when lang=ar. JS-generated strings use window.T(ar, en).
   ========================================================================== */
(function () {
  'use strict';

  var lang = 'ar';
  try { lang = JSON.parse(localStorage.getItem('lang')) || 'ar'; } catch (e) {}
  window.APP_LANG = lang;

  /* translate helper for JS-built strings */
  window.T = function (ar, en) { return (lang === 'en' && en != null) ? en : ar; };

  /* page titles (EN) */
  var TITLES = {
    'index.html':     '3-Month Training Plan | Fitness Time',
    'push.html':      'Push Day | Training Plan',
    'pull.html':      'Pull Day | Training Plan',
    'legs.html':      'Leg Day | Training Plan',
    'upper.html':     'Upper Body | Training Plan',
    'nutrition.html': 'Nutrition Guide | Training Plan',
    'info.html':      'Key Info | Training Plan',
    'inbody.html':    'InBody Scan | Training Plan',
    'profile.html':   'My Profile | Training Plan'
  };

  /* numeric-unit patterns */
  var PATTERNS = [
    [/^(\d+(?:\.\d+)?)غ$/, '$1g'],
    [/^(\d+(?:\.\d+)?) سعرة$/, '$1 kcal']
  ];

  var TEXT = {
    /* ---- brand / nav / bottom nav ---- */
    'خطة التدريب': 'Training Plan',
    'Fitness Time · 3 أشهر': 'Fitness Time · 3 Months',
    'الرئيسية': 'Home',
    'الدفع': 'Push',
    'السحب': 'Pull',
    'الأرجل': 'Legs',
    'العلوي': 'Upper',
    'التغذية': 'Nutrition',
    'معلومات هامة': 'Key Info',
    'ملفي': 'Profile',
    'التدريب': 'Training',
    'تنقل سريع': 'Quick navigation',
    'تبديل الوضع': 'Toggle theme',
    'القائمة': 'Menu',
    'إغلاق': 'Close',

    /* ---- home hero ---- */
    'خطة تدريب': '3-Month',
    'ثلاثة أشهر': 'Training Plan',
    'خسارة دهون مع الحفاظ على العضلات — حصص مدروسة ومتابعة InBody شهرياً.': 'Fat loss while keeping muscle — structured sessions and monthly InBody tracking.',
    'خسارة دهون': 'Fat loss',
    'حفاظ على العضلات': 'Muscle retention',
    '4 حصص / أسبوع': '4 sessions / week',
    'ابدأ حصة اليوم': "Start today's session",
    'نظرة عامة': 'Overview',

    /* ---- home overview ---- */
    'نظرة عامة على البرنامج': 'Program overview',
    'الهدف الأساسي': 'Primary goal',
    'تنشيف مع الإبقاء على أكبر قدر من العضلات — تدرّج في الأوزان ومتابعة شهرية دقيقة.': 'Cut fat while keeping as much muscle as possible — progressive loading, precise monthly tracking.',
    'حصص أسبوعياً': 'Sessions / week',
    'مدة البرنامج': 'Program length',
    'دورة InBody': 'InBody cycle',
    'أيام': 'days',
    'أشهر': 'months',
    'أسابيع': 'weeks',

    /* ---- home schedule / day cards ---- */
    'جدول الأسبوع': 'Weekly schedule',
    'السبت · Push': 'Saturday · Push',
    'الأحد · Pull': 'Sunday · Pull',
    'الثلاثاء · Upper': 'Tuesday · Upper',
    'الأربعاء · Legs': 'Wednesday · Legs',
    'يوم الدفع': 'Push Day',
    'يوم السحب': 'Pull Day',
    'يوم الأرجل': 'Leg Day',
    'الجزء العلوي': 'Upper Body',
    'صدر': 'Chest',
    'أكتاف': 'Shoulders',
    'ترايسبس': 'Triceps',
    'ظهر': 'Back',
    'كتف خلفي': 'Rear delts',
    'بايسبس': 'Biceps',
    'ذراع': 'Arms',
    'أمامي': 'Quads',
    'خلفي': 'Hamstrings',
    'سمانة': 'Calves',
    'عرض التمارين ←': 'View exercises →',

    /* ---- home discover ---- */
    'اكتشف المزيد': 'Discover more',
    'التمرين نصف الطريق — التغذية المنضبطة هي النصف الآخر.': 'Training is half the journey — disciplined nutrition is the other half.',
    'قواعد الوزن والتغذية والكارديو والوجبة المفتوحة.': 'Rules for weigh-ins, nutrition, cardio and the cheat meal.',
    'عرض التعليمات ←': 'View guidelines →',
    'الأكل الصحي': 'Healthy Eating',
    'وجبات عالية البروتين متوازنة الماكروز.': 'High-protein, macro-balanced meals.',
    'دليل التغذية ←': 'Nutrition guide →',

    /* ---- home inbody summary ---- */
    'قياس InBody الأخير': 'Latest InBody scan',
    'تابع تطوّرك مع كل قياس شهري.': 'Track your progress with every monthly scan.',
    'من 100 نقطة': 'out of 100',
    'الوزن الحالي': 'Current weight',
    'المستهدف: 65.1 كجم': 'Target: 65.1 kg',
    'الكتلة العضلية (SMM)': 'Muscle mass (SMM)',
    'ضمن النطاق الطبيعي': 'Within normal range',
    'نسبة الدهون (PBF)': 'Body fat (PBF)',
    'التقرير الكامل ←': 'Full report →',
    'كجم': 'kg',
    'سم': 'cm',
    'لتر': 'L',
    'غرام': 'g',
    'سعرة': 'kcal',

    /* ---- footers ---- */
    'خطة تدريب 3 أشهر · 2026': '3-month training plan · 2026',
    'خسارة دهون · حفاظ على العضلات · متابعة InBody': 'Fat loss · Muscle retention · InBody tracking',
    'يوم الدفع — حصة السبت · Fitness Time 2026': 'Push Day — Saturday session · Fitness Time 2026',
    'يوم السحب — حصة الأحد · Fitness Time 2026': 'Pull Day — Sunday session · Fitness Time 2026',
    'الجزء العلوي — حصة الثلاثاء · Fitness Time 2026': 'Upper Body — Tuesday session · Fitness Time 2026',
    'يوم الأرجل — حصة الأربعاء · Fitness Time 2026': 'Leg Day — Wednesday session · Fitness Time 2026',
    'معلومات هامة — Fitness Time · 2026': 'Key Info — Fitness Time · 2026',
    'دليل التغذية — Fitness Time · 2026': 'Nutrition Guide — Fitness Time · 2026',
    'قياس InBody — آخر تحديث': 'InBody — last updated',
    'الملف الشخصي — بياناتك محفوظة على جهازك · Fitness Time 2026': 'Profile — data stays on your device · Fitness Time 2026',

    /* ---- workout pages: heads ---- */
    'Day 1 — Push Workout · السبت': 'Day 1 — Push Workout · Saturday',
    'Day 2 — Pull Workout · الأحد': 'Day 2 — Pull Workout · Sunday',
    'Day 3 — Upper Workout · الثلاثاء': 'Day 3 — Upper Workout · Tuesday',
    'Day 4 — Legs Workout · الأربعاء': 'Day 4 — Legs Workout · Wednesday',
    'الصدر والأكتاف والترايسبس — ست تمارين متوازنة الحِمل.': 'Chest, shoulders and triceps — six balanced exercises.',
    'الظهر والكتف الخلفي والبايسبس — ست تمارين بأفضل تغطية.': 'Back, rear delts and biceps — six well-chosen exercises.',
    'الأمامي والخلفي والجلوتس والسمانة — تغطية شاملة.': 'Quads, hamstrings, glutes and calves — full coverage.',
    'الصدر والظهر والأكتاف والذراع في حصة واحدة مركّزة.': 'Chest, back, shoulders and arms in one focused session.',
    'تمارين': 'Exercises',
    'مجموعات': 'Sets',
    'محطات': 'Stations',
    'ثانية راحة': 'Sec rest',
    'تصفير': 'Reset',

    /* ---- exercise names ---- */
    'صدر همر مستوي': 'Hammer flat chest press',
    'صدر فلاي جهاز': 'Machine chest fly',
    'أكتاف جانبي رفرفة بالكيبل': 'Cable lateral raise',
    'تراي كيبل بالحبل': 'Rope triceps pushdown',
    'بنش علوي دمبل': 'Incline dumbbell press',
    'تراي علوي بالحبل': 'Overhead rope extension',
    'سحب ظهر علوي': 'Lat pulldown',
    'تي بار واسع': 'Wide T-bar row',
    'كتف خلفي جهاز': 'Rear-delt machine',
    'باي تبادل جالس': 'Seated alternating curl',
    'تجديف كيبل جالس': 'Seated cable row',
    'فيس بُل بالحبل': 'Rope face pull',
    'هاك سكوات': 'Hack squat',
    'بلغيريان سكوات': 'Bulgarian split squat',
    'خلفي جهاز نائم': 'Lying leg curl',
    'بطّات جالس': 'Seated calf raise',
    'تمديد أمامي جهاز': 'Leg extension',
    'رفعة رومانية': 'Romanian deadlift',
    'جهاز همر صدر علوي': 'Hammer incline chest press',
    'سحب علوي فردي': 'Single-arm pulldown',
    'كتف جانبي دفع': 'Lateral raise machine',
    'سوبر ست ذراع': 'Arms superset',
    'غطس صدر': 'Chest dip',
    'باي بريتشر دمبل': 'Dumbbell preacher curl',

    /* ---- exercise rows ---- */
    'الجلسات:': 'Sets:',
    'العدات:': 'Reps:',
    'باي همر دنابل:': 'Hammer curl:',
    'تراي سحب فردي:': 'Single-arm pushdown:',
    '▶ رابط التمرين': '▶ Exercise video',
    '▶ رابط الباي': '▶ Biceps video',
    '▶ رابط التراي': '▶ Triceps video',
    'آخر —': 'Last —',
    'أفضل —': 'Best —',
    'اضغط لتعليم المجموعة': 'Tap to mark sets',
    'باي + تراي': 'Bi + Tri',
    'الوزن بالكيلوغرام': 'Weight in kilograms',

    /* ---- workout notes ---- */
    'ملاحظات سريعة': 'Quick notes',
    'راحة 60–90 ثانية بين المجموعات.': 'Rest 60–90 seconds between sets.',
    'ابدأ بوزن مريح مع تحكم كامل في الحركة.': 'Start with a comfortable weight and full control.',
    'إذا اختلّ التكنيك، خفّف الوزن مباشرة.': 'If form breaks down, drop the weight immediately.',
    'بدون تمارين بطن في هذه النسخة.': 'No ab work in this program.',
    'ركّز على شدّ عضلة الظهر في أعلى الحركة.': 'Squeeze the back hard at the top of each rep.',
    'انزل بعمق مناسب مع ثبات الكعب على الأرض.': 'Squat to proper depth with heels planted.',
    'التحكم بالحركة أهم من الوزن.': 'Control matters more than load.',
    'في السوبر ست: نفّذ الباي ثم التراي بدون راحة بينهما.': 'Superset: biceps then triceps with no rest between.',
    'الحصة التالية: السحب ←': 'Next session: Pull →',
    'الحصة التالية: العلوي ←': 'Next session: Upper →',
    'الحصة التالية: الأرجل ←': 'Next session: Legs →',
    'تابع قياسك: InBody ←': 'Track your scan: InBody →',
    'جدول التغذية ←': 'Nutrition guide →',
    'ابدأ حصة اليوم ←': "Start today's session →",

    /* ---- info page ---- */
    'Important Info · تعليمات الخطة': 'Important Info · Plan Rules',
    'قواعد بسيطة تصنع الفرق — التزم بها بدقة.': 'Simple rules that make the difference — follow them precisely.',
    'سعرة يومياً': 'kcal / day',
    'وجبات': 'Meals',
    'نزول أسبوعي': 'Weekly loss',
    'Trainee Profile · الملف التدريبي': 'Trainee Profile',
    'العمر': 'Age',
    'الوزن': 'Weight',
    'الطول': 'Height',
    'السعرات': 'Calories',
    'The Rules · القواعد': 'The Rules',
    'تعليمات يجب الالتزام بها': 'Rules to follow',
    'وزن زيت الزيتون': 'Weigh your olive oil',
    'الزيت يجب أن يُوزن ويُحتسب ضمن سعراتك — كل': 'Oil must be weighed and counted in your calories — every',
    '1 مل = 8 سعرات': '1 ml = 8 kcal',
    'حرارية.': 'of pure fat.',
    'غطِّ احتياج البروتين': 'Hit your protein target',
    'احرص على تغطية احتياجك اليومي من البروتين للحفاظ على العضل وزيادة قوة البناء العضلي.': 'Cover your daily protein needs to protect muscle and support growth.',
    'ترحيل السعرات': 'Carrying calories over',
    'يمكنك ترحيل المتبقّي من': 'You may carry leftover',
    'الكارب والفات': 'carbs and fats',
    'فقط لليوم التالي — أما': 'to the next day only —',
    'البروتين فلا': 'protein never',
    'يُرحّل.': 'carries over.',
    'لا تتعدَّ سعراتك': "Don't exceed your calories",
    'عدم تجاوز القدر المحدد من السعرات اليومية مهما كان السبب — الانضباط أساس النتيجة.': 'Never exceed your daily calorie budget — discipline drives results.',
    'الحلويات بحساب': 'Sweets, by the numbers',
    'تستطيع إضافة الشوكولاتة بشرط إنقاص الكارب أو الفات:': 'Chocolate is allowed if you subtract carbs or fat:',
    '30غ كارب = 100 سعرة': '30g carbs = 100 kcal',
    'و': 'and',
    '12غ فات = 100 سعرة': '12g fat = 100 kcal',
    'اشرب ماءً كافياً': 'Drink enough water',
    'تناول كمية كافية من الماء يومياً — أساسي للأداء والاستشفاء وتنظيم الشهية.': 'Sufficient daily water is essential for performance, recovery and appetite control.',
    'الوجبة المفتوحة': 'The cheat meal',
    'كل': 'Every',
    '7 أيام': '7 days',
    ': انقص 500 سعرة قبلها أو بعدها، واجعل يومها قليل الكارب بإجمالي ≈ 2000 سعرة، واشرب ماءً كافياً.': ': cut 500 kcal before or after, keep that day low-carb (≈ 2000 kcal total), and drink plenty of water.',
    'لا تقِس بعد الوجبة المفتوحة': "Don't weigh in after a cheat meal",
    'لا تقِس وزنك في اليوم التالي للوجبة المفتوحة — الصوديوم العالي يسبب احتباس سوائل مؤقتاً.': 'Skip the scale the day after a cheat meal — sodium causes temporary water retention.',
    'قِس وزنك صباحاً': 'Weigh in every morning',
    'القياس كل صباح على الريق بعد نوم': 'Weigh fasted each morning after',
    '7–8 ساعات': '7–8 hours',
    'وبدون ملابس — قلة النوم تسبب احتباس السوائل.': 'of sleep, unclothed — poor sleep retains water.',
    'سجّل وزنك يومياً': 'Log your weight daily',
    'دوّن وزنك كل يوم ثم خذ متوسط كل 7 أيام وقارنه — المعدل الصحي للنزول': 'Record daily, average every 7 days, then compare — a healthy rate is',
    'من وزنك أسبوعياً.': 'of body weight per week.',
    'قِس مقاسات جسمك': 'Take body measurements',
    'قِس الخصر والصدر والرقبة والذراع والفخذ والأرداف أسبوعياً — لرصد الفرق عند ثبات الوزن.': 'Measure waist, chest, neck, arm, thigh and hips weekly — it shows progress when the scale stalls.',
    'المشروبات الغازية': 'Diet sodas',
    'لا مانع منها فهي لا تزيد الوزن، لكنها': "They won't add weight, but they're",
    'ليست صحية': 'not healthy',
    '— قلّلها قدر الإمكان.': '— keep them minimal.',
    'وزن البطاطس قبل الطبخ': 'Weigh potatoes raw',
    'تُوزن البطاطس': 'Weigh potatoes',
    'قبل': 'before',
    'الطبخ لاحتساب سعراتها بدقة، لأن الطبخ يغيّر وزنها.': 'cooking for accurate calories — cooking changes their weight.',
    'الكارديو': 'Cardio',
    'ابدأ بـ': 'Start with',
    '20 دقيقة': '20 minutes',
    'ونبض القلب فوق': 'and heart rate above',
    '؛ وعند ثبات الوزن ارفع المجهود 10 دقائق إضافية وراقب.': '; when weight stalls, add 10 more minutes and monitor.',
    'الجدول الأسبوعي': 'Weekly schedule',
    'السبت': 'Saturday',
    'الأحد': 'Sunday',
    'الإثنين': 'Monday',
    'الثلاثاء': 'Tuesday',
    'الأربعاء': 'Wednesday',
    'الخميس': 'Thursday',
    'الجمعة': 'Friday',
    'دفع · Push': 'Push',
    'سحب · Pull': 'Pull',
    'علوي · Upper': 'Upper',
    'أرجل · Lower': 'Legs',
    'راحة': 'Rest',
    'Golden Tip · نصيحة ذهبية': 'Golden Tip',
    'الوصول إلى الفشل العضلي': 'Train close to failure',
    'حاول دائماً أثناء التمرين أن تصل إلى': 'In every set, aim to reach',
    'الفشل العضلي': 'muscular failure',
    'أو ما قبله بقليل — هذا ما يحفّز النمو الحقيقي للعضلة.': 'or just short of it — that is what drives real growth.',
    '▶ شرح الطريقة بالفيديو': '▶ Watch the explanation',

    /* ---- nutrition page ---- */
    'Nutrition · الأكل الصحي': 'Nutrition · Healthy Eating',
    'دليل التغذية': 'Nutrition Guide',
    'لا تنشيف بدون مطبخ منضبط — وجبات عالية البروتين متوازنة الماكروز.': 'No cut succeeds without a disciplined kitchen — high-protein, macro-balanced meals.',
    'بروتين/كجم': 'Protein/kg',
    'سعرة عجز': 'kcal deficit',
    'وجبات/يوم': 'Meals/day',
    'صدر دجاج مشوي + خضار': 'Grilled chicken + veggies',
    'مصدر بروتين خالٍ من الدهون مع خضار ملونة غنية بالألياف — الأساس الكلاسيكي للتنشيف.': 'Lean protein with fiber-rich vegetables — the classic cutting staple.',
    'سلمون مشوي بالليمون': 'Lemon grilled salmon',
    'غني بأوميغا-3 والبروتين عالي الجودة، يدعم الاستشفاء وصحة القلب والمفاصل.': 'Rich in omega-3 and quality protein — supports recovery and heart health.',
    'شوفان بالفواكه': 'Oats with fruit',
    'كربوهيدرات بطيئة الامتصاص تمنحك طاقة ثابتة قبل التمرين وتقلّل الجوع طوال الصباح.': 'Slow-release carbs for steady pre-workout energy and less morning hunger.',
    'بيض مسلوق': 'Boiled eggs',
    'بروتين كامل القيمة وفيتامينات أساسية — وجبة سريعة مثالية للفطور أو سناك بعد التمرين.': 'Complete protein and key vitamins — a quick breakfast or post-workout snack.',
    'سلطة كينوا متكاملة': 'Complete quinoa salad',
    'توازن مثالي بين البروتين النباتي والكارب والألياف، خفيفة على المعدة وغنية بالعناصر.': 'Plant protein, carbs and fiber in balance — light yet nutrient-dense.',
    'أرز بني بالخضار': 'Brown rice with veggies',
    'مصدر كارب نظيف يرافق البروتين في وجبة الغداء، يمدّك بالطاقة لحصص التمرين الثقيلة.': 'A clean carb source for lunch — fuels your heaviest sessions.',
    'بروتين': 'Protein',
    'كارب': 'Carbs',
    'دهون': 'Fat',
    'نموذج يوم متوازن': 'A balanced day',
    'الفطور:': 'Breakfast:',
    'شوفان بالفواكه + بيض مسلوق.': 'Oats with fruit + boiled eggs.',
    'الغداء:': 'Lunch:',
    'صدر دجاج أو سلمون + أرز بني + خضار.': 'Chicken or salmon + brown rice + veggies.',
    'سناك:': 'Snack:',
    'زبادي يوناني أو أفوكادو + مكسرات.': 'Greek yogurt or avocado + nuts.',
    'العشاء:': 'Dinner:',
    'بروتين خفيف + سلطة كينوا.': 'Light protein + quinoa salad.',

    /* ---- inbody page ---- */
    'قياس InBody': 'InBody Scan',
    'اضغط على أي رقم لتعديله ثم احفظ — آخر تحديث:': 'Tap any number to edit, then save — last updated:',
    'الأرقام المُخطّطة قابلة للتعديل — اضغط عليها وأدخل قيمتك.': 'Underlined numbers are editable — tap and type your value.',
    'الطول (سم)': 'Height (cm)',
    'الجهاز': 'Device',
    'تقييم عام من 100': 'Overall score / 100',
    'النطاق الطبيعي: 56.3–74.0': 'Normal range: 56.3–74.0',
    'الكتلة العضلية الهيكلية (SMM)': 'Skeletal muscle mass (SMM)',
    'الهدف: خفضها تدريجياً': 'Goal: reduce gradually',
    'تحليل مكونات الجسم': 'Body composition',
    'ماء الجسم الكلي': 'Total body water',
    'البروتين': 'Protein',
    'المعادن': 'Minerals',
    'كتلة الدهون': 'Fat mass',
    'التحكم بالوزن': 'Weight control',
    'الوزن المستهدف': 'Target weight',
    'تعديل الوزن': 'Weight adjustment',
    'تقليل الدهون': 'Fat to lose',
    'الهدف خفض الدهون مع الحفاظ على العضلات قدر الإمكان.': 'Goal: lose fat while keeping as much muscle as possible.',
    'أعد القياس بعد 4 أسابيع لرصد التغيّر.': 'Re-scan in 4 weeks to track change.',
    'مؤشرات إضافية': 'More indicators',
    'مؤشر كتلة الجسم BMI': 'Body Mass Index (BMI)',
    'نسبة الخصر/الورك': 'Waist-to-hip ratio',
    'مستوى الدهون الحشوية': 'Visceral fat level',
    'طبيعي (1–9)': 'Normal (1–9)',
    'الدهون الحشوية ضمن المستوى الآمن — حافظ عليها.': 'Visceral fat is in the safe zone — keep it there.',
    'BMI ضمن النطاق الطبيعي.': 'BMI within normal range.',
    'حفظ القياس': 'Save scan',
    'استعادة الافتراضي': 'Restore defaults',

    /* ---- profile page ---- */
    'ملفي الشخصي': 'My Profile',
    'أدخل بياناتك مرة واحدة — تُحسب أهدافك تلقائياً ويظهر اسمك في كل الصفحات.': 'Enter your data once — targets are calculated automatically and your name appears everywhere.',
    'البيانات الأساسية': 'Basic info',
    'الاسم': 'Name',
    'اكتب اسمك': 'Your name',
    'الجنس': 'Gender',
    'ذكر': 'Male',
    'أنثى': 'Female',
    'الوزن الحالي (كجم)': 'Current weight (kg)',
    'الوزن المستهدف (كجم)': 'Target weight (kg)',
    'مستوى النشاط': 'Activity level',
    'خامل — عمل مكتبي بلا تمرين': 'Sedentary — desk job, no training',
    'خفيف — تمرين 1-3 أيام': 'Light — training 1-3 days',
    'متوسط — تمرين 3-5 أيام': 'Moderate — training 3-5 days',
    'عالي — تمرين 6-7 أيام': 'High — training 6-7 days',
    'بياناتك تُحفظ على جهازك فقط. استخدم النسخة الاحتياطية عند تغيير الجهاز.': 'Your data stays on this device. Use backup when switching phones.',
    'أيام التدريب في الأسبوع': 'Training days per week',
    'أيام التدريب': 'Training days',
    'اختر أيامك — تُوزّع الحصص (دفع، سحب، أرجل، علوي) عليها تلقائياً.': 'Pick your days — sessions (Push, Pull, Legs, Upper) are assigned automatically.',
    'مؤشراتك المحسوبة': 'Your calculated targets',
    'أدخل الطول والوزن': 'Enter height & weight',
    'سعرات خسارة الدهون': 'Fat-loss calories',
    'احتياجك اليومي: —': 'Maintenance: —',
    'البروتين اليومي': 'Daily protein',
    '1.8 غرام لكل كجم من وزنك': '1.8 g per kg body weight',
    'الماء اليومي': 'Daily water',
    '35 مل لكل كجم من وزنك': '35 ml per kg body weight',
    'سجل الوزن': 'Weight log',
    'حفظ البيانات': 'Save',
    'تفعيل تذكير القياس': 'Enable weigh-in reminder',
    'تصدير نسخة احتياطية': 'Export backup',
    'استيراد نسخة': 'Import backup'
  };

  function translateTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        if (p === 'SCRIPT' || p === 'STYLE') return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.nodeValue, key = raw.trim();
      var out = TEXT[key];
      if (out == null) {
        for (var i = 0; i < PATTERNS.length; i++) {
          if (PATTERNS[i][0].test(key)) { out = key.replace(PATTERNS[i][0], PATTERNS[i][1]); break; }
        }
      }
      if (out != null) node.nodeValue = raw.replace(key, out);
    }
  }

  function translateAttrs() {
    ['aria-label', 'placeholder', 'title'].forEach(function (attr) {
      var els = document.querySelectorAll('[' + attr + ']');
      for (var i = 0; i < els.length; i++) {
        var v = els[i].getAttribute(attr);
        if (v && TEXT[v.trim()]) els[i].setAttribute(attr, TEXT[v.trim()]);
      }
    });
  }

  window.applyI18n = function () {
    if (lang !== 'en') return;
    var page = location.pathname.split('/').pop() || 'index.html';
    if (TITLES[page]) document.title = TITLES[page];
    translateTextNodes(document.body);
    translateAttrs();
  };

  if (lang === 'en') {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', window.applyI18n);
    } else {
      window.applyI18n();
    }
  }
})();
