const controller = require("../controllers/user.controller")
const router = require("express").Router()
const authentication = require("../middleware/auth")

router.route("/").get(controller.getAll)

router.route("/").post(controller.create)

router.route("/login").post(controller.login)

router.route("/auth").post(authentication, controller.auth)

router.route("/").put(authentication, controller.update)

module.exports = router