const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  approveRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
} = require('../controllers/request.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.route('/').get(getRequests).post(createRequest);

router.get('/:id', getRequest);
router.put('/:id/approve', approveRequest);
router.put('/:id/reject', rejectRequest);
router.put('/:id/complete', completeRequest);
router.put('/:id/cancel', cancelRequest);

module.exports = router;
