export abstract class BaseCustomError extends Error {
  abstract statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }

  abstract serializeErrors(): { 
    message: string; 
    field?: string 
  }[];
}

export class ValidationError extends BaseCustomError {
  statusCode = 400;
  private errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[]) {
    super('Validation Failed');
    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map(err => ({
      message: err.message,
      field: err.field
    }));
  }
}


export class NotFoundError extends BaseCustomError {
  statusCode = 404;

  constructor(message: string = 'Resource Not Found') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class AuthenticationError extends BaseCustomError {
  statusCode = 401;

  constructor(message: string = 'Authentication Failed') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}


export class ForbiddenError extends BaseCustomError {
  statusCode = 403;

  constructor(message: string = 'Access Forbidden') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
