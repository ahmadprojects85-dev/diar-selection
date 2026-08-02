const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://4HFuzzUvbnuATcM.root:3DBzD4790NHNiKFe@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  console.log('=== CATEGORIES in restored branch test schema ===');
  const [cats] = await conn.execute('SELECT id, name, slug, image FROM categories');
  cats.forEach(c => console.log(c.id, '|', c.name, '|', c.slug, '|', c.image ? c.image.substring(0,80) : 'NO IMAGE'));
  
  console.log('\n=== PRODUCTS in restored branch test schema ===');
  const [prods] = await conn.execute('SELECT p.name, p.price, p.image, c.name as catName FROM products p LEFT JOIN categories c ON p.categoryId = c.id');
  prods.forEach(p => console.log(p.name, '|', p.price, '|', p.catName || 'NO CAT', '|', p.image ? p.image.substring(0,80) : 'NO IMAGE'));
  
  console.log('\n=== BRANDS ===');
  const [brands] = await conn.execute('SELECT id, name FROM brands');
  brands.forEach(b => console.log(b.id, '|', b.name));
  
  console.log('\n=== HERO SLIDES ===');
  const [slides] = await conn.execute('SELECT id, title FROM hero_slides');
  slides.forEach(s => console.log(s.id, '|', s.title));

  await conn.end();
}
main().catch(e => console.error(e.message));
