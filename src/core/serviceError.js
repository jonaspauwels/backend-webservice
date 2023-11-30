const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const DUPLICATE_VALUES = 'DUPLICATE_VALUES';
const EXCEEDED_CAPACITY = 'EXCEEDED_CAPACITY';

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
}

module.exports = ServiceError;