"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatDates;
function formatDates(data) {
    if (data === null || data === undefined) {
        return data;
    }
    const dates = ['createdAt', 'updatedAt'];
    for (const date of dates) {
        data[date + 'Timestamp'] = data[date];
        Reflect.deleteProperty(data, date);
    }
    return data;
}
//# sourceMappingURL=formatDates.js.map