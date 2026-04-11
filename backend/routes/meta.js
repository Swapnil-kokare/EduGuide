const express = require('express');
const { getCategories, getBranches, getCities } = require('../controllers/metaController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/branches', getBranches);
router.get('/cities', getCities);

module.exports = router;
