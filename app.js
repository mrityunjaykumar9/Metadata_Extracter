// Require necessary modules and set up initial configurations
require('dotenv').config();

var express = require("express"),
  path = require("path"),
  multer = require("multer"),
  favicon = require("serve-favicon"),
  port = process.env.PORT || 3000;

const axios = require('axios');
const fs = require('fs');
var app = express();

// Define the storage for uploaded files using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination directory where files will be stored
    cb(null, path.join(__dirname, "/uploads"));
  },
  filename: function (req, file, cb) {
    // Set the file name to the original name of the uploaded file
    cb(null, file.originalname);
  },
});

// Create the multer instance with the defined storage
const upload = multer({ storage: storage });

// Serve the favicon and static files from the "public" directory
app.use(favicon(path.join(__dirname, "public", "favicon.png")));
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view-engine", "ejs");

// Define a route for the root URL
app.get("/", function (req, res) {
  // Render an EJS template named "getmd.ejs"
  res.render("pages/getmd.ejs");
});

// Define a route for handling file uploads and URL inputs
app.post("/", upload.single("uploadedFile"), async function (req, res) {
    const data = [];
  
    if (req.body.fileLink) {
      // Handle the case where a file link was provided
      const fileLink = req.body.fileLink;
      
      try {
        // Send a HEAD request to get file metadata from the provided URL
        const response = await axios.head(fileLink);
        
        if (response.headers['content-length']) {
          data.push(
            {
              column1: "File Link : ",
              column2: fileLink,
            },
            {
              column1: "MIME Type : ",
              column2: response.headers['content-type'],
            },
            {
              column1: "File Size : ",
              column2: (parseInt(response.headers['content-length']) / 1024).toFixed(2) + " KB", // Convert to KB
            }
          );
        } else {
          data.push(
            {
              column1: "File Link : ",
              column2: fileLink,
            },
            {
              column1: "MIME Type : ",
              column2: "Unknown",
            },
            {
              column1: "File Size : ",
              column2: "Unknown",
            }
          );
        }
      } catch (error) {
        // Handle errors (e.g., the URL is invalid or the file does not exist)
        data.push(
          {
            column1: "File Link : ",
            column2: fileLink,
          },
          {
            column1: "MIME Type : ",
            column2: "Error",
          },
          {
            column1: "File Size : ",
            column2: "Error",
          }
        );
      }
    }
    else if (req.file) {
      // Handle the case where a file was uploaded
      const fileExtension = req.file.originalname.split(".").pop();
      data.push(
        {
          column1: "File Name : ",
          column2: req.file.originalname,
        },
        {
          column1: "MIME Type : ",
          column2: req.file.mimetype,
        },
        {
          column1: "File Size : ",
          column2: (req.file.size / 1024).toFixed(2) + " KB", // Convert to KB
        },
        {
          column1: "File Extension : ",
          column2: fileExtension,
        },
        {
          column1: "File Path : ",
          column2: req.file.path,
        }
      );
    }
  
    // Render an EJS template named "metadata.ejs" and pass the metadata as data
    res.render("pages/metadata.ejs", { data: data });
  });

  app.get('/list', (req, res) => {
    // Read the contents of the 'uploads' directory
    const files = fs.readdirSync('uploads');
    
    // Create an array to store the JSON data
    const jsonData = [];
  
    // Process each file and add it to the JSON array
    files.forEach((filename) => {
      jsonData.push({ filename });
    });
  
    // Render an EJS template with the JSON data
    res.render('pages/files.ejs', { jsonData });
  });  

// Start the Express app and listen on the specified port
app.listen(port, function () {
  console.log("App running on port", port);
});
