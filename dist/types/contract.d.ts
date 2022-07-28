import BN from 'bn.js';
import { TypeDef } from "@polkadot/types-create/types";
import { SubmittableResult } from "@polkadot/api";
import { Codec, ISubmittableResult } from "@polkadot/types/types";
import { AbiEvent } from "@polkadot/api-contract/types";
import { SignerOptions, SubmittableExtrinsic } from "@polkadot/api/types";
import { ApiPromise } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces';
import { Abi } from '@polkadot/api-contract';
import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import type { AnyJson } from '@polkadot/types/types';
import { Registry } from "@polkadot/types/types";
import { Signer } from './signer';
import { ContractAbi } from './artifacts';
import { Network } from './network';
export interface TransactionResponse {
    from: string;
    txHash?: string;
    blockHash?: string;
    error?: {
        message?: any;
        data?: any;
    };
    result: SubmittableResult;
    events?: DecodedEvent[];
}
export interface DecodedEvent {
    args: Codec[];
    name: string;
    event: AbiEvent;
}
export interface ContractTxResponse {
    args: string[];
    event: {
        args: [
            {
                name: string;
                type: {
                    info: number;
                    type: string;
                };
            },
            {
                name: string;
                type: TypeDef;
            }
        ];
        docs: [];
        identifier: string;
        index: number;
    };
    name: string;
}
export interface CallParams {
    dest: any;
    value: BigNumber;
    gasLimit: BigNumber;
    inputData: Uint8Array;
}
export interface CallOverrides extends SignerOptions {
    dest?: any;
    salt?: any;
    value?: BigNumber;
    gasLimit?: BigNumber;
    storageDepositLimit?: BigNumber;
    signer: never;
}
export declare type TransactionParams = (unknown | Partial<CallOverrides>)[];
export interface PopulatedTransaction extends Partial<SignerOptions> {
    callParams: CallParams;
    extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>;
}
export declare type ContractFunction<T = any> = (...args: TransactionParams) => Promise<T>;
export declare type BigNumber = BN | bigint | number | string;
export interface IContract {
    readonly address: AccountId;
    readonly abi: Abi;
    readonly signer: string;
    readonly api: ApiPromise;
    readonly functions: {
        [name: string]: ContractFunction;
    };
    readonly query: {
        [name: string]: ContractFunction<ContractCallOutcome>;
    };
    readonly tx: {
        [name: string]: ContractFunction<TransactionResponse>;
    };
    readonly estimateGas: {
        [name: string]: ContractFunction<BN>;
    };
    readonly populateTransaction: {
        [name: string]: ContractFunction<PopulatedTransaction>;
    };
    readonly [key: string]: ContractFunction<ContractCallOutcome> | ContractFunction<TransactionResponse> | any;
    gasLimit?: BigNumber;
    queryAt(at: string | Uint8Array, abi: AbiMessage): ContractFunction<ContractCallOutcome>;
    connect(signer: Signer | string): IContract;
    attach(address: string): IContract;
}
export interface ContractApiInterface {
    contract?: IContract;
    mnemonic?: string;
    signer: Signer;
    contractAddress: AccountId | string;
    abi: ContractAbi;
    network: Network;
    isReady(): Promise<void>;
    getContract(): Promise<IContract>;
    getSigner(): Promise<Signer>;
    changeSigner(mnemonic: string): Promise<Signer>;
    createAccountAndAddToKeyring(): [string, string];
    beforeCall<T>(contractMethodName: string, args: T[]): Promise<{
        encodedArgs: T[];
        signedContract: IContract;
    }>;
    contractTx<T>(contractMethodName: string, args: T[], value?: string | BigNumber): Promise<TransactionResponse>;
    contractQuery<T>(contractMethodName: string, args: T[], atBlock?: string | Uint8Array): Promise<AnyJson>;
    getContractMethod(contractMethodName: string): AbiMessage;
    getStorage<T>(key: string, decodingFn: (registry: Registry, data: Uint8Array) => T): Promise<T>;
}
//# sourceMappingURL=contract.d.ts.map