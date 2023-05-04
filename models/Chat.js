// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const ChatSchema = Schema({
    user_id_create: {
        type: Schema.ObjectId,
        ref: "User"
    },
    user_id_guest: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Chat", ChatSchema); // el tercer parametro sería "chats"