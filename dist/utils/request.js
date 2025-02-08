"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = request;
const axios_1 = __importDefault(require("axios"));
let endpoint = 'https://api.mail.tm';
let options = {};
function request(service, axiosOptions) {
    if (service !== undefined && ['mail.tm', 'mail.gw'].includes(service)) {
        endpoint = `https://api.${service}`;
    }
    if (axiosOptions !== undefined) {
        options = axiosOptions;
    }
    const instance = axios_1.default.create(Object.assign(Object.assign({}, options), { baseURL: endpoint, headers: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.headers), { 'Content-Type': 'application/json', Accept: 'application/json', Connection: 'close', 'User-Agent': 'MailTM API - NodeJS' }) }));
    return instance;
}
//# sourceMappingURL=request.js.map