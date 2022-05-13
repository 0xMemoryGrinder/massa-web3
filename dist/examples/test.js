"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ClientFactory_1 = require("../web3/ClientFactory");
//const ecc= require('tiny-secp256k1')
const bip39 = require("bip39");
const crypto = require("crypto");
const baseAccount = {
    publicKey: "5Jwx18K2JXacFoZcPmTWKFgdG1mSdkpBAUnwiyEqsVP9LKyNxR",
    privateKey: "2SPTTLK6Vgk5zmZEkokqC3wgpKgKpyV5Pu3uncEGawoGyd4yzC",
    address: "9mvJfA4761u1qT8QwSWcJ4gTDaFP5iSgjQzKMaqTbrWCFo1QM",
    randomEntropy: null
};
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        // init client
        const web3Client = ClientFactory_1.ClientFactory.createDefaultClient(ClientFactory_1.DefaultProviderUrls.LABNET, true);
        web3Client.vault().init();
        web3Client.vault().setPassword("supersecret");
        console.log("EXPORTED VAULT ", web3Client.vault().exportVault());
        const encrypted = yield web3Client.vault().encryptVault();
        //const encrypted = await Aes.encrypt("This is a secret message", "password");
        console.log("ENCRYPTED VAULT ", encrypted);
        const decrypted = yield web3Client.vault().decryptVault(encrypted);
        //const decrypted = await Aes.decrypt(encrypted, "password");
        console.log("DECRYPTED VAULT ", decrypted);
        //await web3Client.vault().recoverVault(web3Client.vault().exportVault().mnemonic);
        //console.log("RECOVERED VAULT ", web3Client.vault().exportVault());
        // init the vault
        /*
        web3Client.vault().setPassword("supersecret");
        web3Client.vault().init();
        console.log("EXPORTED VAULT ", web3Client.vault().exportVault());
        const encrypted = await web3Client.vault().encryptVault();
        console.log("ENCRYPTED VAULT ", encrypted);

        const decrypted = await web3Client.vault().decryptVault(encrypted);
        console.log("DECRYPTED VAULT ", decrypted);
        */
        /*
        const newAccount = WalletClient.walletGenerateNewAccount();
        const pubKey = base58checkDecode(newAccount.publicKey);
        console.log("NEW ACCOUNT ", newAccount, pubKey);

        const address = hashSha256(pubKey);
        const addressBase58Encoded: string = base58checkEncode(address);
        console.log("XXXXXXXXXXXX ", addressBase58Encoded);
        */
        /*
        const hex = Buffer.from('hellotherekaksitipofdfdopfodpty5', 'utf8').toString('hex');
        console.log("hex ", hex);
        const mnemonic = bip39.entropyToMnemonic(hex);
        console.log("mnemonic ", mnemonic);
        const entropy = bip39.mnemonicToEntropy(mnemonic);
        console.log("entropy ", entropy);
        */
        /*
        const randomEntropy: Uint8Array = secp.utils.randomBytes(32);
        //const randomEntropy: Buffer = crypto.randomBytes(32);
        console.log("randomEntropy ", randomEntropy);

        const privateKey: Uint8Array = secp.utils.hashToPrivateKey(randomEntropy);
        console.log("private key ", privateKey);

        //const publicKey = ecc.pointFromScalar(privateKey, true);
        //console.log("public key ", publicKey);
        const publicKey2 = secp.getPublicKey(privateKey, true);
        console.log("public key 2", publicKey2);
        */
    }
    catch (ex) {
        console.error("Error = ", ex.message);
    }
}))();
//# sourceMappingURL=test.js.map