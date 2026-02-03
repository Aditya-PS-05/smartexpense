const Item = require('../models/Item');

// @desc    Create new item listing
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // Use user's location if item location not provided
    if (!req.body.location && req.user.location) {
      req.body.location = req.user.location;
    }

    const item = await Item.create(req.body);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all items with pagination
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = Item.find({ availability: 'Available' });

    // Category filter
    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }

    // Condition filter
    if (req.query.condition) {
      query = query.where('condition').equals(req.query.condition);
    }

    const total = await Item.countDocuments(query.getFilter());

    const items = await query
      .populate('owner', 'name profileImage averageRating')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage averageRating totalRatings address'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Owner only)
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    // Make sure user is item owner
    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this item',
      });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Owner only)
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
      });
    }

    // Make sure user is item owner
    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's items
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search items by keyword with filters
// @route   GET /api/items/search
// @access  Public
exports.searchItems = async (req, res, next) => {
  try {
    const {
      q,
      category,
      condition,
      availability,
      lat,
      lng,
      radius,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    let query = {};

    // Text search by keyword
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Availability filter (default to Available)
    query.availability = availability || 'Available';

    // Geospatial query - find items within radius (in kilometers)
    if (lat && lng) {
      const radiusInKm = parseFloat(radius) || 10; // Default 10km
      const radiusInRadians = radiusInKm / 6378.1; // Earth's radius in km

      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      };
    }

    // Build sort options
    let sortOption = {};
    switch (sort) {
      case 'date_asc':
        sortOption = { createdAt: 1 };
        break;
      case 'date_desc':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { 'owner.averageRating': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Item.countDocuments(query);

    let items;

    // If searching near a location, calculate distance
    if (lat && lng) {
      items = await Item.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distance',
            maxDistance: (parseFloat(radius) || 10) * 1000, // Convert km to meters
            spherical: true,
            query: query,
          },
        },
        { $skip: startIndex },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner',
          },
        },
        { $unwind: '$owner' },
        {
          $project: {
            title: 1,
            description: 1,
            category: 1,
            images: 1,
            condition: 1,
            availability: 1,
            location: 1,
            distance: 1,
            createdAt: 1,
            'owner._id': 1,
            'owner.name': 1,
            'owner.profileImage': 1,
            'owner.averageRating': 1,
          },
        },
      ]);
    } else {
      items = await Item.find(query)
        .populate('owner', 'name profileImage averageRating')
        .sort(sortOption)
        .skip(startIndex)
        .limit(parseInt(limit));
    }

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get items near a location
// @route   GET /api/items/nearby
// @access  Public
exports.getNearbyItems = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude',
      });
    }

    const items = await Item.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: 'distance',
          maxDistance: parseFloat(radius) * 1000, // Convert km to meters
          spherical: true,
          query: { availability: 'Available' },
        },
      },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          images: 1,
          condition: 1,
          availability: 1,
          location: 1,
          distance: 1,
          createdAt: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.profileImage': 1,
          'owner.averageRating': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};
