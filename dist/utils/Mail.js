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
const MailTMError_1 = __importDefault(require("../errors/MailTMError"));
const formatDates_1 = __importDefault(require("./formatDates"));
const getError_1 = __importDefault(require("./getError"));
const request_1 = __importDefault(require("./request"));
const node_fs_1 = __importDefault(require("node:fs"));
class Mail {
    constructor(mail, account) {
        // @ts-expect-error - accountId is unnecessary
        delete account.accountId;
        Object.defineProperty(this, 'account', { value: account, configurable: true, writable: false, enumerable: false });
        Object.assign(this, (0, formatDates_1.default)(mail));
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.isDeleted) {
                    reject(new MailTMError_1.default('Mail is deleted'));
                    return;
                }
                const response = yield (0, request_1.default)().get(`/messages/${this.id}`).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 200) {
                    Object.assign(this, (0, formatDates_1.default)(response.data));
                }
                else {
                    reject((0, getError_1.default)(response));
                    return;
                }
                resolve(this);
            }));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.isDeleted) {
                    reject(new MailTMError_1.default('Mail is already deleted'));
                    return;
                }
                const response = yield (0, request_1.default)().delete(`/messages/${this.id}`).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 204) {
                    Object.defineProperty(this, 'isDeleted', { value: true });
                }
                else {
                    reject((0, getError_1.default)(response));
                    return;
                }
                resolve(this);
            }));
        });
    }
    setIsSeen() {
        return __awaiter(this, arguments, void 0, function* (seen = true) {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, request_1.default)().patch(`/messages/${this.id}`, { seen }).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 200) {
                    Object.assign(this, (0, formatDates_1.default)(response.data));
                }
                else {
                    reject((0, getError_1.default)(response));
                    return;
                }
                resolve(this);
            }));
        });
    }
    download(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (path === null || path === undefined) {
                    path = `${this.id}.eml`;
                }
                if (typeof this.downloadUrl !== 'string') {
                    reject(new MailTMError_1.default('Download url not available!'));
                    return;
                }
                const response = yield (0, request_1.default)().get(this.downloadUrl, { headers: { Accept: 'text/html' } }).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (typeof response.data !== 'string') {
                    reject((0, getError_1.default)(response));
                    return;
                }
                node_fs_1.default.writeFileSync(path, response.data, 'utf-8');
                resolve(path);
            }));
        });
    }
    get createdAt() {
        return new Date(this.createdAtTimestamp);
    }
    get updatedAt() {
        return new Date(this.updatedAtTimestamp);
    }
}
exports.default = Mail;
//# sourceMappingURL=Mail.js.map