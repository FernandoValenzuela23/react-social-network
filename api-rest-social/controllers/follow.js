const Follow = require("../models/follow");
const User = require("../models/user");

const create = async(req, res) => {
    let params = req.body;

    if (!params.follower || !params.followed) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos requeridos no recibidos',
            params
        })
    }

    let exists = await User.findById(params.follower);
    if (!exists) {
        return res.status(400).json({
            status: 'error',
            message: 'El seguidor no existe',
            params
        })
    }

    exists = await User.findById(params.followed);
    if (!exists) {
        return res.status(400).json({
            status: 'error',
            message: 'El usuario seguido no existe',
            params
        })
    }

    const newFollow = new Follow(params);

    newFollow.save();

    return res.status(200).json({
        status: 'success',
        message: 'Creado exitosamente',
        params
    })
}

const remove = async (req, res) => {
    const followedId = req.params.id;
    let followerId = req.user.id;

    const deleted = await Follow.findOneAndRemove({ "$and": [
        { "follower": followerId},
        { "followed": followedId},
    ]})

    if (!deleted) {

            return res.status(500).json({
                status: "error",
                mensaje: "Error al intentar dejar de seguir"
            });

    };

    return res.status(200).json({
        status: "success",
        deleted,
        message: 'Eliminado exitosamente'
    });

}

const getFollowers = async(req, res) => {
    const followersId = await Follow.find({followed: req.user.id});
    const ids = followersId.map(fw => {
        return fw.follower
    });

    const followers = await User.find({_id: { $in: ids }});

    return res.status(200).json({
        status: 'success',
        message: 'Mis seguidores',
        followers
    })
}

const getFollowing = async(req, res) => {
    const follows = await Follow.find({follower: req.user.id});
    const ids = follows.map(fw => {
        return fw.followed
    });

    const followed = await User.find({_id: { $in: ids }});

    return res.status(200).json({
        status: 'success',
        message: 'A quien sigo',
        followed
    })
}

module.exports = {
    create,
    remove,
    getFollowers,
    getFollowing
}