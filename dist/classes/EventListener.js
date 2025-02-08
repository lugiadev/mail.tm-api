"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventListener;
const formatDates_1 = __importDefault(require("../utils/formatDates"));
const eventsource_1 = __importDefault(require("eventsource"));
function EventListener(Account) {
    var _a;
    const eventSource = new eventsource_1.default(`https://mercure.${(_a = Account.config.mailService) !== null && _a !== void 0 ? _a : 'mail.tm'}/.well-known/mercure?topic=/accounts/${Account.id}`, { headers: { Authorization: `Bearer ${Account.token}`, Accept: 'application/json' } });
    eventSource.onmessage = event => {
        const data = JSON.parse(event.data);
        const jsonData = Object.keys(data)
            .filter(key => !['@context', '@id', '@type'].includes(key))
            .reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: data[cur] })), {});
        switch (data['@type']) {
            case 'Account':
                if (jsonData.isDeleted) {
                    eventSource.close();
                }
                Object.assign(Account, (0, formatDates_1.default)(jsonData));
                Account.emit('account', jsonData);
                break;
            case 'Message':
                Account.mails.cache.set(jsonData.id, jsonData);
                Account.emit('newMail', jsonData);
                break;
        }
    };
    Object.defineProperty(Account, '_eventSource', { value: eventSource, configurable: true, writable: true, enumerable: false });
}
//# sourceMappingURL=EventListener.js.map