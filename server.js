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
        const server_path = `${path.dirname(require.main.filename)}`;

        fs.mkdirsSync(server_path);
        callback(null, server_path);
      },
      filename: (req, file, callback) => {
        const filename = 'video.mp4';
        
        callback(null, filename);
      }
    }),
    fileFilter: track_file_filter
  });

app.post('/video', upload.single('video'), (req, res) => {
    return res.json({ok: 1})
})

app.listen(port);
console.log(`Server is running on ${port}`);