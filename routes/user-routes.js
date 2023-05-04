// Importamos ->
const express = require("express");
const router = express.Router();
const multer = require("multer");
const check = require("../middlewares/auth-middleware");
const UserController = require("../controllers/user-controller");
// <- Importamos

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/uploads/avatars/");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Ruta de prueba del usuario
router.get("/test_user", check.authToken, UserController.test_userController);

// Definimos las rutas
router.get("/counters/:id?", check.authToken, UserController.counters);
router.post("/register_user", UserController.registerUser);
router.post("/login_user", UserController.loginUser);
router.get("/get_user/:id", check.authToken, UserController.getUSer);
router.get("/list_users/:page?", check.authToken, UserController.listUsers);
router.put("/update_user", check.authToken, UserController.updateUser);
router.post("/upload_avatar", [check.authToken, uploads.single("file0")], UserController.uploadAvatar);
router.get("/view_avatar/:file?", UserController.viewAvatar); // porque parametro? -> Por si queremos ver el avatar de otro usuario

// Exportamos el router
module.exports = router;