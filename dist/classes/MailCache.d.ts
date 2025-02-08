import type { IMail } from '../types/common';
import type Account from './Account';
import Mail from '../utils/Mail';
export default class MailCache extends Map<string, Mail<false>> {
    account: Account;
    constructor(account: Account);
    set(id: string, mail: IMail): this;
}
