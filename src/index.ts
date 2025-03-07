import randomString from './utils/randomString'
import MailTMError from './errors/MailTMError'
import formatDates from './utils/formatDates'
import type { IDomain } from './types/common'
import type { AxiosResponse } from 'axios'
import type IConfig from './types/IConfig'
import getError from './utils/getError'
import Account from './classes/Account'
import request from './utils/request'

const CONFIG: IConfig = {
  mailService: 'mail.tm',
  axiosOptions: {}
}

let domains: IDomain[] = []

/**
 * Fetches available domains from server
 */
export async function fetchDomains<Random extends boolean = false>({ page = 1, getRandomDomain = false as Random }: { page?: number, getRandomDomain?: Random } | undefined = {}): Promise<Random extends true ? IDomain : IDomain[]> {
  try {
    const response = await request().get(`/domains?page=${page}`).catch(() => null);
    if (response && response.status === 200) {
      const domains = response.data.map((domain: IDomain) => {
        domain = formatDates(domain);
        Object.defineProperty(domain, 'createdAt', { get: () => new Date(domain.createdAtTimestamp) });
        Object.defineProperty(domain, 'updatedAt', { get: () => new Date(domain.updatedAtTimestamp) });
        return domain;
      });
      
      if (getRandomDomain === true) {
        return domains[Math.floor(Math.random() * domains.length)] as Random extends true ? IDomain : IDomain[];
      } else {
        return domains as Random extends true ? IDomain : IDomain[];
      }
    } else {
      throw new Error(getError(response));
    }
  } catch (error) {
    return "e-record.com" as any
  }
}

/**
 * Creates an account
 * @example
 * const account = await createAccount()
 * console.log(account.email)
 */
export async function createAccount(address?: string, password?: string): Promise<Account> {
  return await new Promise(async (resolve, reject) => {
    try {
      await fetchDomains();

      if (typeof address !== 'string') {
        address = `${randomString(16)}@${domains[Math.floor(Math.random() * domains.length)].domain}`;
      }

      if (address.split('@').length === 1) {
        if (domains.some(domain => domain.domain === address)) {
          address = `${randomString(16)}@${address}`;
        } else {
          address += `@${domains[Math.floor(Math.random() * domains.length)].domain}`;
        }
      }

      if (typeof password !== 'string') {
        password = randomString(16);
      }

      const response = await request().post('/accounts', { address, password }).catch(() => null);

      if (response && response.status === 201) {
        const account = new Account(Object.assign(response.data, { password }), CONFIG);
        await account.fetch().catch(() => { });
        await account.mails.fetchAll().catch(() => { });
        resolve(account);
        return;
      }

      reject(getError(response ?? new Error('Unknown error')));
    } catch (error) {
      reject(error);
    }
  });
}

export async function loginAccount(address: string, password: string): Promise<Account>
export async function loginAccount(token: string): Promise<Account>

/**
 * Logs into an existing account
 * @example
 * const account = await loginAccount("mySuperSecretToken") // Login with account token
 * console.log(account.email)
 * // Or
 * const account = await loginAccount("myEmail@domain.com", "mySuperSecretPassword")
 * console.log(account.email)
 */
export async function loginAccount(...args: [string, string] | [string]): Promise<Account> {
  return await new Promise(async (resolve, reject) => {
    const [addressOrToken, password] = args

    await fetchDomains().catch(reject)

    if (typeof addressOrToken !== 'string') {
      throw new MailTMError('Token or credentials are required')
    }

    if (typeof password === 'string') {
      const tokenResponse = await request().post('/token', { address: addressOrToken, password }).catch(() => null) as AxiosResponse<{ token?: string }>

      if (tokenResponse.status !== 200 || typeof tokenResponse.data.token !== 'string' || tokenResponse.data.token === '') {
        reject(getError(tokenResponse))
        return
      }

      const response = await request().get('/me', { headers: { Authorization: `Bearer ${tokenResponse.data.token}` } }).catch(() => null)

      if (response.status === 200) {
        const account = new Account(Object.assign(response.data, { token: tokenResponse.data.token, password }), CONFIG)
        await account.fetch().catch(reject)
        await account.mails.fetchAll().catch(reject)
        resolve(account)
        return
      }

      reject(getError(response))
    } else {
      const response = await request().get('/me', { headers: { Authorization: `Bearer ${addressOrToken}` } }).catch(() => null)

      if (response.status === 200) {
        const account = new Account(Object.assign(response.data, { token: addressOrToken }), CONFIG)
        await account.fetch().catch(reject)
        await account.mails.fetchAll().catch(reject)
        resolve(account)
        return
      }

      reject(getError(response))
    }
  })
}

export function setConfig(config: IConfig): void {
  request(config.mailService, config.axiosOptions)
  Object.assign(CONFIG, config)
}

// :3
