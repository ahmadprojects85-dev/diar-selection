const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://4HFuzzUvbnuATcM.root:3DBzD4790NHNiKFe@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  const [allTables] = await conn.execute("SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA NOT IN ('mysql','information_schema','performance_schema','INFORMATION_SCHEMA','PERFORMANCE_SCHEMA','METRICS_SCHEMA','sys')");
  console.log('ALL tables in restored branch:');
  allTables.forEach(t => console.log(' ', t.TABLE_SCHEMA + '.' + t.TABLE_NAME));
  await conn.end();
}
main().catch(e => console.error(e.message));
