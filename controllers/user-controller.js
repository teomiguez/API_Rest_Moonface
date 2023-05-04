// Importaciones ->
const User = require("../models/User");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");

const mongoosePagination = require("mongoose-pagination");

const jwt = require("../helpers/jwt");
const followHelper = require("../helpers/follow-user-ids");
const validationData = require("../helpers/validation-data");
const checkData = require("../helpers/check-data");

const fs = require("fs");
const path = require("path");

const { encyptedPassword } = require("../helpers/encypted-data");
const { comparePasswords } = require("../helpers/encypted-data");
// <- Importaciones

// Acciones de prueba
const test_userController = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "mensaje del controlador de usuarios",
        user: req.user
    });
}

// Acciones del usuario:
// - Registro
const registerUser = async (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar los datos 
    if (!checkData.checkUserRegisterParams(params)) 
    {
        return res.status(500).send({
            status: "error",
            message: "petición incompleta..."
        });
    }
    
    // Validaciones
    if (!validationData.validateUser(params))
    {
        return res.status(404).send({
            status: "error",
            message: "error en la validación..."
        });
    }

    // Control de usuarios duplicados
    const userExist = await User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nickname: params.nickname.toLowerCase() }
        ]
    });
    
    if ((userExist) && (userExist.length >= 1))
    {
        return res.status(200).send({
            status: "success",
            message: "el usuario existe"
        });
    }
    
    // Ciframos la contraseña
    let pwd = await encyptedPassword(params.password, 10);
    params.password = pwd;
    
    // Crear objeto de usuario
    let newUser = new User(params);

    // Guardamos usuario en la bdd
    newUser.save();

    // Devolvemos un msj
    return res.status(200).send({
        status: "success",
        message: "usuario registrado",
        newUser
    });
}

// - Login
const loginUser = async (req, res) => {
    // Recoger datos del body
    let params = req.body;

    if (!checkData.checkUserLoginParams(params))
    {
        return res.status(404).send({
            status: "error",
            message: "Petición invalida"
        });
    }

    // Buscar en la bdd el usuario
    try
    {
        let user = await User.findOne({ email: params.email });
    
        if (!user)
        {
            throw new Error("Usuario invalido");
        }

        // Si existe el usuario -> comparamos la contraseña
        let pwd = await comparePasswords(params.password, user.password);

        if (!pwd)
        {
            throw new Error("La constraseña no es valida");    
        }
        
        // Devolvemos token
        const token = jwt.createToken(user);
    
        // Devolvemos los datos del usuario
    
        return res.status(200).send({
            status: "success",
            message: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email
            },
            token
        });
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: error.message
        });
    }

}

// - Obtener los datos de un usuario
const getUSer = async (req, res) => {
    // Recoger datos de la peticion
    let id = req.params.id;

    if (!id)
    {
        return res.status(404).send({
            status: "error",
            message: "Petición incompleta"
        });    
    }

    try
    {
        let user = await User.findById(id).select({ password: 0, role: 0 });
        
        const followInfo = await followHelper.followThisUser(req.user.id, id);

        return res.status(200).send({
            status: "success",
            user,
            following: followInfo.following,
            follower: followInfo.follower
        });
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "Error en la busqueda"
        });
    }

}

// - Listar usuarios
const listUsers = async (req, res) => {
    // Consultar la página
    let page = 1;
    
    if (req.params.page)
    {
        page = req.params.page;
    }

    page = parseInt(page);
    let itemsPerPag = 5;

    try {
        const users = await User.find({})
            .select("-password -email -__v -role")
            .sort('_id')
            .paginate(page, itemsPerPag);

        let total_users = (await User.find({})).length;
        let total_pages = Math.ceil(total_users / itemsPerPag);

        let followUsersIds = await followHelper.followUserIds(req.user.id);
        
        return res.status(200).send({
            status: "success",
            page: page,
            total_pages: total_pages,
            items_per_page: itemsPerPag,
            total_users: total_users,
            users: users,
            user_following: followUsersIds.following,
            users_follow_me: followUsersIds.follower
        });
    }
    catch (error)
    {
        return res.status(404).send({
            status: "error",
            message: "No se encontraron usuarios"
        });
    }
}

// - Modificar/Actualizar el perfil
const updateUser = async (req, res) => {
    // Recojemos los datos del usuario
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminamos campos innecesarios del userIdentity
    delete userIdentity.iat;
    delete userIdentity.exp;
    delete userIdentity.role;
    
    // Eliminamos campos innecesarios del userToUpdate (en caso que los envie)
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;

    // Comprobar si existe el usuario
    let users = await User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nickname: userToUpdate.nickname.toLowerCase() }
        ]
    });

    let userIsset = false;

    users.forEach(user => {
        if ((user) && (user._id != userIdentity.id))
        {
            userIsset = true;
        }
    });
    
    if (userIsset)
    {
        return res.status(404).send({
            status: "error",
            message: "ese nickname/email de usuario ya existe"
        });
    }
    
    // Ciframos la contraseña (si le envia)
    if (userToUpdate.password)
    {
        let pwd = await encyptedPassword(userToUpdate.password, 10);
        userToUpdate.password = pwd;
    }
    else
    {
        delete userToUpdate.password; // así no pisamos la contraseña en vació
    }

    // Buscamos y actualizamos el usuario
    try
    {        
        let userUpdate = await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, { new: true });

        if (!userUpdate)
        {
            return res.status(400).send({
                status: "error",
                message: "Error al cargar el usuario"
            });
        }

        // Devolvemos una respuesta
        return res.status(200).send({
            status: "succes",
            message: "Actualizar usuario",
            user: userUpdate
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "Error al cargar el usuario"
        });
    }

}

// - Subir la imagen del perfil

const uploadAvatar = async (req, res) => {
    // Recojer el fichero de imagen y comprobar si existe
    if (!req.file)
    {
        return res.status(404).send({
            status: "error",
            message: "no llego la imagen"
        });
    }
    // Recojemos el id del usuario
    const userId = req.user.id;

    // Conseguir el nombre y extension del archivo
    let image = req.file.originalname;

    const imageSplit = image.split('\.');
    const path = imageSplit[1];

    // Comprobar la extension
    if ((path != "png") && (path != "jpg") && (path != "jpeg") && (path != "gif"))
    {
        // Borramos el archivo
        const filePath = req.file.path;
        const fileDeletef = fs.unlinkSync(filePath);

        // Enviamos una respuesta
        return res.status(400).send({
            status: "error",
            message: "la extension no es valida"
        });
    }

    // Si es correcta guardar en bdd
    try
    {
        const userUpdate = await User.findOneAndUpdate({_id: userId}, {profile_image: req.file.filename}, {new: true});
        
        if (!userUpdate)
        {
            throw new Error("Error al guardar la imagen");    
        }

        // Devolver una respuesta
        return res.status(200).send({
            status: "success",
            message: "subiendo una imagen...",
            file: image,
            user: userUpdate
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

// - Ver la foto de perfil
const viewAvatar = (req, res) => {
    // Sacar el parametro de la url
    let file;

    if (req.params.file)
    {
        file = req.params.file;
    }
    else
    {
        file = req.user.profile_image;
    }
    
    // Creamos el path
    let filePath;
    
    if (file != "moon.png")
    {
        filePath = "./images/uploads/avatars/" + file;
    }
    else
    {
        filePath = "./images/" + file;
    }

    // Comprobamos si existe
    fs.stat(filePath, (error, exist) => {
            // SI NO existe -> devolvemos una respuesta
            if (!exist)
            {
                return res.status(404).send({
                    status: "error",
                    message: "la imagen no existe",
                });
            }
            
            // SI existe -> devolvemos un file
            return res.sendFile(path.resolve(filePath));
        });
}

// - Contar
const counters = async (req, res) => {
    let userId = req.user.id;

    if (req.params.id) userId = req.params.id;

    try
    {   
        let countFollowings = (await Follow.find({ user_id_follow: userId })).length;
        let countFollowers = (await Follow.find({ user_id_followed: userId })).length;
        let countPublications = (await Publication.find({ user_id: userId })).length;

        return res.status(200).send({
            status: "success",
            message: "contando...",
            followings: countFollowings,
            followers: countFollowers,
            publications: countPublications
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error en los contadores...",
            error
        });
    }
}

// Exportamos las acciones
module.exports = {
    test_userController,
    registerUser,
    loginUser,
    getUSer,
    listUsers,
    updateUser,
    uploadAvatar,
    viewAvatar,
    counters
}