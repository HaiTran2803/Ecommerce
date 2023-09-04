const express = require("express")
const router = express.Router()
const userController = require('../controllers/UserController')
const {authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware')


router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.post('/refresh-token', userController.refreshToken)
// router.post('/delete-many', authMiddleWare, userController.deleteMany)// this
// router.put('/update-user/:id', authUserMiddleWare, userController.updateUser)
// router.delete('/delete-user/:id', authMiddleWare, userController.deleteUser)
// router.get('/get-details/:id', authUserMiddleWare, userController.getDetailsUser)
// router.get('/getAll', authMiddleWare, userController.getAllUser)
router.put('/update-user/:id', userController.updateUser)
router.delete('/delete-user/:id', userController.deleteUser)
router.get('/getAll', userController.getAllUser)
router.get('/get-details/:id', userController.getDetailsUser)
router.post('/delete-many', userController.deleteMany)
module.exports = router



