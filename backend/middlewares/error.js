class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.name==="CastError"){
        const message=`Resource not found. ${err.path}`;
        err=new ErrorHandler(400,message);
    }

    if(err.code===11000){
        const message=`Duplicate  ${Object.keys(err.keyValue )} entered`;
        err=new ErrorHandler(400,message);
    }

    if(err.name==="JsonWebTokenError"){
        const message=`Json web token is Invalid, Try again`;
        err=new ErrorHandler(400,message);
    }

    if(err.name==="TokenExpiredError"){
        const message=`Json web token is Expired, Try again`;
        err=new ErrorHandler(400,message);
    }
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export default ErrorHandler;