const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
let delimiter = ",";
let lines = 2;
let lastUploadFilePath = "public/1588752722276-name.txt";

const filterData = (text) => {
    return text
        .toString()
        .split("\n")
        .filter((elm) => elm.includes(delimiter))
        .slice(0, lines);
};

app.post("/upload", function (req, res) {
    if (req.query.delimiter) {
        delimiter = req.query.delimiter;
    }

    if (req.query.lines) {
        lines = req.query.lines;
    }
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        lastUploadFilePath = req.file.path;
        let text = fs.readFileSync(req.file.path);
        return res.status(200).send(filterData(text));
    });
});

app.get("/filter", function (req, res) {
    if (req.query.delimiter) {
        delimiter = req.query.delimiter;
    }

    if (req.query.lines) {
        lines = req.query.lines;
    }

    let text = fs.readFileSync(lastUploadFilePath);
    return res.status(200).send(filterData(text));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
var upload = multer({ storage: storage }).single("file");

app.listen(process.env.PORT || 4000);
