const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  // Get full product details to see what the seed put in
  const [prods] = await conn.execute('SELECT * FROM products');
  console.log(JSON.stringify(prods, null, 2));
  
  await conn.end();
}
main().catch(e => console.error(e.message));
