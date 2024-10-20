const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware.verifyToken, userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;