// Importamos ->
const express = require("express");
const router = express.Router();
const multer = require("multer");
const check = require("../middlewares/auth-middleware");
const PublicationController = require("../controllers/publication-controller");
// <- Importamos

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/uploads/publications/");
    },
    filename: (req, file, cb) => {
        cb(null, "pub-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

// Rutas de prueba
router.get("/test_publication", PublicationController.test_publicationController);

// Definimos las rutas de publication
router.post("/save_publication", check.authToken, PublicationController.savePublication);
router.get("/get_detail_publication/:id", check.authToken, PublicationController.getDetailPublication);
router.delete("/remove_publication/:id", check.authToken, PublicationController.removePublication);
router.get("/view_publications/:id?/:page?", check.authToken, PublicationController.viewPublications);
router.post("/upload_file/:id", [check.authToken, uploads.single("file1")], PublicationController.uploadFile);
router.get("/view_file/:file", PublicationController.viewFile);
router.get("/view_feed/:page?", check.authToken, PublicationController.viewFeed);

// Exportamos el router
module.exports = router;