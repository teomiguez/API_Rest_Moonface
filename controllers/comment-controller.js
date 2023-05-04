// -> Importaciones
const Comment = require("../models/Comment");
const Publication = require("../models/Publication");
const User = require("../models/User");

const mongoosePagination = require("mongoose-pagination");

const followHelper = require("../helpers/follow-user-ids");
// <- Importaciones

// Accion de prueba
const test_commentController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de comment"
    });
}

// Acciones de commen:
// - Hacer un comentario
const makeComment = async (req, res) => {
    if ((!req.params.id) || (!req.body.text))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const identityUserId = req.user.id;
    const text = req.body.text;
    const publicationId = req.params.id;

    try
    {
        let publicationExist = await Publication.findById(publicationId);

        if (!publicationExist)
        {
            return res.status(404).send({
                status: "error",
                message: "La publicación no existe..."
            });
        }

        let newComment = Comment({
            publication_id: publicationId,
            user_id_comment: identityUserId,
            text: text
        });

        newComment.save();

        return res.status(200).send({
            status: "succes",
            message: "Comentario creado correctamente",
            newComment
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

// - Borrar un comentario
const deleteComment = async (req, res) => {
    if ((!req.params.id))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const identityUserId = req.user.id;
    const commentId = req.params.id;

    try
    {
        let comment = await Comment.findById(commentId);

        if (!comment)
        {
            return res.status(404).send({
                status: "error",
                message: "El comentario no existe..."
            });
        }

        if (comment.user_id_comment == identityUserId)
        {
            let comment = await Comment.findByIdAndDelete(commentId);
        }

        return res.status(200).send({
            status: "succes",
            message: "Comentario borrado correctamente",
            comment
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

// - Darle like a un comentario
const likeComment = async (req, res) => {
    if ((!req.params.id))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta..."
        });
    }

    const commentId = req.params.id;

    try
    {
        let commentToUpdate = await Comment.findById(commentId);

        if (!commentToUpdate)
        {
            return res.status(404).send({
                status: "error",
                message: "El comentario no existe..."
            });
        }

        commentToUpdate.like++;
        let commentUpdate = await Comment.findByIdAndUpdate(commentId, commentToUpdate, { new: true });

        return res.status(200).send({
            status: "succes",
            message: "Comentario borrado correctamente",
            commentUpdate
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
    test_commentController,
    makeComment,
    deleteComment,
    likeComment
}