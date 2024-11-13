const asyncHandler = (asyncFunc) => (req, res, next) => {
  Promise.resolve(asyncFunc(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;
