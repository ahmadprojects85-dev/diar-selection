const cloudinary = require('cloudinary').v2;
const mysql = require('mysql2/promise');

cloudinary.config({
  cloud_name: 'xhwjjoci',
  api_key: '667829947741291',
  api_secret: 'TkVsSu2cKDg7Zh3Y1xum5emcnOA'
});

const imageMap = {
  'timemore-c3-max': 'https://m.media-amazon.com/images/I/61Wlq1FqYBL._AC_SL1500_.jpg',
  'timemore-black-mirror-scale': 'https://m.media-amazon.com/images/I/61sFNqxCURL._AC_SL1500_.jpg',
  'fellow-stagg-ekg': 'https://m.media-amazon.com/images/I/51aNGqDgURL._AC_SL1500_.jpg',
  'fellow-pour-over-kettle': 'https://m.media-amazon.com/images/I/41+tGSr5SSL._AC_SL1200_.jpg',
  'fellow-atmos-canister': 'https://m.media-amazon.com/images/I/51c4zRXkQ2L._AC_SL1500_.jpg',
  'hario-v60-dripper': 'https://m.media-amazon.com/images/I/61dGvVSiHSL._AC_SL1500_.jpg',
  'hario-v60-decanter': 'https://m.media-amazon.com/images/I/61bKp1ZRMQL._AC_SL1500_.jpg',
  'aeropress-go': 'https://m.media-amazon.com/images/I/71Bc5VnpnjL._AC_SL1500_.jpg',
  'cafec-abaca-filters': 'https://m.media-amazon.com/images/I/71G7R2MUV0L._AC_SL1500_.jpg',
  '1zpresso-q2s': 'https://m.media-amazon.com/images/I/61YIqKEgYnL._AC_SL1500_.jpg',
  'normcore-tamper': 'https://m.media-amazon.com/images/I/61LPQ6pYwXL._AC_SL1500_.jpg',
  'glass-server-600ml': 'https://m.media-amazon.com/images/I/61JYez3uURL._AC_SL1500_.jpg',
  'milk-pitcher-350ml': 'https://m.media-amazon.com/images/I/61UivbzYxKL._AC_SL1500_.jpg',
  'wdt-tool': 'https://m.media-amazon.com/images/I/61dU1oG2xqL._AC_SL1500_.jpg',
  'dosing-cup-58mm': 'https://m.media-amazon.com/images/I/61JZ-TSWTRL._AC_SL1500_.jpg',
  'knock-box': 'https://m.media-amazon.com/images/I/61SjXPLDEeL._AC_SL1500_.jpg'
};

async function main() {
  const conn = await mysql.createConnection('mysql://3cPdvRQPZ12fA3f.root:a3fGDcyD1osxc3VF@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
  
  const slugs = Object.keys(imageMap);
  let done = 0;
  
  for (const slug of slugs) {
    const sourceUrl = imageMap[slug];
    try {
      console.log('Uploading', slug, '...');
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder: 'diar-selection/products',
        public_id: slug,
        overwrite: true
      });
      const imageUrl = result.secure_url;
      console.log('  Uploaded:', imageUrl);
      
      await conn.execute(
        'UPDATE products SET image = ?, images = ? WHERE slug = ?',
        [imageUrl, JSON.stringify([imageUrl]), slug]
      );
      console.log('  DB updated for', slug);
      done++;
    } catch (err) {
      console.error('  FAILED for', slug, ':', err.message);
    }
  }
  
  console.log('Done!', done, 'of', slugs.length, 'products updated with real images.');
  await conn.end();
}
main().catch(e => console.error(e));
