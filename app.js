const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const port = 3000;

const app = express();
app.use(express.static('./public'));
// const upload = multer({ dest: './public/uploads/'});
const storage = multer.diskStorage({
    destination: './public/uploads', 
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, callback) {
        checkFileType(file, callback);
    }
});

function checkFileType(file, callback) {
    const filetypes = /jpg|jpeg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return callback(null, true);
    } else {
        callback('Error: Images only!');
    }
}

app.get('/', (req, res) => {
    
    fs.readdir('./public/uploads', function (err, items) {
        let responseString = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Kenziegram</title></head><body> <section><form method="POST" action="uploads/" enctype="multipart/form-data"><div> <label for="image-upload">Upload an image</label> <input type="file" id="image-upload" name="myImage"></div><div> <button type="submit">Upload Image</button></div></form> </section><section id="images-container"></section> <script src="index.js"></script> </body></html>';

        items.forEach(item => responseString += `<img src="uploads/${item}" width=500>`);
        res.send(`${responseString}`);
    });

});

app.post('/uploads/', upload.single('myImage'), (req, res) => {
    res.send(`<a href="..">Back</a><img src="${req.file.filename}">`);
});

app.listen(port, () => console.log(`Server listening on port ${port}.`));