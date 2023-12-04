const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const DUPLICATE_VALUES = 'DUPLICATE_VALUES';
const EXCEEDED_CAPACITY = 'EXCEEDED_CAPACITY';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN'; 

class ServiceError extends Error {
    constructor(code, message, details= {}) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'ServiceError';
    }

    static notFound(message, details) {
        return new ServiceError(NOT_FOUND, message, details);
    }

    static validationFailed(message, details) {
        return new ServiceError(VALIDATION_FAILED, message, details);
    }

    static duplicateValues(message, details) {
        return new ServiceError(DUPLICATE_VALUES, message, details);
    }

    static exceededCapacity(message, details) {
        return new ServiceError(EXCEEDED_CAPACITY, message, details);
    }

    static unauthorized(message, details) {
        return new ServiceError(UNAUTHORIZED, message, details);
    }

    static forbidden(message, details) {
        return new ServiceError(FORBIDDEN, message, details);
    }

    get isNotFound() {
        return this.code === NOT_FOUND;
    }

    get isValidationFailed() {
        return this.code === VALIDATION_FAILED;
    }

    get isDuplicateValues() {
        return this.code === DUPLICATE_VALUES;
    }

    get isExceededCapacity() {
        return this.code === EXCEEDED_CAPACITY;
    }

    get isUnauthorized() {
        return this.code === UNAUTHORIZED;
      }
    
      get isForbidden() {
        return this.code === FORBIDDEN;
      }
}

module.exports = ServiceError;