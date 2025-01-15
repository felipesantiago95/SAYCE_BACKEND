function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err); // Pasar el error al siguiente middleware
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err); // Pasar otros errores al siguiente middleware
  }
}

module.exports = { logErrors, errorHandler, boomErrorHandler };
