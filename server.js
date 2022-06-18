const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql');
const ejs = require('ejs');

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static/video'));

// DB

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
});

connection.connect((err) => {
    if (err) return console.error('error: ' + err.message);

    console.log('Connected to the MySQL server.');
  
    if (err) throw err;
});

// MULTER

const valid_track_format = (trackMimeType) => {
    const mimetypes = ["video/mp4"];
    return mimetypes.indexOf(trackMimeType) > -1;
}
  
const track_file_filter = (req, file, cb) => {
    cb(null, valid_track_format(file.mimetype));
}
  
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {

            const server_path = `${path.dirname(require.main.filename)}/static/video`;

            const remove_old_video = () => {
                fs.readdir(server_path, (err, files) => {
                    if (err) throw err;
      
                    for (const file of files) {
                        fs.unlink(path.join(server_path, file), err => {
                            if (err) throw err;
                        });
                    }
                });
            }

            if (fs.existsSync(server_path)) remove_old_video();
            fs.mkdirsSync(server_path);
            callback(null, server_path);

        },
        filename: (req, file, callback) => {    

            const file_name_and_domain_name = file.originalname;
            const filename = file_name_and_domain_name.split('(^)')[0];

            callback(null, filename);
        }
    }),
    fileFilter: track_file_filter
});

// ROUTES

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
})


app.post('/video', upload.single('video'), (req, res) => {
    return res.json({ok: 1})
})

app.listen(port);
console.log(`Server is running on ${port}`);