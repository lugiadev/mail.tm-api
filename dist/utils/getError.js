"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getError;
const MailTMError_1 = __importDefault(require("../errors/MailTMError"));
function check(value) {
    return value !== null && value !== undefined;
}
function getError(response) {
    if (check(response.cause)) {
        return response;
    }
    else if (check(response.data)) {
        return check(response.data.detail) ? new MailTMError_1.default(response.data.detail) : check(response.data.message) ? new MailTMError_1.default(response.data.message) : response;
    }
    else {
        return new MailTMError_1.default(`Request failed with status ${response.status}`);
    }
}
//# sourceMappingURL=getError.js.map