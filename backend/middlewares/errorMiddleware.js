const globalErrorHandler = (err, req, res, next) => {
  console.log("-------- ERROR ---------".brightWhite.bgBrightRed);
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: err.success,
    status: err.statusCode,
    message: err.message,
  });
};

export default globalErrorHandler;
