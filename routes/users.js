const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const users = require('../controllers/users')

//REGISTER
router.route('/register')
    .get(users.registerGet)
    .post(users.registerPost)
//LOGIN
router.route('/login')
    .get(users.loginGet)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), users.loginPost)
//LogOut
router.get('/logout',users.Logout)
module.exports = router;