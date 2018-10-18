const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const port = 3000;
const uploadsPath = './public/uploads';
const publicPath = './public/';

const app = express();
app.set('view engine', 'pug');
app.use(express.static(publicPath));
// const upload = multer({ dest: './public/uploads/'});
const storage = multer.diskStorage({
    destination: uploadsPath,
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, callback) {
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
    fs.readdir(uploadsPath, function(err, items) {
        const itemPaths = items.map(item => `uploads/${item}`);
        res.render('index', {title: 'KenzieGram', h1: 'Welcome to Kenziegram', images: itemPaths});
    });
});

app.post('/uploads/', upload.single('myImage'), (req, res) => {
    // res.send(`<a href="..">Back</a><img src="${req.file.filename}">`);
    res.render('upload', {title: 'Upload', h1: 'file uploaded', imagePath: `uploads/${req.file.filename}`});
});

app.listen(port, () => console.log(`Server listening on port ${port}.`));