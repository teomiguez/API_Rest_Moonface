// -> Importaciones
const Follow = require("../models/Follow");
const User = require("../models/User");

const mongoosePagination = require("mongoose-pagination");

const followHelper = require("../helpers/follow-user-ids");
// <- Importaciones

// Acciones de prueba
const test_followController = (req, res) => {
    return res.status(200).send({
        message: "mensaje del controlador de seguidores"
    });
}

// Acciones de follow:
// - Guardar un follow (seguir a un usuario)
const followUser = (req, res) => {
    const idUserIdentity = req.user.id;
    const idUserToFollow = req.body.follow;

    let userToFollow = new Follow({
        user_id_follow: idUserIdentity,
        user_id_followed: idUserToFollow
    });

    try
    {
        userToFollow.save();
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error al seguir al usuario"
        });
    }
    
    return res.status(200).send({
        status: "succes",
        message: "siguiendo...",
        idUserIdentity,
        idUserToFollow,
        userToFollow
    });
}

// - Borrar un follow (dejar de seguir a un usuario)
const unfollowUser = async (req, res) => {
    const idUserIdentity = req.user.id;
    const idUserToUnfollow = req.params.id;

    try
    {
        let isUnfollow = await Follow.findOneAndDelete({ user_id_follow: idUserIdentity, user_id_followed: idUserToUnfollow});

        if (!isUnfollow)
        {
            throw new Error_noExist("error al dejar de seguir");    
        }

        return res.status(200).send({
            status: "succes",
            message: "no siguiendo..."
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "error al dejar de seguir al usuario"
        });
    }
}

// - Listar mis follows o los de X usuario - como usuarios identificado
const viewFollowing = async (req, res) => {
    const idUserIdentity = req.user.id;
    
    let idUser = req.user.id;
    let page = 1;
    const itemsPerPage = 5;

    if (req.params.id) idUser = req.params.id;
    if (req.params.page) page = req.params.page;
    
    try
    {
        let usersList = await Follow.find({ user_id_follow: idUser })
                                    .populate("user_id_follow user_id_followed", "-password -role -__v -email")
                                    .paginate(page, itemsPerPage);
        
        let totalUsersFollowing = (await (Follow.find({ user_id_follow: idUser }))).length;
        let totalPages = Math.ceil(totalUsersFollowing / itemsPerPage);

        // LISTADO DE USUARIOS QUE SIGO/ME SIGUEN COMO USUARIO IDENTIFICADO (SI LA BUSQUEDA INICIAL ES DE UN USUARIO QUE NO ESTA IDENTIFICADO)
        let followUsersIds = false;
        if (req.params.id) followUsersIds = await followHelper.followUserIds(req.user.id);

        return res.status(200).send({
            status: "succes",
            message: "lista seguidos...",
            page: page,
            total_pages: totalPages,
            items_per_page: itemsPerPage,
            total_users: totalUsersFollowing,
            usersList,
            user_following: followUsersIds.following,
            users_follow_me: followUsersIds.follower
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "no sigue a nadie"
        });
    }
}

// - Listar usuarios que me siguen o siguen a X usuario- como usuarios identificado
const viewFollower = async (req, res) => {
    const idUserIdentity = req.user.id;
    
    let idUser = req.user.id;
    let page = 1;
    const itemsPerPage = 5;

    if (req.params.id) idUser = req.params.id;
    if (req.params.page) page = req.params.page;

    try
    {
        let usersList = await Follow.find({ user_id_followed: idUser })
                                    .populate("user_id_follow user_id_followed", "-password -role -__v -email")
                                    .paginate(page, itemsPerPage);
        
        let totalUsersFollowing = (await (Follow.find({ user_id_followed: idUser }))).length;
        let totalPages = Math.ceil(totalUsersFollowing / itemsPerPage);

        // LISTADO DE USUARIOS QUE SIGO/ME SIGUEN COMO USUARIO IDENTIFICADO (SI LA BUSQUEDA INICIAL ES DE UN USUARIO QUE NO ESTA IDENTIFICADO)
        let followUsersIds = false;
        if (req.params.id) followUsersIds = await followHelper.followUserIds(idUserIdentity);

        return res.status(200).send({
            status: "succes",
            message: "lista seguidores...",
            page: page,
            total_pages: totalPages,
            items_per_page: itemsPerPage,
            total_users: totalUsersFollowing,
            usersList,
            user_following: followUsersIds.following,
            users_follow_me: followUsersIds.follower
        });
    }
    catch (error)
    {
        return res.status(500).send({
            status: "error",
            message: "no sigue a nadie"
        });
    }
}

// Exportamos las acciones
module.exports = {
    test_followController,
    followUser,
    unfollowUser,
    viewFollowing,
    viewFollower
}