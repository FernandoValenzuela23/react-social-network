const { dbConnection } = require("./db/db-connection");
const express = require("express");
const cors = require("cors");


// Conectar a la base de datos
dbConnection();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); // form-urlencoded

// RUTAS
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

// Cargo las rutas
app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);


// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Social Network Server running at " + puerto);
});