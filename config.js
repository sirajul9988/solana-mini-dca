// CONFIGURATION SETTINGS
module.exports = {
    // The RPC endpoint to connect to Solana
    RPC_URL: "https://api.mainnet-beta.solana.com",
    
    // Your Wallet Private Key (Base58 encoded)
    // IMPORTANT: Use environment variables for production
    PRIVATE_KEY: "YOUR_PRIVATE_KEY_HERE",
    
    // Token Mints
    SOL_MINT: "So11111111111111111111111111111111111111112",
    USDC_MINT: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    
    // DCA Settings
    AMOUNT_SOL: 0.1, // Amount of SOL to swap each time
    INTERVAL_MS: 3600000 // Time between swaps in milliseconds (e.g., 1 hour)
};
