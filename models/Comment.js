// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const CommentSchema = Schema({
    publication_id: {
        type: Schema.ObjectId,
        ref: "Publication"
    },
    user_id_comment: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Comment", CommentSchema); // el tercer parametro sería "comments"