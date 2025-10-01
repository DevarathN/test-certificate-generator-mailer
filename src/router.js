const router = require('express').Router();
const { generateCertificate } = require('./services/certificateService');

router.post('/generate', generateCertificate);

module.exports = router;
