// -> Importaciones
const jwt = require("jwt-simple");
const moment = require("moment");

const libJwt = require("../helpers/jwt"); // para acceder a la clave secreta
const secret = libJwt.secret;
// <- Importaciones

// Middleware de autenticación
exports.authToken = (req, res, next) => {
    // Comprobar si llega la cabecera de auth
    if (!req.headers.authorization)
    {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });    
    }

    // Limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, ''); // Si el token llega con "" o '' que no sean parte del token original, las sacamos
    
    // Decodificar el token
    try
    {
        let payLoad = jwt.decode(token, secret);

        // Comprobar expiración
        if (payLoad.exp <= moment().unix())
        {
            return res.status(401).sen({
                status: "error",
                message: "Token expirado"
            });    
        }
        
        // Agregar datos de usuario a request
        req.user = payLoad;
    }
    catch (error)
    {
        return res.status(404).sen({
            status: "error",
            message: "Token invalido"
        }); 
    }
    
    // Pasar a ejecución de acción
    next();
}