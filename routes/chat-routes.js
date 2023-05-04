// Importamos ->
const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat-controller");
const check = require("../middlewares/auth-middleware");
// <- Importamos

// Rutas de prueba
router.get("/test_chat", ChatController.test_chatController);

// Definimos las rutas de chat
router.post("/create_chat/:id", check.authToken, ChatController.createChat);
router.delete("/delete_chat/:id", check.authToken, ChatController.deleteChat);


// Exportamos el router
module.exports = router;