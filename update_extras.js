const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');

  const cats = [
    { slug: 'grinders', descAr: 'مطاحن قهوة يدوية وكهربائية بجودة عالية', descKu: 'ئاڕاوەی قاوەی دەستی و ئەلیکتریکی بە کوالیتی بەرز' },
    { slug: 'scales', descAr: 'موازين قهوة رقمية دقيقة للتحضير المثالي', descKu: 'تەرازووی قاوەی دیجیتاڵی وردی بۆ دروستکردنی تەواو' },
    { slug: 'kettles', descAr: 'غلايات تقطير وكهربائية للقهوة المختصة', descKu: 'کتری ڕشتن و ئەلیکتریکی بۆ قاوەی تایبەت' },
    { slug: 'brewers', descAr: 'أدوات تحضير القهوة والتقطير', descKu: 'ئامێرەکانی دروستکردنی قاوە و فلتەرکردن' },
    { slug: 'filters', descAr: 'فلاتر ورقية وإكسسوارات للقهوة', descKu: 'فلتەری کاغەزی و ئاکسسواری بۆ قاوە' },
    { slug: 'accessories', descAr: 'أدوات وإكسسوارات القهوة المتنوعة', descKu: 'ئامێر و ئاکسسواری جۆراوجۆری قاوە' }
  ];

  for (const c of cats) {
    await conn.execute('UPDATE categories SET descriptionAr=?, descriptionKu=? WHERE slug=?', [c.descAr, c.descKu, c.slug]);
    console.log('Updated category:', c.slug);
  }

  // Also recreate brewing methods with translations
  await conn.execute('DELETE FROM brewing_methods');
  const methods = [
    { name: 'Espresso', nameAr: 'إسبريسو', nameKu: 'ئێسپرێسۆ', tagline: 'Bold & Intense', taglineAr: 'جريء ومكثف', taglineKu: 'بەهێز و تیژ', desc: 'A concentrated coffee brewed by forcing hot water through finely-ground coffee at high pressure.', descAr: 'قهوة مركزة تحضر بدفع الماء الساخن عبر قهوة مطحونة ناعمة تحت ضغط عالٍ.', descKu: 'قاوەیەکی تەرکیز کە بە زۆرکردنی ئاوی گەرم بە قاوەی وردی ئاڕاو تێپەڕکراو لەژێر پەستانی بەرزدا دروست دەکرێت.', time: '25-30 sec', sort: 0 },
    { name: 'Pour Over', nameAr: 'تقطير', nameKu: 'پۆر ئۆڤەر', tagline: 'Clean & Bright', taglineAr: 'نظيف ومشرق', taglineKu: 'پاک و ڕووناک', desc: 'A manual brewing method where hot water is poured over ground coffee in a filter, producing a clean and nuanced cup.', descAr: 'طريقة تحضير يدوية حيث يُصب الماء الساخن على القهوة المطحونة في فلتر، لإنتاج كوب نظيف ودقيق.', descKu: 'شێوازی دروستکردنی دەستی کە ئاوی گەرم لەسەر قاوەی ئاڕاو لە فلتەرێکدا دەڕژێت، فنجانێکی پاک و بەتام دروست دەکات.', time: '3-4 min', sort: 1 },
    { name: 'French Press', nameAr: 'فرنش بريس', nameKu: 'فرێنچ پرێس', tagline: 'Rich & Full-Bodied', taglineAr: 'غني وكامل', taglineKu: 'دەوڵەمەند و تەواو', desc: 'An immersion brewing method using a plunger to separate grounds from water, creating a rich, full-bodied coffee.', descAr: 'طريقة تحضير بالغمر باستخدام مكبس لفصل القهوة عن الماء، لإنتاج قهوة غنية وكاملة القوام.', descKu: 'شێوازی دروستکردن بە نوقومکردن بە بەکارهێنانی داگرتەیەک بۆ جیاکردنەوەی قاوە لە ئاو، قاوەیەکی دەوڵەمەند و بەجەستە دروست دەکات.', time: '4-5 min', sort: 2 },
    { name: 'AeroPress', nameAr: 'أيروبريس', nameKu: 'ئایرۆپرێس', tagline: 'Smooth & Versatile', taglineAr: 'ناعم ومتعدد', taglineKu: 'نەرم و فرەکارە', desc: 'A versatile pressure brewer that produces smooth, rich coffee with low acidity. Perfect for home and travel.', descAr: 'جهاز ضغط متعدد الاستخدامات ينتج قهوة ناعمة وغنية بحموضة منخفضة. مثالي للمنزل والسفر.', descKu: 'دروستکەری پەستانی فرەکارە کە قاوەیەکی نەرم و بەهێز بە ترشی کەم دروست دەکات. تەواوە بۆ ماڵ و گەشت.', time: '1-2 min', sort: 3 }
  ];

  for (const m of methods) {
    await conn.execute(
      'INSERT INTO brewing_methods (id, name, nameAr, nameKu, tagline, taglineAr, taglineKu, description, descriptionAr, descriptionKu, time, sortOrder, createdAt, updatedAt) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [m.name, m.nameAr, m.nameKu, m.tagline, m.taglineAr, m.taglineKu, m.desc, m.descAr, m.descKu, m.time, m.sort]
    );
    console.log('Created brewing method:', m.name);
  }

  console.log('DONE!');
  await conn.end();
}
main().catch(e => console.error(e));
