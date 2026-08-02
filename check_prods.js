const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const [prods] = await conn.execute('SELECT id, name, createdAt FROM products ORDER BY createdAt DESC LIMIT 10');
  console.log("Recent products in NEW DB:");
  console.log(prods);

  const oldConn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const [oldProds] = await oldConn.execute('SELECT id, name, createdAt FROM products ORDER BY createdAt DESC LIMIT 10');
  console.log("Recent products in OLD DB:");
  console.log(oldProds);

  await conn.end();
  await oldConn.end();
}
main().catch(e => console.error(e));
