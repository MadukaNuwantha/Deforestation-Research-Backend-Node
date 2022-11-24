require('dotenv').config();

const express = require('express')
const mongo = require('mongoose')
const router = express.Router()
const app = express()

const userRoute = require("./routes/user.route")
const predictionRoute = require("./routes/prediction.route")

const cors = require('cors')

app.use(cors());
app.use(express.json());

router.use("/user", userRoute)
router.use("/prediction", predictionRoute)

router.use("/ping", (req, res) => {
  res.status(200)
  res.json({
    status: "success",
    result: "pong!"
  })
})

router.use("/predictions", express.static('./public/predictions'));

app.use("/api", router)

module.exports = app;