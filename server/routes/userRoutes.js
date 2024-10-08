const express = require('express');
const { registerController, loginController, updateUserController, requireSignin } = require('../controllers/userController');

//router object
const router = express.Router()

//routes
//REGISTER || POST
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController )

//update || put 
router.put('/update-user', updateUserController)
//export the model

module.exports = router;