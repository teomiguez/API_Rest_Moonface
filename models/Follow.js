// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const FollowSchema = Schema({
    user_id_follow: {
        type: Schema.ObjectId,
        ref: "User"
    },
    user_id_followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Follow", FollowSchema); // el tercer parametro sería "follows"