import type Account from './Account';
import MailCache from './MailCache';
import Mail from '../utils/Mail';
export default class Mails {
    cache: MailCache;
    account: Account;
    constructor(account: Account);
    fetch(id: string): Promise<Mail<false>>;
    fetchAll(page?: number): Promise<Array<Mail<false>>>;
}
