const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    return cb(null, "uploads/")
  },

  filename(req, file, cb) {
    const date = moment().format("DDMMYYYY-HHmmss_SSS")
    return cb(null, `${date}.${file.mimetype.split("/")[1]}`)
  }
})

function fileFilter(req, file, cb) {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
})