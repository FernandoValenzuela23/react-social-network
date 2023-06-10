const express = require("express");
const router = express.Router();
const multer = require("multer");
const PublicationController = require("../controllers/publication");
const { auth } = require("../middlewares/auth");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images/publication/');
    },

    filename: function(req, file, cb){
        cb(null, "pub-" + Date.now() + file.originalname);
    }
})

// middleware
const uploads = multer({storage});

router.post('/create', [
        auth
    ],
    PublicationController.create);

router.get('/:id', [
        auth
    ],
    PublicationController.get);

router.get('/', [
        auth
    ],
    PublicationController.list);

router.delete('/:id', [
        auth
    ],
    PublicationController.remove);

router.get('/my', [
        auth
    ],
    PublicationController.myList);

router.get('/other/:id', [
        auth
    ],
    PublicationController.otherList);

router.post('/upload/:id', [
        auth,
        uploads.single("file0")
    ],
    PublicationController.imageUpload);

router.get('/file/:file', PublicationController.getImage);

router.get('/feed/list', [
        auth
    ],
    PublicationController.feedList);

module.exports = router;
