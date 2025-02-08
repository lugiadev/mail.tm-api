import type IUserAccount from '../types/IUserAccount';
import type IAccount from '../types/IAccount';
import type IConfig from '../types/IConfig';
import { EventEmitter } from 'node:events';
import type { AxiosInstance } from 'axios';
import type EventSource from 'eventsource';
import type Mail from '../utils/Mail';
import Mails from './Mails';
declare interface Account {
    addListener(event: 'newMail', listener: (mail: Mail<true>) => void): this;
    addListener(event: 'account', listener: (account: IUserAccount) => void): this;
    on(event: 'newMail', listener: (mail: Mail<true>) => void): this;
    on(event: 'account', listener: (account: IUserAccount) => void): this;
    once(event: 'newMail', listener: (mail: Mail<true>) => void): this;
    once(event: 'account', listener: (account: IUserAccount) => void): this;
}
declare class Account extends EventEmitter implements IAccount {
    mails: Mails;
    api: AxiosInstance;
    _eventSource: EventSource;
    readonly config: IConfig;
    readonly id: string;
    readonly address: string;
    readonly quota: number;
    readonly used: number;
    readonly isDisabled: boolean;
    readonly isDeleted: boolean;
    readonly createdAtTimestamp: string;
    readonly updatedAtTimestamp: string;
    token: string;
    readonly password?: string | undefined;
    constructor(account: IUserAccount, config?: IConfig);
    fetch(): Promise<this>;
    delete(): Promise<boolean>;
    prependListener(event: string, listener: (...args: any) => void): this;
    prependOnceListener(event: string, listener: (...args: any) => void): this;
    get createdAt(): Date;
    get updatedAt(): Date;
}
export default Account;
