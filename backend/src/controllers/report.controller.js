const Report = require('../models/Report');

// @desc    Submit a report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { reportedUserId, reportedItemId, reason, description } = req.body;

    // Must report either user or item
    if (!reportedUserId && !reportedItemId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either reportedUserId or reportedItemId',
      });
    }

    // Cannot report yourself
    if (reportedUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot report yourself',
      });
    }

    const reportData = {
      reporter: req.user.id,
      reason,
      description,
    };

    if (reportedUserId) {
      reportData.reportedUser = reportedUserId;
      reportData.reportType = 'user';
    } else {
      reportData.reportedItem = reportedItemId;
      reportData.reportType = 'item';
    }

    const report = await Report.create(reportData);

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report submitted successfully. We will review it shortly.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const { status, reportType } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (reportType) {
      query.reportType = reportType;
    }

    const total = await Report.countDocuments(query);

    const reports = await Report.find(query)
      .populate('reporter', 'name email profileImage')
      .populate('reportedUser', 'name email profileImage')
      .populate('reportedItem', 'title images owner')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id
// @access  Private/Admin
exports.updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
      });
    }

    report.status = status || report.status;
    report.adminNotes = adminNotes || report.adminNotes;

    if (status === 'resolved' || status === 'dismissed') {
      report.resolvedBy = req.user.id;
      report.resolvedAt = new Date();
    }

    await report.save();

    report = await Report.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedItem', 'title')
      .populate('resolvedBy', 'name');

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};
