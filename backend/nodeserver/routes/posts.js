const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "images/");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name);
    }
});

var upload = multer({storage: storage})

router.post("", upload.single("image"), (req, res, next) => {
    var fileinfo = req.file.filename;
    console.log(req.body)
    console.log(req.body.username)
    const postTask = new Post({
        user_id: req.body.username,
        caption: req.body.caption,
        date: req.body.time,
        img: "backend/nodeserver/images/" + fileinfo,
        facebook: req.body.facebook,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
    });
    console.log(postTask)
    
    postTask.save().then(createdPost => {
        res.status(201).json({
            message: "Post Scheduled Successfully!",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        })
    })
})

module.exports = router