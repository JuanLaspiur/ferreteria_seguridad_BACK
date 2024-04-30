const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/docs',
  filename: (req, file, cb) => {
    let name = req.body.title ? req.body.title : 'default';
    name = name.replace(/\s/g, '-');
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes =
      /image\/.*|audio\/.*|video\/.*|application\/pdf|application\/msword|application\/vnd.ms-excel|text\/plain/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

module.exports = upload;
