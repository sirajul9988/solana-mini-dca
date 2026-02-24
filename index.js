const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const fetch = require('node-fetch');
const bs58 = require('bs58');
const config = require('./config');

const connection = new Connection(config.RPC_URL);
const wallet = Keypair.fromSecretKey(bs58.decode(config.PRIVATE_KEY));

async function performSwap() {
    try {
        console.log("--- Initializing Swap ---");

        // 1. Get Quote from Jupiter
        const quoteResponse = await fetch(
            `https://quote-api.jup.ag/v6/quote?inputMint=${config.SOL_MINT}&outputMint=${config.USDC_MINT}&amount=${config.AMOUNT_SOL * 1e9}&slippageBps=50`
        ).then(res => res.json());

        if (quoteResponse.error) throw new Error(quoteResponse.error);

        // 2. Get Serialized Transaction
        const { swapTransaction } = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: wallet.publicKey.toString(),
                wrapAndUnwrapSol: true,
            })
        }).then(res => res.json());

        // 3. Deserialize and Sign
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        transaction.sign([wallet]);

        // 4. Execute Transaction
        const txid = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true,
            maxRetries: 2
        });

        console.log(`Success! Transaction ID: https://solscan.io/tx/${txid}`);
    } catch (error) {
        console.error("Swap failed:", error.message);
    }
}

// Start the DCA Loop
console.log(`DCA Started: Swapping ${config.AMOUNT_SOL} SOL every ${config.INTERVAL_MS / 60000} minutes.`);
performSwap();
setInterval(performSwap, config.INTERVAL_MS);
