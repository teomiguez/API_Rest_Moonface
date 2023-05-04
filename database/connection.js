const mongoose = require("mongoose");

const connection = async () => {
    
    try
    {
        await mongoose.connect("mongodb://localhost:27017/moonface_db");
        console.log("Conexion a bdd exitosa🚀");
    }
    catch (error)
    {
        console.log(error);
        throw new Error("No se ha podido establecer una conexsión a la base de datos⛔");
    }

}

module.exports = connection