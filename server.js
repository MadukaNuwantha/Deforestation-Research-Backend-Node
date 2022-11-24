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

const port = process.env.PORT
const url = process.env.DB

mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => console.log(err))

const connection = mongo.connection

connection.once('open', () => {
  console.log('Database connected!')
})

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app;