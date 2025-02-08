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
const formatDates_1 = __importDefault(require("../utils/formatDates"));
const EventListener_1 = __importDefault(require("./EventListener"));
const node_events_1 = require("node:events");
const getError_1 = __importDefault(require("../utils/getError"));
const request_1 = __importDefault(require("../utils/request"));
const Mails_1 = __importDefault(require("./Mails"));
class Account extends node_events_1.EventEmitter {
    constructor(account, config = {}) {
        super();
        Object.defineProperty(this, 'api', { value: (0, request_1.default)(), configurable: true, writable: false, enumerable: false });
        Object.defineProperty(this, 'mails', { value: new Mails_1.default(this), configurable: true, writable: false, enumerable: true });
        Object.defineProperty(this, 'config', { value: config, enumerable: false, writable: false, configurable: false });
        Object.assign(this, (0, formatDates_1.default)(account));
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.token === null || this.token === undefined) {
                    if (this.password === null || this.password === undefined || this.address === undefined) {
                        reject(new MailTMError_1.default('Account email address and password or token required'));
                    }
                    const tokenResponse = yield this.api.post('/token', { address: this.address, password: this.password }).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                    if (tokenResponse.status === 200) {
                        this.token = tokenResponse.data.token;
                        this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
                    }
                    else {
                        reject((0, getError_1.default)(tokenResponse));
                        return;
                    }
                }
                else {
                    this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
                }
                const accountResponse = yield this.api.get('/me').catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (accountResponse.status === 200) {
                    Object.assign(this, (0, formatDates_1.default)(accountResponse.data), { password: this.password, token: this.token });
                    resolve(this);
                    return;
                }
                reject((0, getError_1.default)(accountResponse));
            }));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const response = yield this.api.delete(`/accounts/${this.id}`).catch(e => { var _a; return (_a = e.response) !== null && _a !== void 0 ? _a : e; });
                if (response.status === 204) {
                    (_a = this._eventSource) === null || _a === void 0 ? void 0 : _a.close();
                    resolve(true);
                    return;
                }
                reject((0, getError_1.default)(response));
            }));
        });
    }
    addListener(event, listener) {
        const events = ['account', 'newMail'];
        if (!events.includes(event)) {
            return this;
        }
        if (this._eventSource === undefined || this._eventSource === null) {
            (0, EventListener_1.default)(this);
        }
        return super.addListener(event, listener);
    }
    on(event, listener) {
        return this.addListener(event, listener);
    }
    once(event, listener) {
        const events = ['account', 'newMail'];
        if (!events.includes(event)) {
            return this;
        }
        if (this._eventSource === undefined || this._eventSource === null) {
            (0, EventListener_1.default)(this);
        }
        return super.once(event, listener);
    }
    prependListener(event, listener) {
        const events = ['account', 'newMail'];
        if (!events.includes(event)) {
            return this;
        }
        if (this._eventSource === undefined || this._eventSource === null) {
            (0, EventListener_1.default)(this);
        }
        return super.prependListener(event, listener);
    }
    prependOnceListener(event, listener) {
        const events = ['account', 'newMail'];
        if (!events.includes(event)) {
            return this;
        }
        if (this._eventSource === undefined || this._eventSource === null) {
            (0, EventListener_1.default)(this);
        }
        return super.prependOnceListener(event, listener);
    }
    get createdAt() {
        return new Date(this.createdAtTimestamp);
    }
    get updatedAt() {
        return new Date(this.updatedAtTimestamp);
    }
}
exports.default = Account;
//# sourceMappingURL=Account.js.map