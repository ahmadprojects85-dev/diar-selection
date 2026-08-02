const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  const [result1] = await conn.execute("UPDATE products SET price = price * 1500, currency = 'IQD'");
  console.log("Updated prices and set currency to IQD. Rows affected: " + result1.affectedRows);
  
  const [result2] = await conn.execute("UPDATE products SET originalPrice = originalPrice * 1500 WHERE originalPrice IS NOT NULL");
  console.log("Updated original prices. Rows affected: " + result2.affectedRows);

  const [prods] = await conn.execute('SELECT name, price, currency FROM products LIMIT 5');
  console.log(prods);

  await conn.end();
}
main().catch(e => console.error(e));
