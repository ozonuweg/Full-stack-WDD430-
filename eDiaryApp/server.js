const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./server/routes/posts");

const app = express();

require('dotenv').config();
const MONGODB_URI = `${process.env.MONGODB_URI}`;

mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true }, (err, res) => {
     if (err) {
        console.log('Connection failed: ' + err);
     }
     else {
        console.log('Connected to database!');
     }
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

const http = require("http");

const port = process.env.PORT || '3000';
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
