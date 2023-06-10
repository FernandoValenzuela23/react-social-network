const mongoose = require("mongoose");

const dbConnection = async() => {

    try {

        await mongoose.connect("mongodb+srv://luna:mercedes123@cluster0.r1j4r74.mongodb.net/social-network");

        // Parametros dentro de objeto // solo en caso de aviso
        // useNewUrlParser: true
        // useUnifiedTopology: true
        // useCreateIndex: true

        console.log("Social-network DB connected !!");

    } catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos !!");
    }

}

module.exports = {
    dbConnection
}