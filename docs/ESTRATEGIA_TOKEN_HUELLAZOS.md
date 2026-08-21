# Estrategia de Tokenómica: Puntos Huellazos ($HZ) como Criptomoneda SPL Token 🌿

Esta guía analiza la conveniencia del modelo de **Puntos Huellazos ($HZ)** y explica paso a paso cómo convertirlos en un **Token Fungible SPL nativo en la red de Solana**.

---

## ⚖️ 1. Análisis de Conveniencia: ¿Conviene hacerlo o dejarlo como saldo de lealtad?

### 🎯 La Mejor Práctica: Modelo Híbrido (Invisible Crypto UX)
Para garantizar el éxito con el usuario masivo (turistas y pequeños comerciantes en Huajuapan), la estrategia recomendada por los estándares de Web3 Mobile es el **Modelo Híbrido**:

| Capa | En la Interfaz de la App (UX) | En la Blockchain de Solana (On-Chain) |
| :--- | :--- | :--- |
| **Concepto** | **Puntos Huellazos ($HZ)** | **SPL Token Nivel 2022 (`$HUELLA`)** |
| **Beneficio** | Fácil de entender, sin comisiones visibles, sin miedo a volatilidad. | Verificable, transferible entre usuarios, integrable en DEXs (Jupiter / Raydium). |

---

## 🛠️ 2. ¿Cómo se implementa el Token $HZ en Solana?

Para convertir los Puntos Huellazos en un Token Cripto real en Solana, se utilizan los siguientes 3 pasos:

### Paso 1: Creación del SPL Token Mint
En Solana se crea una cuenta **Token Mint** con 6 decimales para representar `$HZ`. El monorepo incluye el script automatizado:

```bash
# Executing SPL Token Mint deployment script on Devnet
npm run create-token
```
- **Script Source**: [scripts/create-spl-token.js](file:///home/m4r10/Documents/projects/dApp/scripts/create-spl-token.js)
- **Persistent Keypair**: [scripts/payer-keypair.json](file:///home/m4r10/Documents/projects/dApp/scripts/payer-keypair.json)
- **Auto-Update**: Actualiza dinámicamente `HUELLAZO_TOKEN_MINT` en [mobile/services/solana-program.ts](file:///home/m4r10/Documents/projects/dApp/mobile/services/solana-program.ts).

---

### Paso 2: Minteo Automático desde el Smart Contract Anchor (`/anchor`)
El contrato de Rust ([anchor/programs/huellazo/src/lib.rs](file:///home/m4r10/Documents/projects/dApp/anchor/programs/huellazo/src/lib.rs)) toma la autoridad del mint mediante una PDA y ejecuta invocaciones cruzadas (CPI) a `@solana/spl-token`:

```rust
// Invocación CPI para mintear $HZ a la wallet del turista al escanear un lugar
pub fn handle_mint_reward(ctx: Context<MintReward>, amount: u64) -> Result<()> {
    let cpi_accounts = anchor_spl::token::MintTo {
        mint: ctx.accounts.token_mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.config.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    anchor_spl::token::mint_to(cpi_ctx, amount)?;
    Ok(())
}
```

---

### Paso 3: Quemado (`Burn`) de Tokens al Comprar en Comercios
Cuando el usuario consume un platillo en un restaurante o canjea una oferta, el contrato ejecuta la instrucción de quemado (`burn`), reduciendo la oferta total de `$HZ` y creando una **economía deflacionaria**:

```rust
// Quemado de $HZ al consumir en un negocio aliado
pub fn handle_burn_payment(ctx: Context<BurnPayment>, amount: u64) -> Result<()> {
    let cpi_accounts = anchor_spl::token::Burn {
        mint: ctx.accounts.token_mint.to_account_info(),
        from: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    
    anchor_spl::token::burn(cpi_ctx, amount)?;
    Ok(())
}
```

---

## 📊 3. Ventajas del Modelo Cripto SPL Token

1. **Intercambiabilidad Global**:
   Los Puntos `$HZ` obtenidos explorando Oaxaca pueden cambiarse por SOL o USDC en exchanges como **Jupiter** o **Raydium**.
2. **Regalías e Incentivos a Comercios**:
   Los comerciantes que reciben `$HZ` pueden mantenerlos para obtener rendimientos (*staking*) o cambiarlos por moneda local al instante.
3. **Transparencia Inmutable**:
   Cualquier explorador puede verificar en **Solscan** la cantidad total de Huellazos emitidos y quemados en la red.
