const https = require('https');

https.get('https://diar-selection.pages.dev/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/_next\/static\/chunks\/[a-zA-Z0-9\-_.]+\.js)"/g);
    if (match) {
      match.forEach(src => {
        const url = 'https://diar-selection.pages.dev' + src.replace('src="', '').replace('"', '');
        https.get(url, (res2) => {
          let js = '';
          res2.on('data', chunk => js += chunk);
          res2.on('end', () => {
            if (js.includes('Please fill in all your details before proceeding.')) {
              console.log('FOUND IN: ' + url);
            }
          });
        });
      });
    }
  });
});
