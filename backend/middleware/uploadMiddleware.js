const multer = require("multer")

// keep the file in memory so we can stream it to Cloudinary
const storage = multer.memoryStorage()

// only allow image files
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

module.exports = upload
