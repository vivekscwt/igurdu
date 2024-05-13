"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.BadRequest = exports.NotFound = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode['BAD_REQUEST'] = 400] = 'BAD_REQUEST';
    HttpStatusCode[HttpStatusCode['NOT_FOUND'] = 404] = 'NOT_FOUND';
    HttpStatusCode[HttpStatusCode['INTERNAL_SERVER'] = 500] = 'INTERNAL_SERVER';
})(HttpStatusCode || (HttpStatusCode = {}));
class ErrorLib extends Error {
    constructor(name, code, description) {
        super(name);
        this.name = name;
        this.code = code;
        this.description = description;
        this.code = code;
        this.description = description;
    }
}
exports.default = ErrorLib;
class NotFound extends ErrorLib {
    constructor(name = '', description = 'not found') {
        super(name, HttpStatusCode.NOT_FOUND, description);
    }
}
exports.NotFound = NotFound;
class BadRequest extends ErrorLib {
    constructor(name = '', description = 'bad request') {
        super(name, HttpStatusCode.BAD_REQUEST, description);
    }
}
exports.BadRequest = BadRequest;
class ServerError extends ErrorLib {
    constructor(name = '', description = 'server error') {
        super(name, HttpStatusCode.INTERNAL_SERVER, description);
    }
}
exports.ServerError = ServerError;
