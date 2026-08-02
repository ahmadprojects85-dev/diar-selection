const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  console.log('=== CATEGORIES ===');
  const [cats] = await conn.execute('SELECT id, name, slug, image FROM categories');
  cats.forEach(c => console.log(c.id, '|', c.name, '|', c.slug, '|', c.image ? c.image.substring(0,50) : 'NO IMAGE'));
  
  console.log('\n=== PRODUCTS WITH CATEGORIES ===');
  const [prods] = await conn.execute('SELECT p.name, p.price, p.categoryId, p.image, p.inStock, c.name as catName FROM products p LEFT JOIN categories c ON p.categoryId = c.id');
  prods.forEach(p => console.log(p.name, '|', p.price, '|', p.catName || 'NO CATEGORY', '|', p.image ? p.image.substring(0,60) : 'NO IMAGE', '|', p.inStock ? 'IN STOCK' : 'OUT OF STOCK'));
  
  console.log('\n=== BRANDS ===');
  const [brands] = await conn.execute('SELECT id, name, slug FROM brands');
  brands.forEach(b => console.log(b.id, '|', b.name, '|', b.slug));

  console.log('\n=== HERO SLIDES ===');
  const [slides] = await conn.execute('SELECT id, title, isActive FROM hero_slides');
  slides.forEach(s => console.log(s.id, '|', s.title, '|', s.isActive ? 'ACTIVE' : 'INACTIVE'));
  
  console.log('\n=== BREWING METHODS ===');
  const [bm] = await conn.execute('SELECT id, name FROM brewing_methods');
  bm.forEach(b => console.log(b.id, '|', b.name));

  await conn.end();
}
main().catch(e => console.error(e.message));
