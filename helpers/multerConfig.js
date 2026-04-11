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

const uploadMulter = multer({ storage: storageMulter });

export { storageMulter, uploadMulter };
