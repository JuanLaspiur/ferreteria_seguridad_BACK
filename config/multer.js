// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Set the destination directory for uploaded files
//     cb(null, 'uploads/img');
//   },
//   filename: (req, file, cb) => {
//     // Generate a unique filename for the uploaded file
//     let name = req.body.title ? req.body.title : 'default';
//     name = name.replace(/\s/g, '-');

//     // Extract the file extension
//     const ext = path.extname(file.originalname);

//     // Construct the filename with the original name, timestamp, and extension
//     const filename = `${name}-${Date.now()}${ext}`;

//     // Pass the filename to the callback
//     cb(null, filename);
//   },
// });

// // Define the file filter function
// const fileFilter = (req, file, cb) => {
//   // Check if the file mimetype is JPEG or PNG
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     // Accept the file
//     cb(null, true);
//   } else {
//     // Reject the file with an error message
//     cb(new Error('Only JPEG and PNG files are allowed'));
//   }
// };

// // Configure multer with the storage and fileFilter options
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
//   },
//   fileFilter: fileFilter,
// });

// module.exports = upload;

const Multer = require('multer');

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});
module.exports = upload;
