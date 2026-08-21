# Guía para Alojar Metadatos e Imágenes de NFTs en GitHub (Devnet)

Para que tus NFTs (cNFTs) se visualicen correctamente en wallets como **Solflare** y **Phantom** en Solana Devnet, los archivos de metadatos JSON y las imágenes deben estar accesibles públicamente vía HTTP/HTTPS.

---

## 📁 Estructura Generada en tu Proyecto

Los archivos `.json` con el formato estándar de Metaplex ya están generados en tu dApp dentro de:
`mobile/assets/metadata/`

```
mobile/assets/
├── images/
│   ├── nfts/
│   │   ├── nft_jaguarcito_nuiñe.png
│   │   ├── nft_sol_mixteca.png
│   │   ├── nft_jarabe_mixteco.png
│   │   └── nft_guaje_oro.png
│   └── huajuapan/
│       ├── huajuapan_catedral.png
│       ├── huajuapan_cerro_minas.png
│       ├── huajuapan_mirador_yukunitza.png
│       ├── huajuapan_cafe_petirrojo.png
│       ├── huajuapan_casa_humo.png
│       └── huajuapan_fonda_julita.png
└── metadata/
    ├── jaguarcito_nuine.json
    ├── sol_mixteca.json
    ├── jarabe_mixteco.json
    ├── guaje_oro.json
    ├── catedral_huajuapan.json
    ├── cerro_minas.json
    ├── mirador_yukunitza.json
    ├── cafe_petirrojo.json
    ├── casa_humo.json
    └── fonda_julita.json
```

---

## 🚀 Pasos para Subir y Obtener las URLs de GitHub

1. **Subir los cambios a tu repositorio público de GitHub**:
   ```bash
   git add mobile/assets/metadata
   git commit -m "feat: añadir metadatos JSON estándar de Metaplex para cNFTs"
   git push origin main
   ```

2. **Obtener el Enlace Raw (Directo)**:
   Entra a tu repositorio en GitHub y abre cualquier archivo JSON en `mobile/assets/metadata/jaguarcito_nuine.json`.
   Haz clic en el botón **"Raw"**. El enlace tendrá este formato:
   `https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/jaguarcito_nuine.json`

3. **Utilizar la URI en la minting service de la dApp**:
   Pasa esa URL como el argumento `uri` al mintear el cNFT con `useHuellazoCnft` o `cnft-service.ts`.
