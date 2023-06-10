const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const { auth } = require("../middlewares/auth");

router.post('/create', [
        auth
    ],
    FollowController.create);

router.get('/followers', [
        auth
    ],
    FollowController.getFollowers);

router.delete('/remove/:id', [
        auth
    ],
    FollowController.remove);

router.get('/following', [
        auth
    ],
    FollowController.getFollowing);

module.exports = router;