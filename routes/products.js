const os = require("os");
const fs = require("fs");
const multer = require('multer');

const productUploadRootPath = `${UPLOAD_PATH}/imgs/products`;

const opt_multer = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, productUploadRootPath)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  }),
  dest: UPLOAD_PATH+'/tmp/'

}

const upload = multer(opt_multer);

const productRoutes = (app, fs) => {
  
  
  app.post('/products/imgs/upload', upload.single('file'), function(req, res) {

    if(!req.file.originalname.includes('image')) {
      res.json({error:'image only'});return;    
    }

    var file = productUploadRootPath + '/' + req.file.filename;
    fs.rename(req.file.path, file, function(err) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.json({
          message: 'File uploaded successfully',
          filename: req.file.filename
        });
      }
    });
  });

};

module.exports = productRoutes;
