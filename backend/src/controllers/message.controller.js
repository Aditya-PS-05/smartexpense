const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, recipientId, content, itemId } = req.body;

    let conversation;

    if (conversationId) {
      // Use existing conversation
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found',
        });
      }

      // Check if user is participant
      if (!conversation.participants.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to send message in this conversation',
        });
      }
    } else if (recipientId) {
      // Find or create conversation
      conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, recipientId] },
        item: itemId || null,
      });

      if (!conversation) {
        // Create new conversation
        const conversationData = {
          participants: [req.user.id, recipientId],
          unreadCount: new Map([[recipientId, 0]]),
        };

        if (itemId) {
          conversationData.item = itemId;
        }

        conversation = await Conversation.create(conversationData);
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please provide conversationId or recipientId',
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content,
      readBy: [req.user.id],
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participants
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== req.user.id) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    // Check if user is participant
    if (!conversation.participants.map(p => p.toString()).includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this conversation',
      });
    }

    const total = await Message.countDocuments({ conversation: conversationId });

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        readBy: { $ne: req.user.id },
      },
      { $addToSet: { readBy: req.user.id } }
    );

    // Reset unread count for this user
    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: messages.reverse(), // Return in chronological order
    });
  } catch (err) {
    next(err);
  }
};
