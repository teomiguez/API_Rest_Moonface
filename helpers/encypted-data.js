// -> Importaciones
const bcrypt = require("bcrypt");
// <- Importaciones

// -> Funciones

function encyptedPassword(password, slatRounds) {
    let pwd = bcrypt.hash(password, slatRounds);
    return pwd;
}

function comparePasswords(password, encyptedPassword) {
    let pwd = bcrypt.compareSync(password, encyptedPassword);
    return pwd;
}

// <- Funciones

// -> Exportaciones
module.exports = {
    encyptedPassword,
    comparePasswords
}
// <- Exportaciones