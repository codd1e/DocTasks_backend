const {Schema, model} = require("mongoose");

const Documentation = new Schema({
    projectId: {type: String, required: true},
    text: {type: String, required: true},
});

module.exports = model('Documentation', Documentation);