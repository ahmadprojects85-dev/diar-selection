const mysql = require('mysql2/promise');
async function main() {
  const newConn = await mysql.createConnection('mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const oldConn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');

  const [oldProds] = await oldConn.execute("SELECT * FROM products WHERE id IN ('cmrrp4xct0007k0520uqkqcqw', 'cmrroxtgd0005k052jp4wqzq7', 'cmrri1ffg0003k0520mrptbzx', 'cmrrhwxox0001k052no12r0z4')");

  if (oldProds.length > 0) {
    const columns = Object.keys(oldProds[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const query = 'INSERT INTO products (' + columns.join(', ') + ') VALUES (' + placeholders + ')';

    let count = 0;
    for (const row of oldProds) {
      const values = columns.map(col => row[col]);
      try {
        await newConn.execute(query, values);
        count++;
      } catch (e) {
        if(e.code !== 'ER_DUP_ENTRY') console.error(e.message);
      }
    }
    console.log("Recovered " + count + " new products to the new DB!");
  } else {
    console.log("Could not find the products.");
  }
  
  await newConn.end();
  await oldConn.end();
}
main().catch(e => console.error(e));
