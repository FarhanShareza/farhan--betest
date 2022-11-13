const express = require("express");
const router = express.Router();

const userController = require('../controller/user')
const authenticate = require("../middleware/authenticate.js");

router.get('/get-token', userController.getToken)
router.post('/post-Kafka', userController.postKafka)

router.post('/create-user', authenticate,userController.createUser)
router.get('/get-all-user', authenticate,userController.getUser)
router.get('/get-userid/:userId', authenticate,userController.getUserId)
router.put('/update-userid/:userId', authenticate,userController.updateUserId)
router.delete('/delete-userid/:userId', authenticate,userController.deleteUserId)

module.exports = router;