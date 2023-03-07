const {Schema, model} = require("mongoose");

const Project = new Schema({
    id: {type: Number, unique: true, required: true},
    title: {type: String, required: true},
    sub: {type: String, required: true},
});

module.exports = model('Project', Project);