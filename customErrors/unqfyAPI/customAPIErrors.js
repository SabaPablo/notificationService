const apiError = require('./apiError');

class ResourceDuplicated extends apiError.APIError {
    constructor() {
        super('ResourceDuplicated', 409, 'RESOURCE_ALREADY_EXISTS');
    }
}

class ResourceNotFound extends apiError.APIError {
    constructor() {
        super('ResourceNotFound', 404, 'RESOURCE_NOT_FOUND');
    }
}

class RelatedResourceNotFound extends apiError.APIError {
    constructor() {
        super('RelatedResourceNotFound', 404, 'RELATED_RESOURCE_NOT_FOUND');
    }
}

class BadRequest extends apiError.APIError {
    constructor() {
        super('BadRequest', 400, 'BAD_REQUEST');
    }
}


module.exports = {
    ResourceDuplicated,
    ResourceNotFound,
    RelatedResourceNotFound,
    BadRequest,
  };