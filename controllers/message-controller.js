// -> Importaciones
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");

const fs = require("fs");
const path = require("path");

const mongoosePagination = require("mongoose-pagination");

const followHelper = require("../helpers/follow-user-ids");
// <- Importaciones

// Accion de prueba
const test_messageController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de message"
    });
}

// Acciones de message:
// - Enviar un mensaje
const sendMessage = async (req, res) => {
    if ((!req.params.id) || (!req.body.text))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }
    
    const identityUserId = req.user.id;
    const chatId = req.params.id;
    const text = req.body.text;

    try
    {
        let chat = await Chat.findById(chatId);

        if (!chat)
        {
            return res.status(404).send({
                status: "error",
                message: "El chat no existe..."
            });
        }

        let userRecive;

        if (chat.user_id_create == identityUserId)
        {
            userRecive = chat.user_id_guest;
        }
        else
        {
            userRecive = chat.user_id_create;
        }

        let newMessage = Message({
            chat_id: chatId,
            text: text,
            user_id_send: identityUserId,
            user_id_receive: userRecive
        });

        newMessage.save();

        return res.status(200).send({
            status: "succes",
            message: "Mensaje enviado correctamente",
            newMessage
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

// - Ver todos los mensajes de un chat
const viewMessagesInChat = async (req, res) => {
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
        let messages = await Message.find({ chat_id: chatId }).sort("-created_at");

        return res.status(200).send({
            status: "succes",
            message: "Mensajes...",
            messages
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

// - Borrar un mensaje
const deleteMessage = async (req, res) => {
    if (!req.params.id)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }
    
    const identityUserId = req.user.id;
    const messageId = req.params.id;

    try
    {
        let message = await Message.findById(messageId);

        if (!message)
        {
            return res.status(404).send({
                status: "error",
                message: "El mensaje no existe..."
            });
        }

        if (message.user_id_send == identityUserId)
        {
            let message = await Message.findByIdAndDelete(messageId);
        }

        return res.status(200).send({
            status: "succes",
            message_succes: "Mensaje borrado correctamente",
            message
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

// - Subir ficheros (imagenes)
const uploadFile = async (req, res) => {
    if (!req.params.id)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const messageId = req.params.id;
    const userId = req.user.id;

    if (!req.file)
    {
        return res.status(404).send({
            status: "error",
            message: "no llego la imagen..."
        });
    }

    let image = req.file.originalname;

    const imageSplit = image.split('\.');
    const path = imageSplit[1];

    if ((path != "png") && (path != "jpg") && (path != "jpeg") && (path != "gif"))
    {
        const filePath = req.file.path;
        const fileDelete = fs.unlinkSync(filePath);

        return res.status(400).send({
            status: "error",
            message: "la extension no es valida"
        });
    }

    try
    {
        const messageUpdate = await Message.findOneAndUpdate({_id: messageId}, {file: req.file.filename}, {new: true});
        
        if (!messageUpdate)
        {
            throw new Error("Error al guardar la imagen");    
        }

        return res.status(200).send({
            status: "success",
            message: "subiendo una imagen...",
            file: image,
            message: messageUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al guardar la imagen"
        });
    }
}

// - Devolver archivo multimedia (imagenes)
const viewFile = (req, res) => {
    const file = req.params.file;
    const filePath = "./images/uploads/messages/" + file;

    fs.stat(filePath, (error, exist) => {
            if (!exist)
            {
                return res.status(404).send({
                    status: "error",
                    message: "la imagen no existe",
                });
            }
            
            return res.sendFile(path.resolve(filePath));
        });
}

// Exportamos las acciones
module.exports = {
    test_messageController,
    sendMessage,
    viewMessagesInChat,
    deleteMessage,
    uploadFile,
    viewFile
}