
const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode).json({
    status: "fail",
    message: err?.message,
  });
};

export { notFound, errHandler };

