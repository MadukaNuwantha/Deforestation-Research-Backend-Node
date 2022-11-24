const model = require("../models/prediction.model")

const create = async (req, res) => {
    const id = req.user.id
    const savedAt = (new Date()).toISOString()
    try {
        let newPrediction = await model.create({
            user_id: id,
            filename: req.file.filename,
            path: req.file.path,
            predclass: req.body.predclass,
            accuracy: req.body.accuracy,
            savedAt: savedAt
        })
        res.json({
            status: "success",
            result: newPrediction
        })
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }

}

// get predictions by user id
const getById = async (req, res) => {
    try {
        let predictions = await model.find({ user_id: req.user.id })
        res.json({
            status: "success",
            result: predictions
        })
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

// needs auth then id param
const deleteById = async (req, res) => {
    try {
        let deleted = await model.findOneAndDelete({ _id: req.params.id })
        if (deleted) {
            res.json({
                status: "success"
            })
        } else {
            res.json({
                status: "fail"
            })
        }
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

module.exports = { create, getById, deleteById }