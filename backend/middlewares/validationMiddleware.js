import ApplicationError from "../utils/ApplicationError.js";

const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]); // property is a string specifying which part of the request to validate (e.g., 'body', 'query', or 'params').

    if (error) {
      console.log(error);
      const message = error.details.map((detail) => detail.message).join(", ");
      const err = new ApplicationError(400, `${message}`);
      next(err);
    }
    next(); // call the next middleware for the given path if validation passed
  };
};

export default validate;
