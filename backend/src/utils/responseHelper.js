export const successResponse = (res, data = {}, message = 'Operação realizada com sucesso') => {
  res.json({ success: true, message, data });
};

export const errorResponse = (res, message = 'Ocorreu um erro', status = 400) => {
  res.status(status).json({ success: false, message });
};

