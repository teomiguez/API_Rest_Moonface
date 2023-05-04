// Importamos ->
const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow-controller");
const check = require("../middlewares/auth-middleware");
// <- Importamos

// Rutas de prueba
router.get("/test_follow", FollowController.test_followController);

// Definimos las rutas de follow
router.post("/follow_user", check.authToken, FollowController.followUser);
router.delete("/unfollow_user/:id", check.authToken, FollowController.unfollowUser);
router.get("/view_following/:id?/:page?", check.authToken, FollowController.viewFollowing);
router.get("/view_followed/:id?/:page?", check.authToken, FollowController.viewFollower);

// Exportamos el router
module.exports = router;