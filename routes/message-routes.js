// Importamos ->
const express = require("express");
const router = express.Router();
const multer = require("multer");
const MessageController = require("../controllers/message-controller");
const check = require("../middlewares/auth-middleware");
// <- Importamos

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/uploads/messages/");
    },
    filename: (req, file, cb) => {
        cb(null, "mess-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Rutas de prueba
router.get("/test_message", MessageController.test_messageController);

// Definimos las rutas de message
router.post("/send_message/:id", check.authToken, MessageController.sendMessage);
router.get("view_messages_in_chat/:id", check.authToken, MessageController.viewMessagesInChat);
router.delete("/delete_message/:id", check.authToken, MessageController.deleteMessage);
router.post("/upload_file/:id", [[check.authToken, uploads.single("file1")]], MessageController.uploadFile);
router.get("/view_file/:file", check.authToken, MessageController.viewFile);

// VER LO DE SUBIR ARCHIVOS...


// Exportamos el router
module.exports = router;