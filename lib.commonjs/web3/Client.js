"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.getWsProvider = void 0;
const PrivateApiClient_1 = require("./PrivateApiClient");
const PublicApiClient_1 = require("./PublicApiClient");
const WalletClient_1 = require("./WalletClient");
const SmartContractsClient_1 = require("./SmartContractsClient");
const IProvider_1 = require("../interfaces/IProvider");
const ClientFactory_1 = require("./ClientFactory");
const WsSubscriptionClient_1 = require("./WsSubscriptionClient");
const getWsProvider = (provider) => {
    let wsProvider;
    switch (provider) {
        case ClientFactory_1.DefaultProviderUrls.LABNET: {
            wsProvider = ClientFactory_1.DefaultWsProviderUrls.LABNET;
            break;
        }
        case ClientFactory_1.DefaultProviderUrls.MAINNET: {
            wsProvider = ClientFactory_1.DefaultWsProviderUrls.MAINNET;
            break;
        }
        case ClientFactory_1.DefaultProviderUrls.LOCALNET: {
            wsProvider = ClientFactory_1.DefaultWsProviderUrls.LOCALNET;
            break;
        }
        case ClientFactory_1.DefaultProviderUrls.TESTNET: {
            wsProvider = ClientFactory_1.DefaultWsProviderUrls.TESTNET;
            break;
        }
        default: {
            wsProvider = ClientFactory_1.DefaultWsProviderUrls.LOCALNET;
        }
    }
    return wsProvider;
};
exports.getWsProvider = getWsProvider;
/** Massa Web3 Client wrapping all public, private, wallet and smart-contracts-related functionalities */
class Client {
    clientConfig;
    publicApiClient;
    privateApiClient;
    walletClient;
    smartContractsClient;
    wsSubscriptionClient;
    constructor(clientConfig, baseAccount) {
        this.clientConfig = clientConfig;
        this.publicApiClient = new PublicApiClient_1.PublicApiClient(clientConfig);
        this.privateApiClient = new PrivateApiClient_1.PrivateApiClient(clientConfig);
        this.walletClient = new WalletClient_1.WalletClient(clientConfig, this.publicApiClient, baseAccount);
        this.smartContractsClient = new SmartContractsClient_1.SmartContractsClient(clientConfig, this.publicApiClient, this.walletClient);
        if (clientConfig.providers.find((provider) => provider.type === IProvider_1.ProviderType.WS)) {
            this.wsSubscriptionClient = new WsSubscriptionClient_1.WsSubscriptionClient(clientConfig);
        }
        // subclients
        this.privateApi = this.privateApi.bind(this);
        this.publicApi = this.publicApi.bind(this);
        this.wallet = this.wallet.bind(this);
        this.smartContracts = this.smartContracts.bind(this);
        this.ws = this.ws.bind(this);
        // setters
        this.setCustomProviders = this.setCustomProviders.bind(this);
        this.setNewDefaultProvider = this.setNewDefaultProvider.bind(this);
        // getters
        this.getProviders = this.getProviders.bind(this);
        this.getPrivateProviders = this.getPrivateProviders.bind(this);
        this.getPublicProviders = this.getPublicProviders.bind(this);
    }
    /** Private Api related RPC methods */
    privateApi() {
        return this.privateApiClient;
    }
    /** Public Api related RPC methods */
    publicApi() {
        return this.publicApiClient;
    }
    /** Wallet related methods */
    wallet() {
        return this.walletClient;
    }
    /** Smart Contracts related methods */
    smartContracts() {
        return this.smartContractsClient;
    }
    /** Websocket RPC methods */
    ws() {
        return this.wsSubscriptionClient;
    }
    /** set new providers */
    setCustomProviders(providers) {
        this.publicApiClient.setProviders(providers);
        this.privateApiClient.setProviders(providers);
        this.walletClient.setProviders(providers);
        this.smartContractsClient.setProviders(providers);
        this.wsSubscriptionClient.setProviders(providers);
    }
    /** get currently set providers */
    getProviders() {
        return this.clientConfig.providers;
    }
    /** return all private providers */
    getPrivateProviders() {
        return this.clientConfig.providers.filter((provider) => provider.type === IProvider_1.ProviderType.PRIVATE);
    }
    /** return all public providers */
    getPublicProviders() {
        return this.clientConfig.providers.filter((provider) => provider.type === IProvider_1.ProviderType.PUBLIC);
    }
    /** sets a new default json rpc provider */
    setNewDefaultProvider(provider) {
        const providers = [
            {
                url: provider,
                type: IProvider_1.ProviderType.PUBLIC,
            },
            {
                url: provider,
                type: IProvider_1.ProviderType.PRIVATE,
            },
            {
                url: (0, exports.getWsProvider)(provider),
                type: IProvider_1.ProviderType.WS,
            },
        ];
        this.publicApiClient.setProviders(providers);
        this.privateApiClient.setProviders(providers);
        this.walletClient.setProviders(providers);
        this.smartContractsClient.setProviders(providers);
        this.wsSubscriptionClient.setProviders(providers);
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map