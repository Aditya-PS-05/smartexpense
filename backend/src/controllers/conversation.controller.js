const Conversation = require('../models/Conversation');

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', 'name profileImage')
      .populate('item', 'title images')
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt',
        populate: {
          path: 'sender',
          select: 'name',
        },
      })
      .sort({ lastMessageAt: -1 });

    // Add unread count for current user
    const conversationsWithUnread = conversations.map((conv) => {
      const convObj = conv.toObject();
      convObj.unreadCount = conv.unreadCount.get(req.user.id) || 0;
      return convObj;
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversationsWithUnread,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get or create conversation with user
// @route   POST /api/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, itemId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide recipientId',
      });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create conversation with yourself',
      });
    }

    // Find existing conversation
    let query = {
      participants: { $all: [req.user.id, recipientId] },
    };

    if (itemId) {
      query.item = itemId;
    }

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name profileImage')
      .populate('item', 'title images');

    if (!conversation) {
      // Create new conversation
      const conversationData = {
        participants: [req.user.id, recipientId],
        unreadCount: new Map([
          [req.user.id, 0],
          [recipientId, 0],
        ]),
      };

      if (itemId) {
        conversationData.item = itemId;
      }

      conversation = await Conversation.create(conversationData);
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name profileImage')
        .populate('item', 'title images');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name profileImage email')
      .populate('item', 'title images category');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    // Check if user is participant
    if (!conversation.participants.map(p => p._id.toString()).includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this conversation',
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    next(err);
  }
};
