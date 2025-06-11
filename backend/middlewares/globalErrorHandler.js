let globalErrorHandler = (err, req, res, next) => {

    console.log(err);


    //user and blog has unique key(code===11000) so differentiate with different error messages 
    // if (err.code === 11000) {
    //     if (err.keyPattern.email) {
    //         err.statusCode = 400;
    //         err.message = "User with this email exists already!!"
    //     }
    //     if (err.keyPattern.title) {
    //         err.statusCode = 400;
    //         err.message = "blog with this title exists already!!"
    //     }
    // }

    // if (err.code === 11000) {
  //   const field = Object.keys(err.keyValue)[0];
  //   err.statusCode = 409;
  //   err.message = `${field} already exists`;
  // }


    if (err.name === "ValidationError") {
    let msgs = [];
    Object.values(err.errors).map((err) => {
      msgs.push(err.message);
    });
    err.message = msgs.join(", ");
    err.statusCode = 400;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Session timed out!";
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 404;
    err.message = "User doesnt exist";
  }

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "Id not valid";
  }
  let message = err.message || "Something went wrong;";
  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: message,
    errStackTrace: err.stack,
  });

}

export default globalErrorHandler;