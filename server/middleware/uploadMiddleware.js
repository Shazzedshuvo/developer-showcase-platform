const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

// Use memory storage so files are kept in RAM as Buffer,
// then streamed directly to Cloudinary (no disk I/O).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

/**
 * uploadToCloudinary
 * Wraps cloudinary.uploader.upload_stream in a Promise
 * so it can be awaited in async controllers.
 *
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Single file field "image"
const uploadSingle = upload.single('image');

// Single file field "logo"
const uploadLogo = upload.single('logo');

// Single file field "avatar"
const uploadAvatar = upload.single('avatar');

// Multiple files: "coverImage" (1) + "gallery" (up to 10)
const uploadProjectImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

module.exports = {
  upload,
  uploadSingle,
  uploadLogo,
  uploadAvatar,
  uploadProjectImages,
  uploadToCloudinary,
};
