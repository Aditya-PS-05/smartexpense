const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  updateReport,
} = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createReport);
router.get('/', protect, getReports); // TODO: Add admin middleware
router.put('/:id', protect, updateReport); // TODO: Add admin middleware

module.exports = router;
