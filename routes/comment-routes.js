// Importamos ->
const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment-controller");
const check = require("../middlewares/auth-middleware");
// <- Importamos

// Rutas de prueba
router.get("/test_comment", CommentController.test_commentController);

// Definimos las rutas de comment
router.post("/make_comment/:id", check.authToken, CommentController.makeComment);
router.delete("/delete_comment/:id", check.authToken, CommentController.deleteComment);
router.put("/like_comment/:id", check.authToken, CommentController.likeComment);


// Exportamos el router
module.exports = router;