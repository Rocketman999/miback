const express = require('express');
const authController = require('../controllers/authController'); // Ruta correcta
const router = express.Router();

router.post('/admin-token', authController.generateAdminToken);

module.exports = router;