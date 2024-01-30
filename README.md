## Video-Uploader

Web application that allows uploading, saving to database and displaying user's video and it's description
The app uses NodeJS backend connected to MySQL database and pure JS frontend code

## How To install:

Use 'npm install' command

Set your local MySQL database

Create 'video' table in your database

In 'video' table create regular id column and 'description' TINYTEXT column

Create and set your database data in nodemon.json file this way (example of data below):

"env": {
"HOST": "localhost",
"USER": "root",
"PASS": "",
"DB": "video-uploader"
}

Add 'env.js' file in /static directory with following line of code there:

'document.body.dataset.development = ''; - for localhost

'document.body.dataset.development = 'prod'; - for production

For production environment you can add a production link in index.js file

Run the app by 'nodemon server.js' command

You can set the port in server.js file

Uploaded video is available in static/video directory
