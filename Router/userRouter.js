const express = require("express")
const { homePage, SignPage, loginPage, addUser, loginchecking } = require("../Controller/Usercnt")

const router= express.Router()

router.get("/" , homePage)
router.get("/signup" , SignPage)
router.get("/loginpage" , loginPage)
router.post("/add", addUser)
router.post("/logincheck", loginchecking)




module.exports= router

