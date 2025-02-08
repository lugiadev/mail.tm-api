import type Account from '../classes/Account';
import type { IMail, If } from '../types/common';
export default class Mail<Cache extends boolean> implements IMail<Cache> {
    account: Account;
    readonly id: string;
    readonly msgid: string;
    readonly from: {
        address: string;
        name: string;
    };
    readonly to: Array<{
        address: string;
        name: string;
    }>;
    readonly subject: string;
    readonly intro: string;
    readonly seen: boolean;
    readonly isDeleted: boolean;
    readonly hasAttachments: boolean;
    readonly downloadUrl: string;
    readonly size: number;
    readonly createdAtTimestamp: string;
    readonly updatedAtTimestamp: string;
    readonly html?: If<Cache, undefined, string[]>;
    constructor(mail: IMail, account: Account);
    fetch(): Promise<this>;
    delete(): Promise<this>;
    setIsSeen(seen?: boolean): Promise<this>;
    download<Path extends string = ''>(path?: Path): Promise<Path>;
    get createdAt(): Date;
    get updatedAt(): Date;
}
