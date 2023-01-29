import { Component } from '@angular/core';
import { ApiPromise as SubstrateApi } from '@polkadot/api';
import { ApiTypes } from '@polkadot/api/types';
import { IpfsContent } from '@subsocial/types/substrate/classes'
import { waitReady } from '@polkadot/wasm-crypto'
import { SubsocialApi } from '@subsocial/api';

import { web3Enable, isWeb3Injected, web3FromAddress, web3Accounts } from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/keyring';

const CONFIG = {
  substrateNodeUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent {
  constructor() {}

  async signAndSendTx (tx: any, accountId: string, callback?: (result: any) => void) {
    const accounts = await this.getAllAccounts()

   // const addresses = accounts.map((account) => account.address)

  //  const containsAddress = addresses.includes(accountId)
  //   if (!containsAddress) {
  //     throw Error('Address not found on Polkadot.js extension.')
  //   }

    const { signer } = await web3FromAddress(accountId)
    await tx.signAsync(accountId, { signer })

    await tx.send(callback)
  }

  async getAllAccounts() {
    const injectedExtensions = await web3Enable('pd-blog')

    if (!isWeb3Injected) {
      throw Error(`Browser does not have any polkadot.js extension`)
    }

    if (!injectedExtensions.length) {
      throw Error(`Polkadot Extension has not authorized us to get accounts`)
    }

    return await web3Accounts()
  }

  async logTransaction(result: any) {
    const { status } = result;

    if (!result || !status) {
      return;
    }

    if (status.isFinalized || status.isInBlock) {
      const blockHash = status.isFinalized
        ? status.asFinalized
        : status.asInBlock;

      console.log(`✅ Tx finalized. Block hash: ${blockHash.toString()}`)
    } else if (result.isError) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`⏱ Current tx status: ${status.type}`)
    }
  }

  async createSpace() {
    // wait initialize wasm.
    await waitReady()
    const api = await SubsocialApi.create(CONFIG)

    const substrateApi = await api.substrateApi as SubstrateApi //as SubsocialSubstrateApi
    const ipfs = api.ipfs

    // create content object on IPFS and get CID.
    // const ipfsImageCid = await ipfs.saveFile(file)

    const authHeader = 'c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi';

    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + authHeader,
    });

    const cid = await ipfs.saveContent({
      about: 'test pd_blog',
      //image: ipfsImageCid,
      name: 'test pd_blog',
      tags: ['test pd_blog'],
    })

    /* Creating a transaction for the createSpace method.
     createSpace(
      content: string or IPFS CID or any other (required),
      permissions: optional
     )
    */
    const tx = substrateApi.tx.spaces.createSpace(
      IpfsContent(cid),
      null
    )

    // Add the selected account address, to get all connected accounts
    // use the [getAllAccounts] method.
    const accounts = await this.getAllAccounts()

    // Signing the transaction and sending for execution.
    // const keyring = new Keyring();
    // const encoded = keyring.encodeAddress(accounts[0].address, 28);

    await this.signAndSendTx(tx, accounts[0].address, this.logTransaction)
  }
}
