const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");
const bcrypt = require('bcrypt');
const { generateJWT } = require('../helpers/jwt');
const fs = require("fs");
const path = require("path");
var mongoose = require('mongoose');

const create = async (req, res) => {
    let params = req.body;

    if (!params.name || !params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos requeridos no recibidos',
            params
        })
    }

    const newUser = new User(params);

    const exists = await User.findOne({ email: newUser.email.toLowerCase() });
    if (exists) {
        return res.status(400).json({
            status: 'error',
            message: 'El email ya esta registrado',
            params
        })
    }

    // Hashing password
    const pwd = await bcrypt.hash(newUser.password, 10);
    newUser.password = pwd;

    await newUser.save();
    return res.status(200).json({
        status: 'success',
        message: 'Creado exitosamente',
        params
    })
}

const list = async (req, res = response) => {

    const { page = 1, pagesize = 5 } = req.query;

    const myFollowing = await Follow.find({follower: req.user.id})
                        .select({'_id': 0, 'follower': 0, 'create_at': 0, '__v': 0});

    const [total, data] = await Promise.all([
        User.countDocuments({_id: {$ne: req.user.id}}),
        User.find({_id: {$ne: req.user.id}}).skip((page - 1) * pagesize).limit(pagesize)
    ]);

    const usersWithFollow = data.map(({_id, name, email, role, image}) => {
        const following = myFollowing.some(p => p.followed.equals(_id));
        return {_id, name, email, role, image, following}
    })

    res.status(200).json(
        {
            status: "success",
            total,
            data: usersWithFollow
        });
};

const get = async (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    const exists = await User.findById(id);

    if (!exists) {

        return res.status(404).json({
            status: "error",
            message: "No encontrado"
        });

    }

    // Devolver resultado
    return res.status(200).json({
        status: "success",
        exists
    });
}

const remove = async (req, res) => {

    let id = req.params.id;

    const deleted = await User.findOneAndDelete({ _id: id });

    if (!deleted) {

            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el usuario"
            });

    };

    return res.status(200).json({
        status: "success",
        deleted,
        message: 'Eliminado exitosamente'
    });

}

const update = async (req, res = response) => {
    try {
        const id = req.params.id;

        const { _id, password, ...resto } = req.body;

        if (_id && id !== _id) {
            res.status(400).json({
                message: 'Envio un valor en campo id en el body, el mismo no corresponde al id parametrizado. Puede no enviarlo o si lo envia debe coincidir'
            });
            return;
        }

        if (password) {
            // Hashing password
            const pwd = await bcrypt.hash(password, 10);
            resto.password = pwd;            
        }

        // Buscar y actualizar al mismo tiempo
        await User.findByIdAndUpdate(id, resto);

        const updatedUser = await User.findById(id);

        // re generate token with new data            
        const token = generateJWT(updatedUser);

        res.json({
            status: "success",
            user: updatedUser,
            token
        });
    } catch (error) {
        throw error;
    }
}

const login = async (req, res) => {
    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos requeridos no recibidos',
            params
        })
    }

    const exists = await User.findOne({ email: params.email });
    if (!exists) {
        return res.status(404).json({
            status: "error",
            message: "Email no existe"
        });
    }

    const isPasswordValid = await bcrypt.compare(params.password, exists.password);

    if (!isPasswordValid) {
        return res.status(404).json({
            status: "error",
            message: "Password incorrecto"
        });
    }

    const token = generateJWT(exists);

    // Devolver resultado
    return res.status(200).json({
        status: "success",
        user: exists,
        token: token
    });
}


const imageUpload = async (req, res) => {
    const user = req.user;

    // Configurar multer

    // Recoger el fichero de image subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Petición invalida"
        });
    }

    // Nombre del file
    let file = req.file.originalname;

    // Extension del file
    let file_split = file.split("\.");
    let extension = file_split[1];

    // Comprobar extension correcta
    if (extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif") {

        // Borrar file y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        })
    } else {

        // Buscar y actualizar articulo
        const updated = await User.findOneAndUpdate({ _id: user.id }, { image: req.file.filename });
        
        if (!updated) {

            if (error || !userUpdated) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al actualizar"
                });
            }
        }

         const updatedUser = await User.findById(user.id);

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            user: updatedUser,
            file: req.file
        })

    }

}

const getImage = (req, res) => {
    let fileName = req.params.file;
    let pathFile = "./images/user/" + fileName;

    fs.stat(pathFile, (error, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                exists,
                fileName,
                path
            });
        }
    })
}

const search = async(req, res) => {
    // Sacar el string de text
    let text = req.params.text;

    // Find OR 
    const founded = await User.find({ "$or": [
        { "name": { "$regex": text, "$options": "i"}},
        { "email": { "$regex": text, "$options": "i"}},
    ]});
    //.sort({fecha: -1})
    
    if(!founded || founded.length <= 0) {

            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado usuarios que coincidan"
            });
    }

    return res.status(200).json({
        status: "success",
        users: founded
    })
}

const counters = async (req, res) => {
    // Recoger un id por la url
    let id = req.user.id;

    const following = await Follow.count({follower: id});
    const followers = await Follow.count({followed: id});
    const publications = await Publication.count({publisher: id});

    // Devolver resultado
    return res.status(200).json({
        status: "success",
        followers,
        following,
        publications
    });
}


module.exports = {
    get,
    create,
    list,
    update,
    remove,
    login,
    imageUpload,
    getImage,
    search,
    counters
}