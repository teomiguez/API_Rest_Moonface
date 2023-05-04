// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const PublicationSchema = Schema({
    user_id: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Publication", PublicationSchema); // el tercer parametro sería "publications"