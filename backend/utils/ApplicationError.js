class ApplicationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "failed" : "error";
    this.success = false;
    this.name = this.constructor.name; // this.constructor.name gives us the name of the class/function using which a particular object was created and we are creating a local property called name and making it equal to that.
  }
}

export default ApplicationError;
