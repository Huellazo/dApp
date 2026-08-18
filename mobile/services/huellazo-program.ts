import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor'
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { Huellazo, IDL } from '@/idl'

export class HuellazoProgramService {
  // @ts-expect-error IDL is missing discriminator fields from anchor 0.30
  private program: Program<Huellazo>
  private connection: Connection

  constructor(connection: Connection) {
    this.connection = connection

    // Create read-only provider for queries
    const provider = new AnchorProvider(
      connection,
      {} as any, // Wallet not needed for read-only operations
      { commitment: 'confirmed' }
    )

    // @ts-expect-error IDL is missing discriminator fields from anchor 0.30
    this.program = new Program<Huellazo>(
      IDL as unknown as Huellazo,
      provider
    )
  }

  getConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.program.programId
    )
  }

  getPassportPDA(user: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('passport'), user.toBuffer()],
      this.program.programId
    )
  }

  getMerchantPDA(authority: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('merchant'), authority.toBuffer()],
      this.program.programId
    )
  }

  async buildInitializeConfigTx(admin: PublicKey): Promise<Transaction> {
    const [configPDA] = this.getConfigPDA()
    const instruction = await this.program.methods
      .initializeConfig()
      .accounts({
        config: configPDA,
        admin,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = new Transaction().add(instruction)
    tx.feePayer = admin
    return tx
  }

  async buildInitializePassportTx(user: PublicKey): Promise<Transaction> {
    const [passportPDA] = this.getPassportPDA(user)
    const [configPDA] = this.getConfigPDA()
    const instruction = await this.program.methods
      .initializePassport()
      .accounts({
        passport: passportPDA,
        user,
        config: configPDA,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = new Transaction().add(instruction)
    tx.feePayer = user
    return tx
  }

  async buildRegisterMerchantTx(admin: PublicKey, merchantAuthority: PublicKey, name: string, tier: number): Promise<Transaction> {
    const [merchantPDA] = this.getMerchantPDA(merchantAuthority)
    const [configPDA] = this.getConfigPDA()
    const instruction = await this.program.methods
      .registerMerchant(name, tier)
      .accounts({
        merchant: merchantPDA,
        merchantAuthority,
        config: configPDA,
        admin,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = new Transaction().add(instruction)
    tx.feePayer = admin
    return tx
  }

  async buildRecordVisitTx(authority: PublicKey, merchantAuthority: PublicKey, user: PublicKey, xp: number, points: number): Promise<Transaction> {
    const [passportPDA] = this.getPassportPDA(user)
    const [merchantPDA] = this.getMerchantPDA(merchantAuthority)
    const instruction = await this.program.methods
      .recordVisit(new BN(xp), new BN(points))
      .accounts({
        passport: passportPDA,
        merchant: merchantPDA,
        authority,
      })
      .instruction()

    const tx = new Transaction().add(instruction)
    tx.feePayer = authority
    return tx
  }

  async buildValidateEcoActionTx(authority: PublicKey, merchantAuthority: PublicKey, user: PublicKey, actionId: number): Promise<Transaction> {
    const [passportPDA] = this.getPassportPDA(user)
    const [merchantPDA] = this.getMerchantPDA(merchantAuthority)
    const instruction = await this.program.methods
      .validateEcoAction(actionId)
      .accounts({
        passport: passportPDA,
        merchant: merchantPDA,
        authority,
      })
      .instruction()

    const tx = new Transaction().add(instruction)
    tx.feePayer = authority
    return tx
  }

  async fetchPassport(passportPDA: PublicKey) {
    try {
      return await (this.program.account as any).passport.fetch(passportPDA)
    } catch (error) {
      console.error('Error fetching passport:', error)
      throw error
    }
  }

  async fetchMerchant(merchantPDA: PublicKey) {
    try {
      return await (this.program.account as any).merchant.fetch(merchantPDA)
    } catch (error) {
      console.error('Error fetching merchant:', error)
      throw error
    }
  }
}
