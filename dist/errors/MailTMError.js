"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MailTMError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.default = MailTMError;
//# sourceMappingURL=MailTMError.js.map