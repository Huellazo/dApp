const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint } = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

const KEYPAIR_PATH = path.join(__dirname, 'payer-keypair.json');

function getOrCreateKeypair() {
  if (fs.existsSync(KEYPAIR_PATH)) {
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8')));
    return Keypair.fromSecretKey(secretKey);
  }
  const keypair = Keypair.generate();
  fs.writeFileSync(KEYPAIR_PATH, JSON.stringify(Array.from(keypair.secretKey)), 'utf8');
  return keypair;
}

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const payer = getOrCreateKeypair();
  const payerAddress = payer.publicKey.toBase58();

  console.log(`🌐 Solana Devnet RPC Endpoint: https://api.devnet.solana.com`);
  console.log(`🔑 Persistent Deployer Keypair Address: ${payerAddress}`);

  const balance = await connection.getBalance(payer.publicKey);
  console.log(`💰 Current Balance: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);

  if (balance < 0.01 * LAMPORTS_PER_SOL) {
    console.log('⛽ Requesting SOL Airdrop on Devnet...');
    try {
      const airdropSig = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: airdropSig,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');
      console.log('✅ 1 SOL Airdrop confirmed!');
    } catch (err) {
      console.log('\n⚠️ Public Devnet RPC Airdrop rate limited (HTTP 429).');
      console.log(`💡 Request test SOL by pasting address ${payerAddress} into https://faucet.solana.com or running 'solana airdrop 1 ${payerAddress}'`);
      if (balance === 0) return;
    }
  }

  console.log('🪙 Creating $HZ SPL Token Mint (decimals: 6)...');
  try {
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      6                // decimals
    );

    const mintAddress = mint.toBase58();
    console.log('\n====================================================');
    console.log('🎉 SUCCESS! $HZ SPL Token Mint created on Solana Devnet:');
    console.log(`Token Mint Address: ${mintAddress}`);
    console.log('====================================================\n');

    // Auto-update mobile/services/solana-program.ts
    const targetFile = path.join(__dirname, '..', 'mobile', 'services', 'solana-program.ts');
    if (fs.existsSync(targetFile)) {
      let content = fs.readFileSync(targetFile, 'utf8');
      content = content.replace(
        /export const HUELLAZO_TOKEN_MINT = new PublicKey\('[^']+'\);/,
        `export const HUELLAZO_TOKEN_MINT = new PublicKey('${mintAddress}');`
      );
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log(`📝 Automatically updated ${targetFile} with the new Token Mint Address!`);
    }
  } catch (err) {
    console.log('❌ Error creating Token Mint:', err.message);
  }
}

main();
