const fs = require("fs");
const multer = require("multer");
const path = require("path");

const handleFileUpload = (destination, fileType, keyMappings) => {
  return function (req, res, next) {
    let allowedFormats = [];

    // Determine allowed file formats based on fileType
    switch (fileType) {
      case "image":
        allowedFormats = ["image/jpeg", "image/png", "image/gif"];
        break;
      case "document":
        allowedFormats = [
          "application/pdf",
          "application/msword",
          "text/plain",
        ];
        break;
      // Add more cases for other file types if needed
      default:
        return res.status(400).send("Invalid file type");
    }

    // Check if the destination directory exists, if not, create it
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Set up multer storage for file uploads
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, destination);
      },
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });

    // Set up multer filter for allowed file types
    const fileFilter = function (req, file, cb) {
      if (allowedFormats.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("File format not supported"));
      }
    };

    const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
    });

    // Use multer middleware to handle file uploads
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).send("Error uploading files");
      }

      // Initialize the keys in the request body
      for (const key in keyMappings) {
        req.body[key] = [];
      }

      // Get array of uploaded files and store paths in the request body based on keyMappings
      req.uploadedFiles = req.files || [];
      req.uploadedFiles.forEach((file) => {
        const key = keyMappings[file.fieldname];
        if (key) {
          req.body[key].push(file.path);
        }
      });

      next();
    });
  };
};
module.exports = handleFileUpload;



