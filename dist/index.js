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
exports.fetchDomains = fetchDomains;
exports.createAccount = createAccount;
exports.loginAccount = loginAccount;
exports.setConfig = setConfig;
const randomString_1 = __importDefault(require("./utils/randomString"));
const MailTMError_1 = __importDefault(require("./errors/MailTMError"));
const formatDates_1 = __importDefault(require("./utils/formatDates"));
const getError_1 = __importDefault(require("./utils/getError"));
const Account_1 = __importDefault(require("./classes/Account"));
const request_1 = __importDefault(require("./utils/request"));
const CONFIG = {
    mailService: 'mail.tm',
    axiosOptions: {}
};
let domains = [];
/**
 * Fetches available domains from server
 */
function fetchDomains() {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, getRandomDomain = false } = {}) {
        return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, request_1.default)().get(`/domains?page=${page}`).catch(() => null);
            if (response.status === 200) {
                domains = response.data.map((domain) => {
                    domain = (0, formatDates_1.default)(domain);
                    Object.defineProperty(domain, 'createdAt', { get: () => new Date(domain.createdAtTimestamp) });
                    Object.defineProperty(domain, 'updatedAt', { get: () => new Date(domain.updatedAtTimestamp) });
                    return domain;
                });
                if (getRandomDomain === true) {
                    resolve(domains[Math.floor(Math.random() * domains.length)]);
                }
                else {
                    resolve(domains);
                }
            }
            else {
                reject((0, getError_1.default)(response));
            }
        }));
    });
}
/**
 * Creates an account
 * @example
 * const account = await createAccount()
 * console.log(account.email)
 */
function createAccount(address, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetchDomains();
                if (typeof address !== 'string') {
                    address = `${(0, randomString_1.default)(16)}@${domains[Math.floor(Math.random() * domains.length)].domain}`;
                }
                if (address.split('@').length === 1) {
                    if (domains.some(domain => domain.domain === address)) {
                        address = `${(0, randomString_1.default)(16)}@${address}`;
                    }
                    else {
                        address += `@${domains[Math.floor(Math.random() * domains.length)].domain}`;
                    }
                }
                if (typeof password !== 'string') {
                    password = (0, randomString_1.default)(16);
                }
                const response = yield (0, request_1.default)().post('/accounts', { address, password }).catch(() => null);
                if (response && response.status === 201) {
                    const account = new Account_1.default(Object.assign(response.data, { password }), CONFIG);
                    yield account.fetch().catch(() => { });
                    yield account.mails.fetchAll().catch(() => { });
                    resolve(account);
                    return;
                }
                reject((0, getError_1.default)(response !== null && response !== void 0 ? response : new Error('Unknown error')));
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
/**
 * Logs into an existing account
 * @example
 * const account = await loginAccount("mySuperSecretToken") // Login with account token
 * console.log(account.email)
 * // Or
 * const account = await loginAccount("myEmail@domain.com", "mySuperSecretPassword")
 * console.log(account.email)
 */
function loginAccount(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const [addressOrToken, password] = args;
            yield fetchDomains().catch(reject);
            if (typeof addressOrToken !== 'string') {
                throw new MailTMError_1.default('Token or credentials are required');
            }
            if (typeof password === 'string') {
                const tokenResponse = yield (0, request_1.default)().post('/token', { address: addressOrToken, password }).catch(() => null);
                if (tokenResponse.status !== 200 || typeof tokenResponse.data.token !== 'string' || tokenResponse.data.token === '') {
                    reject((0, getError_1.default)(tokenResponse));
                    return;
                }
                const response = yield (0, request_1.default)().get('/me', { headers: { Authorization: `Bearer ${tokenResponse.data.token}` } }).catch(() => null);
                if (response.status === 200) {
                    const account = new Account_1.default(Object.assign(response.data, { token: tokenResponse.data.token, password }), CONFIG);
                    yield account.fetch().catch(reject);
                    yield account.mails.fetchAll().catch(reject);
                    resolve(account);
                    return;
                }
                reject((0, getError_1.default)(response));
            }
            else {
                const response = yield (0, request_1.default)().get('/me', { headers: { Authorization: `Bearer ${addressOrToken}` } }).catch(() => null);
                if (response.status === 200) {
                    const account = new Account_1.default(Object.assign(response.data, { token: addressOrToken }), CONFIG);
                    yield account.fetch().catch(reject);
                    yield account.mails.fetchAll().catch(reject);
                    resolve(account);
                    return;
                }
                reject((0, getError_1.default)(response));
            }
        }));
    });
}
function setConfig(config) {
    (0, request_1.default)(config.mailService, config.axiosOptions);
    Object.assign(CONFIG, config);
}
// :3
//# sourceMappingURL=index.js.map