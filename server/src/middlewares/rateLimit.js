export const rateLimitMiddleware = (limiter) => {
  return async (req, res, next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.connection.remoteAddress;

    try {
      await limiter.consume(ip);
      return next();
    } catch (err) {
      const retrySecs = Math.round(err.msBeforeNext / 1000) || 1;
      res.set("Retry-After", retrySecs);
      return res.status(429).json({
        success: false,
        message: `Too many requests. Try again in ${retrySecs}s.`,
      });
    }
  };
};
