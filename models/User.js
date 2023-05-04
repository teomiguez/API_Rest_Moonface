// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        default: ""
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user" // user o admin
    },
    profile_image: {
        type: String,
        default: "moon.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("User", UserSchema); // el tercer parametro sería "users"