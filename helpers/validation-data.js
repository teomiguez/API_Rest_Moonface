const validator = require("validator");

const validateUser = (params) => {
    let validate = false;
    let bio = true;

    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES", {ignore: '\s'});
    
    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.surname, "es-ES", {ignore: '\s'});
    
    let nickname = !validator.isEmpty(params.nickname) && 
        validator.isLength(params.nickname, { min: 3, max: 15 }) &&
        (validator.isAlphanumeric(params.nickname) || validator.isAlpha(params.surname));
    
    let email = !validator.isEmpty(params.email) && 
        validator.isLength(params.email, { min: 3, max: undefined }) &&
        validator.isEmail(params.email);
    
    let password = !validator.isEmpty(params.password);

    if (params.bio)
    {
        bio = validator.isLength(params.bio, { min: undefined, max: 200 });
    }

    if ((name) && (surname) && (nickname) && (email) && (password) && (bio))
    {
        validate = true;
    }

    return validate;    
}

const validatePublication = (params) => {
    let validate = false;

    let text = !validator.isEmpty(params.text) &&
        validator.isLength(params.text, { min: 1, max: 300 });
    
    if (text)
    {
        validate = true;
    }
    
    return validate; 
}

module.exports = {
    validateUser,
    validatePublication
}