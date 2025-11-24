const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Middleware untuk optimize uploaded image
 * - Resize ke ukuran poster optimal (300x450 atau aspect ratio 2:3)
 * - Compress dengan quality tinggi untuk maintain detail
 * - Support format: webp (modern) dan jpeg (fallback)
 */
const optimizeImage = async (req, res, next) => {
  // Skip jika tidak ada file
  if (!req.file) {
    return next();
  }

  try {
    const uploadDir = path.join(__dirname, '../../uploads/posters');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Baca file yang di-upload
    const inputPath = req.file.path;

    // Generate nama file optimized
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(uploadDir, filename);

    // Optimize image dengan sharp
    // Target: 300x450 (2:3 aspect ratio untuk poster film)
    // Quality: 85 (balance antara quality dan file size)
    await sharp(inputPath)
      .resize(300, 450, {
        fit: 'cover', // crop untuk maintain aspect ratio
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    // Update req.file dengan new filename
    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Jika error, lanjut dengan file original (fallback)
    next();
  }
};

module.exports = optimizeImage;
