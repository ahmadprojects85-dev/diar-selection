const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://4HFuzzUvbnuATcM.root:3DBzD4790NHNiKFe@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/restaurant?ssl={"rejectUnauthorized":true}');
  const [tables] = await conn.execute('SHOW TABLES');
  console.log('Tables in restaurant:', JSON.stringify(tables));
  const [schemas] = await conn.execute("SELECT DISTINCT TABLE_SCHEMA FROM information_schema.tables WHERE TABLE_SCHEMA NOT IN ('mysql','information_schema','performance_schema','INFORMATION_SCHEMA','PERFORMANCE_SCHEMA','METRICS_SCHEMA')");
  console.log('All schemas:', JSON.stringify(schemas));
  const [testTables] = await conn.execute("SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = 'test'");
  console.log('Tables in test:', JSON.stringify(testTables));
  await conn.end();
}
main().catch(e => console.error(e.message));
