const express = require("express");
const multer = require("multer");

const Post = require("../models/Post");
const checkAuth = require("../middleware/check-auth")

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

// Posts CRUD

var upload = multer({storage: storage})

router.post("", checkAuth, 
  upload.single("img"), (req, res, next) => {
    var img = null
    const url = req.protocol + "://" + req.get("host"); 
    
    if(req.file){
      const filedir = url + "/backend/nodeserver/images/" + req.file.filename;
      img = filedir;
    } 
    const postTask = new Post({
        userId: req.body.userId,
        caption: req.body.caption,
        date: req.body.date,
        img: img,
        facebook: req.body.facebook,
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

router.get("/:id", checkAuth, (req ,res, next) => {
  Post.find({userId: req.params.id}).then(user_posts => {
    return res.status(200).json({
      message: 'Posts fetched Successfully',
      posts: user_posts
    })
  })
})

router.get("/post/:id", checkAuth, (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  })
})

router.put("/:id", checkAuth,
  upload.single("img"), (req, res, next) => {
    let imagePath = req.body.img;

    var filedir
    const url = req.protocol + "://" + req.get("host"); 
    
    if(req.file){
      filedir = url + "/backend/nodeserver/images/" + req.file.filename
      imagePath = filedir 
    } 

    const postTask = new Post({
      _id: req.params.id,
      userId: req.body.userId,
      caption: req.body.caption,
      date: req.body.date,
      img: imagePath,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
    });

    console.log(postTask);
    Post.updateOne({ _id: req.params.id }, postTask).then(result => {
      res.status(200).json({ message: "Update Successful" })
    })
})

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});



module.exports = router
