import { ethers } from 'ethers';

export declare global {
  declare module '*.module.less' {
    const content: { [key: string]: string };
    export = content;
  }
  interface EthereumProvider extends ethers.providers.Provider {
    chainId: string;
    enable: () => Promise<unknown>;
    request: (args: RequestArguments) => Promise<unknown>;
  }

  interface Window {
    ethereum: EthereumProvider;
    soljsonReleases: {
      [key: string]: string;
    };
  }
}
