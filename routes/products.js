const os = require("os");
const fs = require("fs");

const multer = require("multer");

// global variables
const dataPath = "./data/products.json";
const productUploadRootPath = `${UPLOAD_PATH}/imgs/products`;

const opt_multer = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, productUploadRootPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + ".jpg"); //Appending .jpg
    },
  }),
  dest: UPLOAD_PATH + "/tmp/",
};

const upload = multer(opt_multer);

const productRoutes = (app, fs) => {

  app.get("/products", (req, res) => {
    const type_id = req.query.type_id || "";
    const maincat_id = req.query.maincat_id || "";
    const subcat1_id = req.query.subcat1_id || "";

    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
        // throw err;
      }

      data = JSON.parse(data);
      if (type_id) data = data.filter((v) => v.type_id == type_id);
      if (maincat_id) data = data.filter((v) => v.maincat_id == maincat_id);
      if (subcat1_id) data = data.filter((v) => v.subcat1_id == subcat1_id);
      res.json(data);
      return;
    });
  });
  app.get("/product/:id", (req, res) => {

    if(!req.params.id) return res.status(403).json({ error: 'paramsBlank:id params is blank' });
    const id = req.params.id;
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
        // throw err;
      }

      data = JSON.parse(data);
      data = data.filter((v) => v.id == id)[0];
      if(!data||data.length<=0) return res.json({error: 'idInValid:invalid prodict id'}); 
      res.json(data);return;
    });
  });

  // -----------------------------------------
  // upload
  app.post("/products/imgs/upload", upload.single("file"), function (req, res) {
    if (!req.file.originalname.includes("image")) {
      res.json({ error: "image only" });
      return;
    }

    var file = productUploadRootPath + "/" + req.file.filename;
    fs.rename(req.file.path, file, function (err) {
      if (err) {
        // console.log(err);
        res.status(500).send({ error: err });
      } else {
        res.json({
          success: "File uploaded successfully",
          filename: req.file.filename,
        });
      }
    });
  });
};

module.exports = productRoutes;
