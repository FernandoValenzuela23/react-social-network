const { Schema, model } = require("mongoose");

const FollowSchema = Schema({
    follower: {
        type: Schema.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Follow", FollowSchema, "follows"); // collection: follows (minusculas y pluralizado)