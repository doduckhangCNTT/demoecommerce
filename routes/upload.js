const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Admin can upload image
router.post('/upload', auth, authAdmin, (req, res) => {
  try {
    console.log(req.files);
    // Kiem file gui len có đúng theo yêu cầu hay ko
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No files were uploaded' });
    }
    // Kiem tra chat luong cua anh
    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res
        .status(400)
        .json({ success: false, message: 'Size image too large' });
    }
    // Kiem tra image type
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);

      return res
        .status(400)
        .json({ success: false, message: 'File format is incorrect' });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: 'test' }, // Tạo folder mới trên cloudinary
      async (error, result) => {
        if (error) throw error;

        removeTmp(file.tempFilePath);

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
    // res.json({ success: true, message: file.tempFilePath });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Admin can delete image
router.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res
        .status(404)
        .json({ success: false, message: 'No images selected' });
    }
    cloudinary.v2.uploader.destroy(public_id, (err, result) => {
      if (err) throw err;
      res.json({ success: true, message: 'Deleted Image' });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = router;
