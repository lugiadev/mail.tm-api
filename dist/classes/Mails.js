"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getError_1 = __importDefault(require("../utils/getError"));
const MailCache_1 = __importDefault(require("./MailCache"));
const Mail_1 = __importDefault(require("../utils/Mail"));
class Mails {
    constructor(account) {
        Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false });
        Object.defineProperty(this, 'cache', { value: new MailCache_1.default(account), configurable: true, writable: false, enumerable: false });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.account.api.get(`/messages/${id}`).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 200) {
                    this.cache.set(id, response.data);
                    resolve(new Mail_1.default(response.data, this.account));
                    return;
                }
                reject((0, getError_1.default)(response));
            }));
        });
    }
    fetchAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1) {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.account.api.get(`/messages?page=${page}`).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 200) {
                    response.data.forEach((mail) => this.cache.set(mail.id, mail));
                    resolve(response.data.map((mail) => new Mail_1.default(mail, this.account)));
                    return;
                }
                reject((0, getError_1.default)(response));
            }));
        });
    }
}
exports.default = Mails;
//# sourceMappingURL=Mails.js.map