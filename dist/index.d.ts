import type { IDomain } from './types/common';
import type IConfig from './types/IConfig';
import Account from './classes/Account';
/**
 * Fetches available domains from server
 */
export declare function fetchDomains<Random extends boolean = false>({ page, getRandomDomain }?: {
    page?: number;
    getRandomDomain?: Random;
} | undefined): Promise<Random extends true ? IDomain : IDomain[]>;
/**
 * Creates an account
 * @example
 * const account = await createAccount()
 * console.log(account.email)
 */
export declare function createAccount(address?: string, password?: string): Promise<Account>;
export declare function loginAccount(address: string, password: string): Promise<Account>;
export declare function loginAccount(token: string): Promise<Account>;
export declare function setConfig(config: IConfig): void;
