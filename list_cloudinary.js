const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'xhwjjoci',
  api_key: '667829947741291',
  api_secret: 'TkVsSu2cKDg7Zh3Y1xum5emcnOA'
});

async function main() {
  const result = await cloudinary.api.resources({ type: 'upload', max_results: 100 });
  console.log('Total images on Cloudinary:', result.resources.length);
  result.resources.forEach(r => {
    console.log(r.public_id, '|', r.format, '|', r.created_at, '|', r.secure_url);
  });
}
main().catch(e => console.error(e.message));
