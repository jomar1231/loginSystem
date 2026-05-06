const express = require('express');
const router = express.Router();
const {register, login, logout} = require('../controller/authController');

router.get("/login", (req,res) =>{
    res.json({message : "hello world"});
})

router.post("/register", register);
router.post("/login",login);
router.post("/logout", logout);
module.exports = router;