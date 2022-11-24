const controller = require("../controllers/prediction.controller")
const router = require("express").Router()
const authentication = require("../middleware/auth")
const upload = require("../middleware/prediction").upload

router.route("/").get(authentication, controller.getById)

router.route("/").post([authentication, upload.single("file")], controller.create)

router.route("/:id").delete(authentication, controller.deleteById)

module.exports = router