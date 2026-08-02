const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({
    uri: 'mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/sys',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });
  await conn.execute('CREATE DATABASE IF NOT EXISTS test');
  console.log('Database test created successfully!');
  await conn.end();
}
main().catch(e => console.error(e));
