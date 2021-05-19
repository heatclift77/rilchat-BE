const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/assets");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ 
    storage: storage ,
    fileFilter : function (req, file, cb){
        const err = new Error("file harus gambar");
        const file_image = file.mimetype.split("/")[1];
        if(file_image == "jpeg" || file_image == "jpg" || file_image == "png"){
            cb(null, true);
        }else{
            cb(err, false);
        }
    },
    limits : {
        fileSize : 3000000
    }
}).single("img");

module.exports = upload;