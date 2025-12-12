export function response(res, result, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data: result,
  });
}
