const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');

  const products = [
    {
      slug: 'timemore-c3-max',
      nameAr: 'طاحونة تايمور C3 ماكس اليدوية',
      nameKu: 'ئاڕاوەی دەستی تایمۆر C3 ماکس',
      description: 'The Timemore C3 Max is the ultimate hand grinder for specialty coffee enthusiasts. Featuring an upgraded stainless steel conical burr set with 36 click adjustments, it delivers exceptional grind consistency across all brew methods from espresso to French press.',
      descriptionAr: 'طاحونة تايمور C3 ماكس هي الطاحونة اليدوية المثالية لعشاق القهوة المختصة. تتميز بشفرات مخروطية من الستانلس ستيل مع 36 درجة دقيقة للطحن، تقدم اتساقاً استثنائياً في الطحن لجميع طرق التحضير.',
      descriptionKu: 'ئاڕاوەی دەستی تایمۆر C3 ماکس باشترین ئاڕاوەی دەستییە بۆ ئەوانەی حەزیان لە قاوەی تایبەتە. تایبەتمەندییەکانی شفرەی کۆنیکی پۆڵای نەوشەبوو لەگەڵ 36 ئاستی ڕێکخستن.',
      longDescription: 'The Timemore C3 Max hand grinder represents the pinnacle of manual coffee grinding technology. Built with premium materials and precision engineering, this grinder features a 38mm stainless steel conical burr set that produces remarkably uniform particle sizes. The upgraded capacity holds up to 30g of beans, making it perfect for brewing 2-3 cups. The ergonomic design includes a comfortable wooden knob and anti-slip silicone grip. With 36 precision click adjustments, you can fine-tune your grind from Turkish-fine to French press coarse with confidence.'
    },
    {
      slug: 'timemore-black-mirror-scale',
      nameAr: 'ميزان تايمور بلاك ميرور الرقمي',
      nameKu: 'تەرازووی دیجیتاڵی تایمۆر بلاک میرۆر',
      description: 'The Timemore Black Mirror Digital Scale offers precision weighing with 0.1g accuracy, built-in timer, and auto-start function. Its sleek design and responsive touch interface make it the perfect companion for pour-over and espresso brewing.',
      descriptionAr: 'ميزان تايمور بلاك ميرور الرقمي يقدم وزناً دقيقاً بدقة 0.1 غرام مع مؤقت مدمج ووظيفة البدء التلقائي. تصميمه الأنيق وواجهة اللمس السريعة يجعلانه الرفيق المثالي لتحضير القهوة.',
      descriptionKu: 'تەرازووی دیجیتاڵی تایمۆر بلاک میرۆر کێشانی وردی 0.1 گرام پێشکەش دەکات لەگەڵ کاتژمێری ناوەکی و دەستپێکردنی ئۆتۆماتیکی.',
      longDescription: 'The Timemore Black Mirror Digital Scale is designed specifically for specialty coffee brewing. It features a high-precision sensor with 0.1g accuracy and a maximum capacity of 2kg. The built-in timer with auto-start function detects when water hits the coffee bed, automatically beginning the countdown. The LED display is bright and easy to read, and the rechargeable battery provides up to 10 hours of continuous use. The waterproof nano-coating protects against coffee spills.'
    },
    {
      slug: 'fellow-stagg-ekg',
      nameAr: 'غلاية فيلو ستاج EKG الكهربائية',
      nameKu: 'کتری ئەلیکتریکی فێلۆ ستاگ EKG',
      description: 'The Fellow Stagg EKG Electric Kettle is the gold standard for pour-over coffee. Features variable temperature control (135-212°F), a precision pour spout, built-in brew stopwatch, and a stunning minimalist design that looks beautiful on any countertop.',
      descriptionAr: 'غلاية فيلو ستاج EKG الكهربائية هي المعيار الذهبي للقهوة المقطرة. تتميز بالتحكم المتغير في درجة الحرارة وصنبور الصب الدقيق وساعة إيقاف مدمجة وتصميم بسيط مذهل.',
      descriptionKu: 'کتری ئەلیکتریکی فێلۆ ستاگ EKG ستانداردی زێڕینە بۆ قاوەی پۆر ئۆڤەر. کۆنتڕۆڵی پلەی گەرمی گۆڕاو و لووتی ڕشتنی وردی تایبەتمەندییەکانیەتی.',
      longDescription: 'The Fellow Stagg EKG Electric Pour-Over Kettle combines form and function in a way that no other kettle can match. The variable temperature control allows you to set your water between 135°F and 212°F with degree-level precision. The counterbalanced handle provides a comfortable, steady pour, while the precision pour spout gives you complete control over flow rate. The built-in brew stopwatch helps you time your extraction perfectly. Available in multiple finishes, the Stagg EKG is as much a countertop showpiece as it is a brewing tool.'
    },
    {
      slug: 'fellow-pour-over-kettle',
      nameAr: 'غلاية فيلو للتقطير',
      nameKu: 'کتری فێلۆ بۆ ڕشتن',
      description: 'The Fellow Stagg Stovetop Pour-Over Kettle features the precision Stagg spout for ultimate pour control. The built-in thermometer and weighted handle create a balanced, intuitive pouring experience for perfect pour-over coffee every time.',
      descriptionAr: 'غلاية فيلو ستاج للموقد تتميز بصنبور ستاج الدقيق للتحكم الكامل بالصب. الثيرمومتر المدمج والمقبض المتوازن يخلقان تجربة صب مثالية.',
      descriptionKu: 'کتری فێلۆ ستاگ بۆ سەر ئاگر لووتی وردی ستاگی هەیە بۆ کۆنتڕۆڵی تەواوی ڕشتن. پلەی گەرمی ناوەکی و دەسکی کێشگرتوو ئەزموونی ڕشتنێکی تەواو دروست دەکەن.',
      longDescription: 'The Fellow Stagg Stovetop Pour-Over Kettle brings the same precision pour spout design as the EKG in a stovetop-compatible format. Compatible with gas, electric, and induction cooktops. The built-in analog thermometer lets you monitor water temperature at a glance. The weighted, counterbalanced handle provides a steady, controlled pour every time.'
    },
    {
      slug: 'fellow-atmos-canister',
      nameAr: 'علبة فيلو أتموس للتفريغ',
      nameKu: 'قوتوی فێلۆ ئاتمۆس',
      description: 'The Fellow Atmos Vacuum Canister actively removes air to keep your coffee beans fresher for longer. The integrated vacuum pump and one-way valve create an airtight seal that preserves peak flavor and aroma for weeks.',
      descriptionAr: 'علبة فيلو أتموس تزيل الهواء بشكل فعال للحفاظ على حبوب القهوة طازجة لفترة أطول. مضخة التفريغ المدمجة والصمام أحادي الاتجاه يحافظان على النكهة والرائحة.',
      descriptionKu: 'قوتوی فێلۆ ئاتمۆس هەوا لادەبات بۆ تازە ڕاگرتنی دانەکانی قاوە بۆ ماوەیەکی درێژتر. پەمپی ڤاکیومی ناوەکی و سوپاپی یەک لایەنە مۆری نەهێڵانی هەوا دروست دەکەن.',
      longDescription: 'Unlike traditional canisters that simply seal coffee in with the existing air, the Fellow Atmos actively removes air from the container. Simply twist the lid to pump out air, and the integrated one-way valve prevents air from re-entering. This vacuum seal preserves the freshness, flavor, and aroma of your coffee beans for up to 50% longer than standard containers.'
    },
    {
      slug: 'hario-v60-dripper',
      nameAr: 'قمع هاريو V60 السيراميك',
      nameKu: 'فلتەری هاریۆ V60 سیرامیک',
      description: 'The Hario V60 Ceramic Dripper is an iconic pour-over brewer known worldwide. Its 60-degree angle cone and spiral ribs allow for maximum coffee extraction and airflow, producing a clean, flavorful cup every time.',
      descriptionAr: 'قمع هاريو V60 السيراميكي هو أيقونة عالمية لتحضير القهوة المقطرة. زاوية القمع 60 درجة والأخاديد الحلزونية تسمح بأقصى استخلاص ونكهة مميزة.',
      descriptionKu: 'فلتەری سیرامیکی هاریۆ V60 ئایکۆنێکی جیهانییە بۆ قاوەی پۆر ئۆڤەر. گۆشەی 60 پلەی و شیاوەکانی مارپێچی ڕێگا بە زۆرترین دەرهێنان و تامی باش دەدەن.',
      longDescription: 'The Hario V60 is the most popular pour-over dripper in the world, used by baristas and home brewers alike. The ceramic version retains heat better than plastic or glass versions, ensuring consistent extraction temperature throughout the brewing process. The single large hole at the bottom allows you to control flow rate through your pouring technique, giving you complete control over the final cup.'
    },
    {
      slug: 'hario-v60-decanter',
      nameAr: 'ديكانتر هاريو V60',
      nameKu: 'دیکانتەری هاریۆ V60',
      description: 'The Hario V60 Drip Decanter combines a glass server and pour-over dripper in one elegant package. Perfect for brewing and serving 1-4 cups of specialty coffee with the iconic V60 brewing method.',
      descriptionAr: 'ديكانتر هاريو V60 يجمع بين خادم زجاجي وقمع التقطير في تصميم أنيق واحد. مثالي لتحضير وتقديم 1-4 أكواب من القهوة المختصة.',
      descriptionKu: 'دیکانتەری هاریۆ V60 سێرڤەری شووشەیی و فلتەری پۆر ئۆڤەر لە یەک دیزاینی جوان کۆدەکاتەوە. تەواوە بۆ دروستکردن و پێشکەشکردنی 1-4 فنجان قاوەی تایبەت.',
      longDescription: 'The Hario V60 Drip Decanter is an all-in-one pour-over brewing solution. The borosilicate glass server is heat-resistant and features measurement markings for precise brewing. The included V60 dripper sits perfectly on top, and the silicone band provides a comfortable, heat-resistant grip. Makes up to 700ml of beautifully brewed coffee.'
    },
    {
      slug: 'aeropress-go',
      nameAr: 'أيروبريس جو للسفر',
      nameKu: 'ئایرۆپرێس گۆ بۆ گەشت',
      description: 'The AeroPress Go Travel Brewer is a compact, portable coffee maker that produces smooth, rich coffee in just 1-2 minutes. Perfect for travel, camping, and office use. Includes a travel mug that doubles as a carrying case.',
      descriptionAr: 'أيروبريس جو هو جهاز تحضير قهوة محمول ومضغوط ينتج قهوة ناعمة وغنية في 1-2 دقيقة فقط. مثالي للسفر والتخييم والمكتب. يشمل كوب سفر يعمل كحقيبة حمل.',
      descriptionKu: 'ئایرۆپرێس گۆ قاوە دروستکەرێکی گواستنەوەیی و بچووکە کە قاوەیەکی نەرم و بەهێز لە 1-2 خولەکدا دروست دەکات. تەواوە بۆ گەشت و کامپ و ئۆفیس.',
      longDescription: 'The AeroPress Go is the travel-optimized version of the beloved AeroPress coffee maker. It brews American-style coffee, espresso-style shots, or cold brew in just minutes. The total immersion brewing process combined with gentle air pressure produces incredibly smooth coffee with low acidity. The compact design nests inside the included travel mug, making it the ultimate portable brewing solution.'
    },
    {
      slug: 'cafec-abaca-filters',
      nameAr: 'فلاتر كافيك أباكا+ للقهوة',
      nameKu: 'فلتەری قاوەی کافێک ئاباکا+',
      description: 'CAFEC Abaca+ Coffee Filters are premium paper filters made from a blend of wood pulp and abaca (Manila hemp) fibers. They allow oils to pass through while trapping sediment, producing a clean yet full-bodied cup.',
      descriptionAr: 'فلاتر كافيك أباكا+ مصنوعة من مزيج من لب الخشب وألياف الأباكا. تسمح بمرور الزيوت مع حجز الرواسب، لإنتاج قهوة نظيفة وغنية.',
      descriptionKu: 'فلتەرەکانی کافێک ئاباکا+ فلتەری کاغەزی تایبەتن لە تێکەڵەیەکی پەلەکەی دار و ڕیشی ئاباکا. ڕێگا بە ڕۆنەکان دەدەن تێبپەڕن و لێکدەکان ڕادەگرن.',
      longDescription: 'CAFEC Abaca+ filters are designed specifically for the V60 and other cone-shaped drippers. The unique blend of abaca fibers creates a filter that maintains structural integrity even when fully saturated, preventing collapse during brewing. The crepe texture promotes even water flow and extraction.'
    },
    {
      slug: '1zpresso-q2s',
      nameAr: 'طاحونة 1زپريسو Q2 S اليدوية',
      nameKu: 'ئاڕاوەی دەستی 1زپرێسۆ Q2 S',
      description: 'The 1Zpresso Q2 S is a compact, travel-friendly hand grinder that delivers exceptional grind quality. Its 38mm seven-core stainless steel burr set produces uniform particle size across all brew methods from pour-over to espresso.',
      descriptionAr: 'طاحونة 1زپريسو Q2 S يدوية مدمجة ومناسبة للسفر تقدم جودة طحن استثنائية. شفرات الستانلس ستيل 38 مم ذات السبع نوى تنتج حبيبات موحدة لجميع طرق التحضير.',
      descriptionKu: 'ئاڕاوەی دەستی 1زپرێسۆ Q2 S بچووک و گونجاو بۆ گەشتە و کوالیتی ئاڕانی نایاب پێشکەش دەکات. شفرەی پۆڵای نەوشەبوو 38 ملم ئەندازەی یەکسانی دانەوشکە دەرهەدەبات.',
      longDescription: 'The 1Zpresso Q2 S represents the pinnacle of compact hand grinder design. Despite its small size, it features a full 38mm seven-core stainless steel burr set — the same quality found in much larger grinders. The external adjustment dial allows quick and precise grind changes without disassembly. The aluminum body is lightweight yet durable, making it the perfect travel companion for coffee enthusiasts.'
    },
    {
      slug: 'normcore-tamper',
      nameAr: 'تامبر نورمكور للقهوة',
      nameKu: 'تامپەری نۆرمکۆر بۆ قاوە',
      description: 'The Normcore Coffee Tamper features a spring-loaded design that ensures consistent 15-25lb tamping pressure every time. The self-leveling base eliminates uneven tamping, resulting in better espresso extraction.',
      descriptionAr: 'تامبر نورمكور يتميز بتصميم نابض يضمن ضغطاً ثابتاً في كل مرة. القاعدة ذاتية التسوية تقضي على الضغط غير المتساوي، مما ينتج استخلاص إسبريسو أفضل.',
      descriptionKu: 'تامپەری نۆرمکۆر دیزاینی سپرینگی هەیە کە پەستانی یەکسان هەموو جارێک دڵنیا دەکاتەوە. بنەمای خۆ-ئاستکردنەوە تامپینگی نایەکسان لابەرێ دەکات.',
      longDescription: 'The Normcore Spring-Loaded Tamper takes the guesswork out of espresso tamping. The calibrated spring mechanism ensures you apply the same pressure every single time, regardless of your hand strength or technique. The self-leveling base automatically adjusts to create a perfectly flat, even coffee bed. Compatible with 58mm portafilters.'
    },
    {
      slug: 'glass-server-600ml',
      nameAr: 'سيرفر زجاجي 600 مل',
      nameKu: 'سێرڤەری شووشەیی 600 مل',
      description: 'A heat-resistant borosilicate glass coffee server with a capacity of 600ml. Features clear measurement markings and a comfortable handle for easy pouring. Perfect for serving freshly brewed pour-over coffee.',
      descriptionAr: 'سيرفر زجاجي مقاوم للحرارة من البوروسيليكات بسعة 600 مل. يتميز بعلامات قياس واضحة ومقبض مريح للصب. مثالي لتقديم القهوة المقطرة الطازجة.',
      descriptionKu: 'سێرڤەری شووشەیی بەرگری لە گەرمی بۆرۆسیلیکات بە گنجایشی 600 مل. نیشانەی پێوانەی ڕوون و دەسکی ئارام بۆ ڕشتنی ئاسان. تەواوە بۆ پێشکەشکردنی قاوەی پۆر ئۆڤەری تازە.',
      longDescription: 'This premium glass coffee server is made from high-quality borosilicate glass that withstands thermal shock and daily use. The 600ml capacity is perfect for brewing 2-4 cups of coffee. Clear measurement markings on the side help you brew precise amounts every time.'
    },
    {
      slug: 'milk-pitcher-350ml',
      nameAr: 'إبريق تبخير الحليب 350 مل',
      nameKu: 'مەنجەڵی شیر 350 مل',
      description: 'A precision-crafted stainless steel milk frothing pitcher designed for latte art. The tapered spout allows for fine control when pouring, and measurement markings ensure consistent milk volumes every time.',
      descriptionAr: 'إبريق تبخير حليب من الستانلس ستيل مصمم لفن اللاتيه. الصنبور المدبب يسمح بتحكم دقيق عند الصب وعلامات القياس تضمن كميات حليب ثابتة.',
      descriptionKu: 'مەنجەڵی شیری پۆڵای نەوشەبوو بۆ هونەری لاتێ. لووتی تیژ ڕێگا بە کۆنتڕۆڵی وردی ڕشتن دەدات و نیشانەی پێوانە بڕی شیری یەکسان دڵنیا دەکاتەوە.',
      longDescription: 'This professional-grade milk frothing pitcher is crafted from food-grade 304 stainless steel. The 350ml capacity is ideal for single or double lattes. The precision tapered spout is specifically designed for creating detailed latte art, from simple hearts to complex rosettas.'
    },
    {
      slug: 'wdt-tool',
      nameAr: 'أداة WDT للإسبريسو',
      nameKu: 'ئامێری WDT بۆ ئێسپرێسۆ',
      description: 'A precision-engineered Weiss Distribution Technique tool for eliminating clumps in espresso grounds. Eight 0.4mm stainless steel needles ensure thorough distribution for channeling-free extractions.',
      descriptionAr: 'أداة توزيع وايس المصممة بدقة لإزالة التكتلات من القهوة المطحونة. ثمانية إبر من الستانلس ستيل بسمك 0.4 مم تضمن توزيعاً شاملاً لاستخلاص بدون قنوات.',
      descriptionKu: 'ئامێری دابەشکردنی وایس بۆ لابردنی کۆبوونەوەکان لە قاوەی ئاڕاو. هەشت دەرزی پۆڵای نەوشەبوو 0.4 مم دابەشکردنی تەواو بۆ دەرهێنانی بێ کەناڵ دڵنیا دەکاتەوە.',
      longDescription: 'The WDT (Weiss Distribution Technique) tool is an essential accessory for any espresso enthusiast. By breaking up clumps in your ground coffee before tamping, the WDT tool ensures even water distribution during extraction, eliminating channeling that causes sour or bitter flavors. The eight 0.4mm food-grade stainless steel needles are thin enough to penetrate the coffee bed without compressing it.'
    },
    {
      slug: 'dosing-cup-58mm',
      nameAr: 'كوب الجرعة 58 مم',
      nameKu: 'کوپی دۆزینگ 58 مم',
      description: 'A precision stainless steel dosing cup that fits perfectly on 58mm grinders. Transfer grounds cleanly from grinder to portafilter without mess or waste. Essential for a tidy espresso workflow.',
      descriptionAr: 'كوب جرعة من الستانلس ستيل يتناسب تماماً مع طاحونات 58 مم. نقل القهوة المطحونة بنظافة من الطاحونة إلى البورتافلتر بدون فوضى أو هدر.',
      descriptionKu: 'کوپی دۆزینگی پۆڵای نەوشەبوو کە تەواو لەگەڵ ئاڕاوەکانی 58 مم دەگونجێت. قاوەی ئاڕاو بە پاکی لە ئاڕاوەوە بۆ پۆرتافلتەر دەگوازرێتەوە.',
      longDescription: 'This precision dosing cup is designed to sit directly on your grinder output, catching every gram of freshly ground coffee. The 58mm diameter matches standard commercial portafilter baskets, allowing you to simply flip the cup over and transfer grounds directly into your portafilter without any mess or loss.'
    },
    {
      slug: 'knock-box',
      nameAr: 'صندوق طرق للإسبريسو',
      nameKu: 'سندوقی لێدانی ئێسپرێسۆ',
      description: 'A sturdy, slip-resistant knock box for disposing of used espresso pucks. The shock-absorbing rubber bar and rubberized base keep your workflow clean and efficient.',
      descriptionAr: 'صندوق طرق متين ومقاوم للانزلاق للتخلص من بقايا الإسبريسو. شريط المطاط الممتص للصدمات والقاعدة المطاطية يحافظان على نظافة وكفاءة عملك.',
      descriptionKu: 'سندوقی لێدانی بەهێز و نەخلیسکەو بۆ فڕێدانی پەکی ئێسپرێسۆی بەکارهاتوو. شریتی ڕەزینی هەڵمژەرەوە و بنەمای ڕەزینی کارکردنت پاک و کارا دەهێڵێتەوە.',
      longDescription: 'This professional knock box is built to withstand the daily demands of busy baristas. The heavy-duty construction prevents tipping during use, while the replaceable rubber knock bar absorbs impact and protects your portafilter. The rubberized non-slip base keeps the box firmly in place on your counter.'
    }
  ];

  let updated = 0;
  for (const p of products) {
    await conn.execute(
      'UPDATE products SET nameAr=?, nameKu=?, description=?, descriptionAr=?, descriptionKu=?, longDescription=?, longDescriptionAr=?, longDescriptionKu=? WHERE slug=?',
      [p.nameAr, p.nameKu, p.description, p.descriptionAr, p.descriptionKu, p.longDescription, p.descriptionAr, p.descriptionKu, p.slug]
    );
    console.log('Updated:', p.slug);
    updated++;
  }

  console.log('DONE! Updated', updated, 'products with full descriptions in EN/AR/KU.');
  await conn.end();
}
main().catch(e => console.error(e));
