const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  console.log('=== CATEGORIES ===');
  const [cats] = await conn.execute('SELECT name, nameAr, nameKu, slug FROM categories ORDER BY sortOrder');
  cats.forEach(c => console.log(' ', c.name, '|', c.nameAr, '|', c.nameKu));
  
  console.log('\n=== PRODUCTS BY CATEGORY ===');
  const [prods] = await conn.execute('SELECT p.name, p.price, c.name as cat, b.name as brand FROM products p JOIN categories c ON p.categoryId=c.id LEFT JOIN brands b ON p.brandId=b.id ORDER BY c.sortOrder, p.sortOrder');
  let lastCat = '';
  prods.forEach(p => {
    if (p.cat !== lastCat) { console.log('\n  [' + p.cat + ']'); lastCat = p.cat; }
    console.log('    ', p.name, '|', p.price, 'IQD', '|', p.brand);
  });
  
  await conn.end();
}
main().catch(e => console.error(e));
