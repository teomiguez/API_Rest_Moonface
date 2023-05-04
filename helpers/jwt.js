// -> Importaciones
const jwt = require("jwt-simple");
const moment = require("moment");
// <- Importaciones

// Clave secreta
const secret = "K8_#d6zYb9v7@P";

// Funcion para generar un token
const createToken = (user) => {
    const payLoad = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        iat: moment().unix(),
        exp: moment().add(1, "day").unix()
    };

    return jwt.encode(payLoad, secret);
}

// -> Exportaciones
module.exports = {
    secret,
    createToken
}
// <- Exportaciones