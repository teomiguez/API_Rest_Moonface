// -> Importamos
const { Schema, model } = require("mongoose");
// <- Importamos

const NotificationSchema = Schema({
    user_id_receive: {
        type: Schema.ObjectId,
        ref: "User"
    },
    user_id_send: {
        type: Schema.ObjectId,
        ref: "User"
    },
    reason: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el esquema
module.exports = model("Notification", NotificationSchema); // el tercer parametro sería "notifications"