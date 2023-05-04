// -> Importaciones
const Publication = require("../models/Publication");
const User = require("../models/User");

const mongoosePagination = require("mongoose-pagination");

const fs = require("fs");
const path = require("path");

const followHelper = require("../helpers/follow-user-ids");
const validationData = require("../helpers/validation-data");
const checkData = require("../helpers/check-data");
// <- Importaciones

// Acciones de prueba
const test_publicationController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de publicaciones"
    });
}

// Acciones de publication:
// - Guardar una publicación
const savePublication = (req, res) => {
    const params = req.body;
    const identityUserId = req.user.id;

    if (!checkData.checkPublicationParams(params))
    {
        return res.status(400).send({
            status: "error",
            message: "petición incompleta..."
        });
    }

    if (!validationData.validatePublication(params))
    {
        return res.status(404).send({
            status: "error",
            message: "error de validación"
        });
    }

    let newPublication = Publication({
        user_id: identityUserId,
        text: params.text
    });

    try
    {
        newPublication.save();
        
        return res.status(200).send({
            status: "succes",
            message: "subiendo publicación...",
            publication: newPublication
        });
    }
    catch (error)
    {
        return res.status(400).send({
            status: "error",
            message: "error al subir la publicación..."
        });
    }
}

// - Ver una publicación
const getDetailPublication = async (req, res) => {
    const publicationId = req.params.id;

    try
    {
        let publication = await Publication.findById({ _id: publicationId });

        return res.status(200).send({
            status: "succes",
            message: "viendo publicación...",
            publication: publication
        });
    }
    catch (error)
    {
        return res.status(400).send({
            status: "error",
            message: "La publicación no existe..."
        });
    }
}

// - Eliminar una publicación
const removePublication = async (req, res) => {
    const identityUserId = req.user.id;
    const publicationId = req.params.id;

    try
    {
        // Acá nos aseguramos que borramos una publicación del usuario identificado, que no ande censurando a otros 
        let publicationDelete = await Publication.findOneAndRemove({ user_id: identityUserId, _id: publicationId });

        return res.status(200).send({
            status: "succes",
            message: "borrando publicación...",
            publication_delete: publicationDelete
        });
    }
    catch (error)
    {
        return res.status(400).send({
            status: "error",
            message: "La publicación no existe..."
        });
    }
}

// - Listar todas las publicaciones de un usuario
const viewPublications = async (req, res) => {
    let user_id = req.user.id;
    let page = 1;

    if (req.params.id) user_id = req.params.id;
    if (req.params.page) page = req.params.page;

    if (req.params.id)
    {
        try
        {
            const isExistUser = await User.findById(user_id);
        }
        catch (error)
        {
            return res.status(400).send({
                status: "error",
                message: "el usuario no existe..."
            });
        }
    }

    page = parseInt(page);
    let itemsPerPag = 5;

    try {
        
        const publications = await Publication.find({ user_id: user_id })
            .sort("-created_at")
            .populate("user_id", "-password -__v -role -email")
            .paginate(page, itemsPerPag);

        let total_publications = (await Publication.find({ user_id: user_id })).length;
        let total_pages = Math.ceil(total_publications / itemsPerPag);

        if (publications.length <= 0)
        {
            return res.status(404).send({
                status: "error",
                message: "el usuario no tiene publicaciones..."
            });
        }

        return res.status(200).send({
            status: "succes",
            message: "publicaciones...",
            user_id: user_id,
            page: page,
            total_pages: total_pages,
            items_per_page: itemsPerPag,
            total_publications: total_publications,
            publications: publications
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "error",
            message: "error al cargar las publicaciones..."
        });
    }
}

// - Subir ficheros (imagenes)
const uploadFile = async (req, res) => {
    const publicationId = req.params.id;
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
        const fileDeletef = fs.unlinkSync(filePath);

        return res.status(400).send({
            status: "error",
            message: "la extension no es valida"
        });
    }

    try
    {
        const publicationUpdate = await Publication.findOneAndUpdate({user_id: userId, _id: publicationId}, {file: req.file.filename}, {new: true});
        
        if (!publicationUpdate)
        {
            throw new Error("Error al guardar la imagen");    
        }

        return res.status(200).send({
            status: "success",
            message: "subiendo una imagen...",
            file: image,
            publication: publicationUpdate
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
    const filePath = "./images/uploads/publications/" + file;

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

// - Listar todas las publicaciones (de los usuarios seguidos - tipo Home)
const viewFeed = async (req, res) => {
    const identityUserId = req.user.id;
    let page = 1;

    if (req.params.page) page = req.params.page;

    page = parseInt(page);
    let itemsPerPag = 5;

    try
    {
        let following = await followHelper.followUserIds(identityUserId);
        following = following.following;

        if (!following)
        {
            return res.status(404).send({
                status: "error",
                message: "no seguis a nadie..."
            });
        }

        const publications = await Publication.find({ user_id: { $in: following } })
            .populate("user_id", "-password -__v -role -email")
            .sort("-created_at")
            .paginate(page, itemsPerPag);

        if (publications.length <= 0)
        {
            return res.status(404).send({
                status: "error",
                message: "tus seguidos no publicaron nada..." 
            });
        }

        let total_publications = (await Publication.find({ user_id: { $in: following }})).length;
        let total_pages = Math.ceil(total_publications / itemsPerPag);
    
        return res.status(200).send({
            status: "success",
            following: following,
            page: page,
            total_pages: total_pages,
            items_per_page: itemsPerPag,
            total_publications: total_publications,
            publications: publications
        });

    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error al cargar las publicaciones..."
        });
    }
}

// Exportamos las acciones
module.exports = {
    test_publicationController,
    savePublication,
    getDetailPublication,
    removePublication,
    viewPublications,
    uploadFile,
    viewFile,
    viewFeed
}