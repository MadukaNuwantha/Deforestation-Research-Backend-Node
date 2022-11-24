const mongo = require("mongoose");

const prediction = mongo.Schema({
    user_id: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
    predclass: {
        type: String,
        required: true
    },
    accuracy: {
        type: String,
        required: true
    },
    savedAt: {
        type: String,
        required: true
    }
})

module.exports = mongo.model("File", prediction)