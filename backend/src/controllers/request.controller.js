const BorrowRequest = require('../models/BorrowRequest');
const Item = require('../models/Item');

// @desc    Create borrow request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const { itemId, message, borrowDate, returnDate, pickupDetails } = req.body;

    // Get item and check availability
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    if (item.availability !== 'Available') {
      return res.status(400).json({
        success: false,
        error: 'Item is not available for borrowing',
      });
    }

    // Cannot borrow own item
    if (item.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot borrow your own item',
      });
    }

    // Check for existing pending request
    const existingRequest = await BorrowRequest.findOne({
      item: itemId,
      borrower: req.user.id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending request for this item',
      });
    }

    const request = await BorrowRequest.create({
      item: itemId,
      borrower: req.user.id,
      lender: item.owner,
      message,
      borrowDate,
      returnDate,
      pickupDetails,
    });

    const populatedRequest = await BorrowRequest.findById(request._id)
      .populate('item', 'title images')
      .populate('borrower', 'name profileImage')
      .populate('lender', 'name profileImage');

    res.status(201).json({
      success: true,
      data: populatedRequest,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's requests (sent & received)
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    const { type, status } = req.query;

    let query = {};

    // Filter by type (sent or received)
    if (type === 'sent') {
      query.borrower = req.user.id;
    } else if (type === 'received') {
      query.lender = req.user.id;
    } else {
      // Get both sent and received
      query.$or = [{ borrower: req.user.id }, { lender: req.user.id }];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const requests = await BorrowRequest.find(query)
      .populate('item', 'title images category')
      .populate('borrower', 'name profileImage averageRating')
      .populate('lender', 'name profileImage averageRating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res, next) => {
  try {
    const request = await BorrowRequest.findById(req.params.id)
      .populate('item', 'title images category condition lendingTerms')
      .populate('borrower', 'name email phone profileImage averageRating')
      .populate('lender', 'name email phone profileImage averageRating');

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Only borrower or lender can view request details
    if (
      request.borrower._id.toString() !== req.user.id &&
      request.lender._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this request',
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve borrow request
// @route   PUT /api/requests/:id/approve
// @access  Private (Lender only)
exports.approveRequest = async (req, res, next) => {
  try {
    let request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Only lender can approve
    if (request.lender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the item owner can approve requests',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot approve a request with status: ${request.status}`,
      });
    }

    // Update request status
    request.status = 'approved';
    await request.save();

    // Update item availability
    await Item.findByIdAndUpdate(request.item, { availability: 'Borrowed' });

    // Reject other pending requests for this item
    await BorrowRequest.updateMany(
      {
        item: request.item,
        _id: { $ne: request._id },
        status: 'pending',
      },
      { status: 'rejected' }
    );

    request = await BorrowRequest.findById(req.params.id)
      .populate('item', 'title images')
      .populate('borrower', 'name profileImage')
      .populate('lender', 'name profileImage');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject borrow request
// @route   PUT /api/requests/:id/reject
// @access  Private (Lender only)
exports.rejectRequest = async (req, res, next) => {
  try {
    let request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Only lender can reject
    if (request.lender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the item owner can reject requests',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot reject a request with status: ${request.status}`,
      });
    }

    request.status = 'rejected';
    await request.save();

    request = await BorrowRequest.findById(req.params.id)
      .populate('item', 'title images')
      .populate('borrower', 'name profileImage')
      .populate('lender', 'name profileImage');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark request as complete (item returned)
// @route   PUT /api/requests/:id/complete
// @access  Private (Lender only)
exports.completeRequest = async (req, res, next) => {
  try {
    let request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Only lender can mark as complete
    if (request.lender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the item owner can mark as complete',
      });
    }

    if (request.status !== 'approved' && request.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: `Cannot complete a request with status: ${request.status}`,
      });
    }

    request.status = 'completed';
    request.actualReturnDate = new Date();
    await request.save();

    // Update item availability and increment borrow count
    await Item.findByIdAndUpdate(request.item, {
      availability: 'Available',
      $inc: { borrowCount: 1 },
    });

    request = await BorrowRequest.findById(req.params.id)
      .populate('item', 'title images')
      .populate('borrower', 'name profileImage')
      .populate('lender', 'name profileImage');

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel borrow request
// @route   PUT /api/requests/:id/cancel
// @access  Private (Borrower only)
exports.cancelRequest = async (req, res, next) => {
  try {
    let request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Only borrower can cancel
    if (request.borrower.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only the requester can cancel this request',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel a request with status: ${request.status}`,
      });
    }

    request.status = 'cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
