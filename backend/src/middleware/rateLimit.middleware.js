const rateLimit = new Map();

const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later',
  } = options;

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!rateLimit.has(key)) {
      rateLimit.set(key, {
        count: 1,
        startTime: now,
      });
      return next();
    }

    const record = rateLimit.get(key);

    // Reset if window has passed
    if (now - record.startTime > windowMs) {
      rateLimit.set(key, {
        count: 1,
        startTime: now,
      });
      return next();
    }

    // Increment count
    record.count++;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000),
      });
    }

    next();
  };
};

// Pre-configured limiters
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // stricter limit for auth routes
  message: 'Too many login attempts, please try again after 15 minutes',
});

const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 uploads per hour
  message: 'Upload limit exceeded, please try again later',
});

module.exports = {
  createRateLimiter,
  generalLimiter,
  authLimiter,
  uploadLimiter,
};
