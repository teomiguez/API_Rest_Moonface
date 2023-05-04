// -> Importaciones
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

const mongoosePagination = require("mongoose-pagination");

const checkData = require("../helpers/check-data");
// <- Importaciones

// Accion de prueba
const test_chatController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de chat"
    });
}

// Acciones de chat:
// - Crear un chat
const createChat = (req, res) => {
    if (!req.params.id)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const identityUserId = req.user.id;
    const userId = req.params.id;

    try
    {
        let userExist = User.find({ _id: userId });

        if (!userExist)
        {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe..."
            });
        }

        const newChat = Chat({
            user_id_create: identityUserId,
            user_id_guest: userId
        });

        newChat.save();

        return res.status(200).send({
            status: "succes",
            message: "Chat creado correctamente"
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

// - Borrar un chat
const deleteChat = async (req, res) => {
    if (!req.params.id)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }
    
    const chatId = req.params.id;

    try
    {
        /*let chatExist = await Chat.findById(chatDelete);

        if (!chatExist)
        {
            return res.status(404).send({
                status: "error",
                message: "El chat no existe..."
            });
        }*/
        
        let chatDelete = await Chat.findByIdAndDelete(chatId);

        return res.status(200).send({
            status: "succes",
            message: "Chat borrado correctamente",
            chat: chatDelete
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
    test_chatController,
    createChat,
    deleteChat
}