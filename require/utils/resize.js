'use strict';
const sharp = require('sharp');

// file = full path to image (req.file.path), thumbname = filename (req.file.filename)
const makeThumbnail = async (file, thumbname) => 
{ 
  await sharp(file)
  .resize(400, 400)
  .toFile(`thumbnails/${thumbname}`);
};

module.exports = {
  makeThumbnail,
};