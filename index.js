// Importamos dependencias ->
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
// <- Importamos dependencias

// Iniciamos la App
console.log("Arranca moonface🌙");

// Conectamos a la base de datos
connection();

// Creamos el servidor node
const app = express();
const port = 3900;

// Configuramos el cors
app.use(cors());

// Convertimos los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importamos los archivos de rutas ->
const UserRoutes = require("./routes/user-routes");
const PublicationRoutes = require("./routes/publication-routes");
const FollowRoutes = require("./routes/follow-routes");
const ChatRoutes = require("./routes/chat-routes");
const NotificationRoutes = require("./routes/notification-routes");
const CommentRoutes = require("./routes/comment-routes");
const MessageRoutes = require("./routes/message-routes");
// <- Importamos los archivos de rutas

// -> Agregamos un prefijo para las rutas
app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/comment", CommentRoutes);
// <- Agregamos un prefijo para las rutas

// Cargamos las rutas de testing

// Ruta de prueba
app.get("/route-test", (req, res) => {
    return res.status(200).json(
        {
            "name": "route-test"
        }
    )
})

// Cargar conf rutas


// Poner el servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto: " + port)
})
