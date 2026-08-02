const Jimp = require('jimp');

async function checkImage() {
  try {
    const image = await Jimp.read('public/nav-logo.png');
    console.log(`Dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
    
    // Check top-left corner pixel color
    const color = Jimp.intToRGBA(image.getPixelColor(0, 0));
    console.log(`Top-left pixel color: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
    
    // Check some other corner
    const color2 = Jimp.intToRGBA(image.getPixelColor(image.bitmap.width - 1, 0));
    console.log(`Top-right pixel color: rgba(${color2.r}, ${color2.g}, ${color2.b}, ${color2.a})`);

  } catch (err) {
    console.error(err);
  }
}

checkImage();
