class ApiError {
  constructor(statusCode, message = "Something Went Wrong") {
    (this.statusCode = statusCode), (this.message = message);
    this.success = false;
  }
}

export { ApiError };
