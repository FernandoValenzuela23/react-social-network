const express = require("express");
const multer = require("multer");
const router = express.Router();
const UserController = require("../controllers/user");
const { auth } = require("../middlewares/auth");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images/user/');
    },

    filename: function(req, file, cb){
        cb(null, "avatar-" + Date.now() + file.originalname);
    }
})

// middleware
const uploads = multer({storage});

router.get('/:id', [
        auth
    ],
    UserController.get);

router.get('/', [
        auth
    ],
    UserController.list);

router.post('/create', UserController.create);

router.put('/:id', [
        auth
    ],
    UserController.update);

router.delete('/:id', [
        auth
    ],
    UserController.remove);

router.post('/upload', [
        auth,
        uploads.single("file0")
    ],
    UserController.imageUpload);

router.get('/avatar/:file', UserController.getImage);

router.get('/search/:text', [
        auth
    ],
    UserController.search);

    // Se tuvo que poner rutas mas largas para diferenciar
    // porque el router se confunde y envia por otras
router.get('/counters/get/values', [
        auth
    ],
    UserController.counters);

router.post('/login', UserController.login);

module.exports = router;