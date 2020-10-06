export enum ErrorCode {
    INVALID_INPUT = 'INVALID_INPUT',
    INVALID_ARGUMENT_COUNT = 'INVALID_ARGUMENT_COUNT',

    // Discord Server Errors
    SERVER_NOT_FOUND = 'SERVER_NOT_FOUND',
}

export class BotError extends Error {
    readonly code: ErrorCode;
    readonly message: any;

    constructor(code: ErrorCode, message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = code;
        this.message = message;

        Error.captureStackTrace(this);
    }
}
