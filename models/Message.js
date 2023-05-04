// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const MessageSchema = Schema({
    chat_id: {
        type: Schema.ObjectId,
        ref: "Chat"
    },
    text: {
        type: String,
        required: true
    },
    user_id_send: {
        type: Schema.ObjectId,
        ref: "User"
    },
    user_id_receive: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Message", MessageSchema); // el tercer parametro sería "messages"