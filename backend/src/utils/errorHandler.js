export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Erro interno do servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

