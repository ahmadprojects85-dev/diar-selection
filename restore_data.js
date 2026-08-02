const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');

  // 1. Delete all existing products first (foreign key constraint)
  await conn.execute('DELETE FROM products');
  console.log('Cleared products');

  // 2. Delete old category and brand
  await conn.execute('DELETE FROM categories');
  await conn.execute('DELETE FROM brands');
  console.log('Cleared categories and brands');

  // 3. Create proper categories
  const cats = [
    { id: 'cat_grinders', name: 'Grinders', nameAr: 'مطاحن', nameKu: 'ئاڕاوەکان', slug: 'grinders', desc: 'Premium manual and electric coffee grinders', sort: 0 },
    { id: 'cat_scales', name: 'Scales', nameAr: 'موازين', nameKu: 'تەرازووەکان', slug: 'scales', desc: 'Precision coffee scales for brewing', sort: 1 },
    { id: 'cat_kettles', name: 'Kettles', nameAr: 'غلايات', nameKu: 'کتری', slug: 'kettles', desc: 'Pour-over and electric kettles', sort: 2 },
    { id: 'cat_brewers', name: 'Brewers', nameAr: 'أدوات التحضير', nameKu: 'ئامێرەکانی دروستکردن', slug: 'brewers', desc: 'Coffee brewers and drippers', sort: 3 },
    { id: 'cat_filters', name: 'Filters', nameAr: 'فلاتر', nameKu: 'فلتەرەکان', slug: 'filters', desc: 'Coffee filter papers and accessories', sort: 4 },
    { id: 'cat_accessories', name: 'Accessories', nameAr: 'إكسسوارات', nameKu: 'ئاکسسواری', slug: 'accessories', desc: 'Coffee tools and accessories', sort: 5 }
  ];

  for (const c of cats) {
    await conn.execute(
      'INSERT INTO categories (id, name, nameAr, nameKu, slug, description, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [c.id, c.name, c.nameAr, c.nameKu, c.slug, c.desc, c.sort]
    );
  }
  console.log('Created 6 categories');

  // 4. Create proper brands
  const brands = [
    { id: 'brand_timemore', name: 'TIMEMORE', slug: 'timemore', sort: 0 },
    { id: 'brand_fellow', name: 'Fellow', slug: 'fellow', sort: 1 },
    { id: 'brand_1zpresso', name: '1Zpresso', slug: '1zpresso', sort: 2 },
    { id: 'brand_hario', name: 'Hario', slug: 'hario', sort: 3 },
    { id: 'brand_aeropress', name: 'AeroPress', slug: 'aeropress', sort: 4 },
    { id: 'brand_cafec', name: 'CAFEC', slug: 'cafec', sort: 5 },
    { id: 'brand_normcore', name: 'Normcore', slug: 'normcore', sort: 6 },
    { id: 'brand_generic', name: 'Diar Selection', slug: 'diar-selection', sort: 7 }
  ];

  for (const b of brands) {
    await conn.execute(
      'INSERT INTO brands (id, name, slug, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [b.id, b.name, b.slug, b.sort]
    );
  }
  console.log('Created 8 brands');

  // 5. Create products with correct categories and brands
  const products = [
    { name: 'Timemore C3 Max Hand Grinder', slug: 'timemore-c3-max', price: 79, cat: 'cat_grinders', brand: 'brand_timemore', best: true },
    { name: 'Timemore Black Mirror Digital Scale', slug: 'timemore-black-mirror-scale', price: 65, cat: 'cat_scales', brand: 'brand_timemore', best: true },
    { name: 'Fellow Stagg EKG Electric Kettle', slug: 'fellow-stagg-ekg', price: 199, cat: 'cat_kettles', brand: 'brand_fellow', best: true },
    { name: 'Fellow Pour Over Kettle', slug: 'fellow-pour-over-kettle', price: 125, cat: 'cat_kettles', brand: 'brand_fellow', best: false },
    { name: 'Fellow Atmos Vacuum Canister', slug: 'fellow-atmos-canister', price: 89, cat: 'cat_accessories', brand: 'brand_fellow', best: true },
    { name: 'Hario V60 Ceramic Dripper', slug: 'hario-v60-dripper', price: 22, cat: 'cat_brewers', brand: 'brand_hario', best: true },
    { name: 'Hario V60 Drip Decanter', slug: 'hario-v60-decanter', price: 25, cat: 'cat_brewers', brand: 'brand_hario', best: true },
    { name: 'AeroPress Go Travel Brewer', slug: 'aeropress-go', price: 39, cat: 'cat_brewers', brand: 'brand_aeropress', best: true },
    { name: 'CAFEC Abaca+ Coffee Filters', slug: 'cafec-abaca-filters', price: 9, cat: 'cat_filters', brand: 'brand_cafec', best: true },
    { name: '1Zpresso Q2 S Hand Grinder', slug: '1zpresso-q2s', price: 129, cat: 'cat_grinders', brand: 'brand_1zpresso', best: true },
    { name: 'Normcore Coffee Tamper', slug: 'normcore-tamper', price: 45, cat: 'cat_accessories', brand: 'brand_normcore', best: true },
    { name: 'Glass Coffee Server 600ml', slug: 'glass-server-600ml', price: 25, cat: 'cat_accessories', brand: 'brand_generic', best: true },
    { name: 'Milk Frothing Pitcher 350ml', slug: 'milk-pitcher-350ml', price: 18, cat: 'cat_accessories', brand: 'brand_generic', best: true },
    { name: 'WDT Tool for Espresso', slug: 'wdt-tool', price: 25, cat: 'cat_accessories', brand: 'brand_generic', best: false },
    { name: 'Coffee Dosing Cup 58mm', slug: 'dosing-cup-58mm', price: 12, cat: 'cat_accessories', brand: 'brand_generic', best: false },
    { name: 'Knock Box for Espresso', slug: 'knock-box', price: 29, cat: 'cat_accessories', brand: 'brand_generic', best: false }
  ];

  const placeholder = 'https://placehold.co/800x800/1a1a2e/e0e0e0?text=Upload+Image';

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await conn.execute(
      'INSERT INTO products (id, name, slug, description, price, currency, image, images, categoryId, brandId, isBestSeller, isFeatured, inStock, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        'prod_' + (i+1).toString().padStart(3,'0'),
        p.name, p.slug,
        p.name + ' - Premium coffee equipment from ' + (brands.find(b=>b.id===p.brand)?.name || 'Diar Selection'),
        p.price, 'IQD',
        placeholder,
        JSON.stringify([placeholder]),
        p.cat, p.brand,
        p.best ? 1 : 0, 0, 1, i
      ]
    );
  }
  console.log('Created ' + products.length + ' products');

  // Verify
  const [count] = await conn.execute('SELECT COUNT(*) as c FROM products');
  console.log('Total products in DB:', count[0].c);

  await conn.end();
  console.log('DONE! All data restored.');
}
main().catch(e => console.error(e));
