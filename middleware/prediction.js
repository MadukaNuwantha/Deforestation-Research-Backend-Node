const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, prediction, callback) {
        callback(null, './public/predictions');
    },
    filename: function (req, prediction, callback) {
        let ext = prediction.originalname.split(".");
        ext = ext.pop()
        callback(null, prediction.fieldname + "-" + Date.now() + "." + ext);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };