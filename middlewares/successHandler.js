const successHandler = (req, res, next) => {
    res.success = (data, message, status = 200) => {
      res.status(status).json({
        status: "success",
        data: data,
        message: message,
      });
    };
    next();
  };
  
  export default successHandler;
  