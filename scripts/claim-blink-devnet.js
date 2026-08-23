/**
 * Script Autónomo Cliente para Ejecutar Solana Blinks en Devnet
 * Permite simular y ejecutar Blinks/Reclamos de Estampas directamente en Solana Devnet sin servidor backend.
 */

const { Connection, PublicKey, Transaction, TransactionInstruction } = require('@solana/web3.js');

const DEVNET_RPC = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ');

async function main() {
  console.log('================================================================');
  console.log('☀️ EJECUTOR CLIENTE AUTÓNOMO DE SOLANA BLINKS (DEVNET) ☀️');
  console.log('================================================================\n');

  const connection = new Connection(DEVNET_RPC, 'confirmed');

  // Parámetros de prueba
  const poiId = 'cerro_minas';
  const sampleWallet = new PublicKey('KLVFn69o3w9pvKNsza3YJtyszf8e1E5GCDByxeRhVzg');
  const metadataUri = 'https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/cerro_minas.json';

  console.log(`📍 Poi ID: ${poiId}`);
  console.log(`👤 Wallet Target: ${sampleWallet.toBase58()}`);
  console.log(`📄 Metadata URI: ${metadataUri}\n`);

  console.log('🔍 Conectando con Solana Devnet RPC...');
  const slot = await connection.getSlot();
  console.log(`✅ Conectado a Devnet. Slot actual: ${slot}`);

  const blockhash = await connection.getLatestBlockhash();
  console.log(`🔑 Úlitmo Blockhash: ${blockhash.blockhash}`);

  // Discriminador de Anchor para mint_place: [19, 137, 245, 118, 149, 108, 12, 60]
  const discriminator = Buffer.from([19, 137, 245, 118, 149, 108, 12, 60]);
  const tokenIdBuf = Buffer.alloc(8);
  tokenIdBuf.writeBigUInt64LE(BigInt(101));

  const uriBytes = Buffer.from(metadataUri, 'utf-8');
  const uriLenBuf = Buffer.alloc(4);
  uriLenBuf.writeUInt32LE(uriBytes.length);

  const latBuf = Buffer.alloc(8);
  latBuf.writeDoubleLE(17.8071);

  const lngBuf = Buffer.alloc(8);
  lngBuf.writeDoubleLE(-97.7762);

  const typeBuf = Buffer.from([0]);

  const ixData = Buffer.concat([discriminator, tokenIdBuf, uriLenBuf, uriBytes, latBuf, lngBuf, typeBuf]);

  // PDAs
  const [configPda] = PublicKey.findProgramAddressSync([Buffer.from('config')], PROGRAM_ID);
  const [poapPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('poap'), sampleWallet.toBuffer(), tokenIdBuf],
    PROGRAM_ID
  );

  const instruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: sampleWallet, isSigner: true, isWritable: true },
      { pubkey: configPda, isSigner: false, isWritable: true },
      { pubkey: poapPda, isSigner: false, isWritable: true },
      { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false },
    ],
    data: ixData,
  });

  const tx = new Transaction({
    recentBlockhash: blockhash.blockhash,
    feePayer: sampleWallet,
  }).add(instruction);

  const serialized = tx.serialize({ requireAllSignatures: false });
  const base64Tx = serialized.toString('base64');

  console.log('\n✨ Transacción de Solana Action generada con éxito (100% Client-Side):');
  console.log(`📦 Transacción Base64 (${base64Tx.length} bytes):`);
  console.log(`${base64Tx.slice(0, 80)}...`);
  console.log('\n✅ ¡Listo! Esta transacción se firma directamente en el móvil o wallet de Solana.');
}

main().catch(console.error);
