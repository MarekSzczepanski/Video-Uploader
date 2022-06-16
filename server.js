const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const multer = require('multer');
//const mysql = require('mysql');

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

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

            const server_path = `${path.dirname(require.main.filename)}/video`;

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
            callback(null, 'video.mp4');
        }
    }),
    fileFilter: track_file_filter
});

// ROUTES

app.post('/video', upload.single('video'), (req, res) => {
    return res.json({ok: 1})
})

app.listen(port);
console.log(`Server is running on ${port}`);