const Publication = require("../models/publication");
const User = require("../models/user");
const Follow = require("../models/follow");
const fs = require("fs");
const path = require("path");

const create = async (req, res) => {
    let params = req.body;

    if (!params.text) {
        return res.status(400).json({
            status: 'error',
            message: 'El texto de la publicacion es requerido',
            params
        })
    }

    const newPublication = new Publication(params);
    newPublication.publisher = req.user.id;

    newPublication.save().then((saved) => {
        if(!saved) {
            return res.status(404).json({
                status: 'error',
                message: 'Error al guardar la publicacion',
                params
            })
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'Creado exitosamente',
                publication: saved
            })
        }        
    })    
}

const list = async (req, res = response) => {

    const { page = 1, pagesize = 5 } = req.query;

    const [total, data] = await Promise.all([
        Publication.countDocuments(),
        Publication.find().skip((page - 1) * pagesize).limit(pagesize)
    ]);


    res.status(200).json(
        {
            status: "success",
            total,
            data
        });
};

const get = async (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    const exists = await Publication.findById(id);

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

    const deleted = await Publication.findOneAndDelete({ _id: id });

    if (!deleted) {

            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar la publicacion"
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

        // Buscar y actualizar al mismo tiempo
        await Publication.findByIdAndUpdate(id, resto);

        const publication = await Publication.findById(id);

        res.json({
            status: "success",
            publication
        });
    } catch (error) {
        throw error;
    }
}


const imageUpload = async (req, res) => {
    const publicationId = req.params.id;

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
        const updated = await Publication.findOneAndUpdate({ _id: publicationId }, { file: req.file.filename });
        
        if (!updated) {

            if (error || !userUpdated) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al actualizar"
                });
            }
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            publication: updated,
            file: req.file
        })

    }

}

const getImage = (req, res) => {
    let fileName = req.params.file;
    let pathFile = "./images/publication/" + fileName;

    fs.stat(pathFile, (error, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                exists,
                file,
                path
            });
        }
    })
}

const search = async(req, res) => {
    // Sacar el string de text
    let text = req.params.text;

    // Find OR 
    const founded = await Publication.find({ "$or": [
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

const myList = async (req, res = response) => {

    const { page = 1, pagesize = 5 } = req.query;

    const [total, data] = await Promise.all([
        Publication.countDocuments(),
        Publication.find({publisher: req.user.id})
            .sort("-create_at")
            .populate("publisher")
            .skip((page - 1) * pagesize).limit(pagesize)
    ]);


    res.status(200).json(
        {
            status: "success",
            total,
            data
        });
};

const feedList = async (req, res = response) => {
    const { page = 1, pagesize = 5 } = req.query;

    const followings = await Follow.find({follower: req.user.id});
    const ids = followings.map(fw => {
        return fw.followed
    });
    
    const [total, data] = await Promise.all([
        Publication.countDocuments({publisher: { $in: ids }}),
        Publication.find({publisher: { $in: ids }})
            .sort("-create_at")
            .populate("publisher")
            .skip((page - 1) * pagesize).limit(pagesize)
    ]);


    res.status(200).json(
        {
            status: "success",
            total,
            data
        });
};

const otherList = async (req, res = response) => {

    const { page = 1, pagesize = 5 } = req.query;

    const [total, data] = await Promise.all([
        Publication.countDocuments(),
        Publication.find({publisher: req.params.id})
            .sort("-create_at")
            .populate("publisher")
            .skip((page - 1) * pagesize).limit(pagesize)
    ]);

    res.status(200).json(
        {
            status: "success",
            total,
            data
        });
};


module.exports = {
    get,
    create,
    list,
    update,
    remove,
    imageUpload,
    getImage,
    search,
    myList,
    feedList,
    otherList
}