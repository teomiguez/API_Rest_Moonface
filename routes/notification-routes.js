// Importamos ->
const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification-controller");
const check = require("../middlewares/auth-middleware");
// <- Importamos

// Rutas de prueba
router.get("/test_notification", NotificationController.test_notificationController);

// Definimos las rutas de notification
router.post("/create_notification/:id", check.authToken, NotificationController.createNotification);
router.get("/view_notifications", check.authToken, NotificationController.viewNotifications);

// Exportamos el router
module.exports = router;