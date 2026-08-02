const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const [tables] = await conn.execute('SHOW TABLES');
  console.log('Tables in test (original cluster):', JSON.stringify(tables));
  if (tables.some(t => Object.values(t)[0] === 'products')) {
    const [products] = await conn.execute('SELECT name, price FROM products');
    console.log('Products found:', products.length);
    products.forEach(p => console.log(' -', p.name, '|', p.price));
  }
  await conn.end();
}
main().catch(e => console.error(e.message));
