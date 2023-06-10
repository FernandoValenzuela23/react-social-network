const { Schema, model } = require("mongoose");

const PublicationSchema = Schema({
    publisher: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Publication", PublicationSchema, "publications"); // collection: publications (minusculas y pluralizado)