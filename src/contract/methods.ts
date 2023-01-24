import { TransactionResponse } from '../types/index'
import { ProsopoContractApi } from './interface'
import {
    CaptchaData,
    DappAccounts,
    ProsopoCaptchaSolutionCommitment,
    ProsopoCaptchaStatus,
    ProsopoDapp,
    ProsopoLastCorrectCaptcha,
    ProsopoPayee,
    ProsopoProvider,
    ProsopoRandomProvider,
} from '../interfaces/index'
import { Vec, u128 } from '@polkadot/types-codec'
import { AccountId } from '@polkadot/types/interfaces'
import { BN, hexToU8a } from '@polkadot/util'

export class ProsopoContractMethods extends ProsopoContractApi {
    // transactions

    public async providerRegister(
        serviceOrigin: string,
        fee: number,
        payee: ProsopoPayee,
        address: string
    ): Promise<TransactionResponse> {
        return await this.contractTx('providerRegister', [serviceOrigin, fee, payee, address])
    }

    async providerUpdate(
        serviceOrigin: string,
        fee: number,
        payee: ProsopoPayee,
        address: string,
        value?: number | BN | undefined
    ): Promise<TransactionResponse> {
        return await this.contractTx('providerUpdate', [serviceOrigin, fee, payee, address], value)
    }

    public async providerDeregister(address: string): Promise<TransactionResponse> {
        return await this.contractTx('providerDeregister', [address])
    }

    public async providerUnstake(value: number | BN | undefined): Promise<TransactionResponse> {
        return await this.contractTx('providerUnstake', [], value)
    }

    public async providerAddDataset(datasetId: string, datasetContentId: string): Promise<TransactionResponse> {
        return await this.contractTx('providerAddDataset', [hexToU8a(datasetId), hexToU8a(datasetContentId)])
    }

    public async dappRegister(
        dappServiceOrigin: string,
        dappContractAddress: string,
        dappOwner?: string
    ): Promise<TransactionResponse> {
        return await this.contractTx('dappRegister', [dappServiceOrigin, dappContractAddress, dappOwner])
    }

    public async dappFund(contractAccount: string, value?: number | BN | undefined): Promise<TransactionResponse> {
        return await this.contractTx('dappFund', [contractAccount], value)
    }

    public async dappCancel(contractAccount: string): Promise<TransactionResponse> {
        return await this.contractTx('dappCancel', [contractAccount])
    }

    public async dappUserCommit(
        contractAccount: string,
        captchaDatasetId: string,
        userMerkleTreeRoot: string,
        providerAddress: string,
        dappUserAddress: string,
        status?: ProsopoCaptchaStatus
    ): Promise<TransactionResponse> {
        return await this.contractTx('dappUserCommit', [
            contractAccount,
            captchaDatasetId,
            userMerkleTreeRoot,
            providerAddress,
            dappUserAddress,
            status,
        ])
    }

    public async providerApprove(captchaSolutionCommitmentId, refundFee): Promise<TransactionResponse> {
        return await this.contractTx('providerApprove', [captchaSolutionCommitmentId, refundFee])
    }

    public async providerDisapprove(captchaSolutionCommitmentId): Promise<TransactionResponse> {
        return await this.contractTx('providerDisapprove', [captchaSolutionCommitmentId])
    }

    //queries

    public async getDappOperatorIsHumanUser(userAccount: string, solutionThreshold: number): Promise<boolean> {
        const { result } = await this.contractQuery('dappOperatorIsHumanUser', [userAccount, solutionThreshold])
        return this.abi.registry.createType('bool', result.asOk.data.toU8a(true)).isTrue
    }

    public async getRandomProvider(
        userAccount: string,
        dappContractAccount: string,
        at?: string | Uint8Array
    ): Promise<ProsopoRandomProvider> {
        const response = await this.contractQuery(
            'getRandomActiveProvider',
            [userAccount, dappContractAccount],
            undefined,
            at
        )
        // @ts-ignore
        return response.output?.asOk.asOk.toPrimitive() as unknown as ProsopoRandomProvider
    }

    public async getProviderDetails(accountId: string): Promise<ProsopoProvider> {
        const response = await this.contractQuery('getProviderDetails', [accountId])
        // Type is Result<Result<ProsopoProvider, ProsopoError>, InkPrimitivesLangError>
        // const fragment = this.getContractMethod('getProviderDetails')
        // console.log(fragment.typeDef.type)
        // ts-ignore could be removed by explicitly creating the type using the registry
        // @ts-ignore
        return response.output?.asOk.asOk.toPrimitive() as ProsopoProvider
    }

    public async getDappDetails(accountId: string): Promise<ProsopoDapp> {
        const response = await this.contractQuery('getDappDetails', [accountId])
        // @ts-ignore
        return response.output?.asOk.asOk.toPrimitive() as unknown as ProsopoDapp
    }

    public async getCaptchaData(captchaDatasetId: string): Promise<CaptchaData> {
        const response = await this.contractQuery('getCaptchaData', [captchaDatasetId])
        // @ts-ignore
        return response.output?.asOk.asOk.toPrimitive() as unknown as CaptchaData
    }

    public async getCaptchaSolutionCommitment(solutionId: string): Promise<ProsopoCaptchaSolutionCommitment> {
        const { result } = await this.contractQuery('getCaptchaSolutionCommitment', [solutionId])
        const fragment = this.getContractMethod('getCaptchaSolutionCommitment')
        // @ts-ignore
        return this.abi.registry.createType(fragment.returnType?.type, result.asOk.data).asOk.asOk.toPrimitive()
    }

    public async getDappOperatorLastCorrectCaptcha(accountId: string): Promise<ProsopoLastCorrectCaptcha> {
        const { result } = await this.contractQuery('dappOperatorLastCorrectCaptcha', [accountId])
        const fragment = this.getContractMethod('dappOperatorLastCorrectCaptcha')
        // @ts-ignore
        return this.abi.registry.createType(fragment.returnType?.type, result.asOk.data).asOk.asOk.toPrimitive()
    }

    public async getProviderStakeDefault(): Promise<u128> {
        const { result } = await this.contractQuery('getProviderStakeDefault', [])
        const fragment = this.getContractMethod('getProviderStakeDefault')
        // @ts-ignore
        return result.asOk.data.registry.createType(fragment.returnType?.type, result.asOk.data).asOk
    }

    public async getProviderAccounts(): Promise<Vec<AccountId>> {
        const { result } = await this.contractQuery('getAllProviderIds', [])
        const fragment = this.getContractMethod('getAllProviderIds')
        // @ts-ignore
        return result.asOk.data.registry.createType(fragment.returnType?.type, result.asOk.data).asOk
    }

    public async getDappAccounts(): Promise<DappAccounts> {
        return await this.getStorage<DappAccounts>('dapp_accounts', 'DappAccounts')
    }
}
