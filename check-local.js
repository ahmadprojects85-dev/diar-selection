const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/_next\/static\/chunks\/[a-zA-Z0-9\-_.]+\.js)"/g);
    if (match) {
      match.forEach(src => {
        const url = 'http://localhost:3000' + src.replace('src="', '').replace('"', '');
        http.get(url, (res2) => {
          let js = '';
          res2.on('data', chunk => js += chunk);
          res2.on('end', () => {
            if (js.includes('Please fill in all your details before proceeding.')) {
              console.log('FOUND IN: ' + url);
            }
          });
        });
      });
    } else {
      console.log('No chunks found in HTML');
    }
  });
}).on('error', (e) => {
  console.log("Error fetching localhost: ", e);
});
