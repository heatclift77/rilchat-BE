const express = require("express")
const router = express.Router()
const user = require("../controllers/user")
const {sendVerification, tokenValidation, upload} = require("../middlewares")

router
.post("/register", user.cekUsername, user.cekEmail,  user.register, sendVerification)
.post("/login", user.login)
.get("/verifycation/:email", user.verifyAcount)
.get("/cekToken", tokenValidation, user.sendDataUser)
.get("/search", user.search)
.get("/friends", user.getFriends)
.put("/profil", user.updateProfil)
.put("/changeImage", upload, user.updateImgProfil)

module.exports = router