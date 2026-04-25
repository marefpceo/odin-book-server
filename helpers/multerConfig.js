import multer from 'multer';

const storageMulter = multer.diskStorage({
  // Define the destination to save the image file
  destination: function (req, file, cb) {
    cb(null, 'helpers/uploads');
  },

  // Create a new file name with extension and unique identifier. All spaces are also
  // replaced with and hyphen '-'
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const nameSplit = file.originalname
      .toLowerCase()
      .replace(/ /g, '-')
      .split('.');
    cb(null, nameSplit[0] + '-' + uniqueSuffix + '.' + nameSplit[1]);
  },
});

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];
const imageFilter = (req, file, cb) => {
  // Accept all images by MIME type
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only jpeg, png, gif, webp, and svg files are allowed.',
      ),
      false,
    );
  }
};

const uploadMulter = multer({
  storage: storageMulter,
  limits: {
    fileSize: 2097152,
  },
  fileFilter: imageFilter,
});

const upload = uploadMulter.single('avatar');

function fileUpload(req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(413).json({
        message: err.message,
      });
    } else if (err) {
      res.json({
        message: err.message,
      });
    }
  });
}

export { fileUpload };
