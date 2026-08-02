const mysql = require('mysql2/promise');

const oldUrl = 'mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';
const newUrl = 'mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';

async function main() {
  const oldDb = await mysql.createConnection(oldUrl);
  const newDb = await mysql.createConnection(newUrl);

  const [rows] = await oldDb.execute('SELECT * FROM news_articles');
  if (rows.length === 0) return console.log('No news articles.');

  const columns = ['id', 'tag', 'tagAr', 'tagKu', 'title', 'titleAr', 'titleKu', 'excerpt', 'excerptAr', 'excerptKu', 'image', 'isFeatured', 'sortOrder', 'createdAt', 'updatedAt'];
  
  const placeholders = columns.map(() => '?').join(', ');
  const query = 'INSERT INTO news_articles (' + columns.join(', ') + ') VALUES (' + placeholders + ')';

  let count = 0;
  for (const row of rows) {
    const values = columns.map(col => row[col] !== undefined ? row[col] : null);
    try {
      await newDb.execute(query, values);
      count++;
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') console.error('Error:', err.message);
    }
  }
  console.log('Migrated ' + count + ' news_articles');

  await oldDb.end();
  await newDb.end();
}
main().catch(e => console.error(e));
