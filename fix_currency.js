const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const [result] = await conn.execute("UPDATE products SET currency = 'USD'");
  console.log("Updated products to USD: " + result.affectedRows);
  await conn.end();
}
main().catch(e => console.error(e));
