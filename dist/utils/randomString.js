"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = randomString;
function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    return result;
}
//# sourceMappingURL=randomString.js.map