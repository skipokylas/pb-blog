import { Component } from '@angular/core';
import { web3Enable, web3AccountsSubscribe, isWeb3Injected } from '@polkadot/extension-dapp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent {
  isWeb3Injected: boolean | undefined;

  constructor() {}

  async connectWallet() {
    const allInjected = await web3Enable('pd-blog');
    if (!isWeb3Injected) {
      alert('Please install wallet');
    } else {
      await web3AccountsSubscribe(console.log);
    }
  }
}
