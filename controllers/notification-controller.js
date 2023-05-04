// -> Importaciones
const Notification = require("../models/Notification");
const User = require("../models/User");
const Follow = require("../models/Follow");
const Message = require("../models/Message");
const Comment = require("../models/Comment");

const mongoosePagination = require("mongoose-pagination");

const checkData = require("../helpers/check-data");
// <- Importaciones

// Accion de prueba
const test_notificationController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de notification"
    });
}

// Acciones de notification:
// - Crear una notificación
const createNotification = (req, res) => {    
    const params = req.body;

    if ((!req.params.id) || (!checkData.checkNotification(params)))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const userIdRecive = req.params.id;
    const userIdSend = req.user.id;

    let newNewNotification = Notification({
        user_id_receive: userIdRecive,
        user_id_send: userIdSend,
        reason: params.reason
    });  
}

// - Ver mis notificaciones
const viewNotifications = async (req, res) => {
    const indetityUserId = req.user.id;

    try
    {
        let notifications = await Notification.find({ user_id_receive: indetityUserId }).sort("-created_at");

        return res.status(200).send({
            status: "succes",
            message: "Notificaciones...",
            notifications
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Ocurrio un error...",
            error
        });
    }
}

// Exportamos las acciones
module.exports = {
    test_notificationController,
    createNotification,
    viewNotifications
}