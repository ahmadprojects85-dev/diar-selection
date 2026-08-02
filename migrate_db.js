const mysql = require('mysql2/promise');

const oldUrl = 'mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';
const newUrl = 'mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';

async function main() {
  console.log('Connecting to old DB...');
  const oldDb = await mysql.createConnection(oldUrl);
  
  console.log('Connecting to new DB...');
  const newDb = await mysql.createConnection(newUrl);

  const tables = [
    'categories',
    'brands',
    'brewing_methods',
    'hero_slides',
    'site_settings',
    'news_articles',
    'products',
    'orders',
    'order_items'
  ];

  await newDb.execute('SET FOREIGN_KEY_CHECKS = 0');

  for (const table of tables) {
    console.log('Migrating table ' + table + '...');
    const [rows] = await oldDb.execute('SELECT * FROM ' + table);
    
    if (rows.length === 0) {
      console.log('  No data in ' + table);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const query = 'INSERT INTO ' + table + ' (' + columns.join(', ') + ') VALUES (' + placeholders + ')';

    let count = 0;
    for (const row of rows) {
      const values = columns.map(col => row[col]);
      try {
        await newDb.execute(query, values);
        count++;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
           // Skip
        } else {
           console.error('  Error inserting into ' + table + ':', err.message);
        }
      }
    }
    console.log('  Migrated ' + count + ' rows to ' + table);
  }

  await newDb.execute('SET FOREIGN_KEY_CHECKS = 1');

  await oldDb.end();
  await newDb.end();
  console.log('Database migration complete!');
}
main().catch(e => console.error(e));
