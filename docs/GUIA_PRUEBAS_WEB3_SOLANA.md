# 🚀 Manual de Pruebas Web3 & Ecosistema Solana — Huellazo dApp

Guía completa y paso a paso para probar las funcionalidades descentralizadas de la plataforma **Huellazo** en la red **Solana Devnet**, abarcando el **Escáner Inteligente QR**, la recolección de estampas cNFT, pagos en comercios con **Solana Pay**, interacción con **Solana Actions & Blinks**, y el **Intercambio P2P de Estampas con Animación Estilo Pokémon Trade**.

---

## 📋 Tabla de Contenidos
1. [Configuración de Monedero (Phantom / Solflare)](#1-configuración-de-monedero-phantom--solflare)
2. [Escáner Inteligente QR Único y Motor de Enrutamiento](#2-escáner-inteligente-qr-único-y-motor-de-enrutamiento)
3. [Recolección de Estampas y Minting de cNFTs](#3-recolección-de-estampas-y-minting-de-cnfts)
4. [Pagos en Comercios Locales con Solana Pay](#4-pagos-en-comercios-locales-con-solana-pay)
5. [Solana Actions & Blinks (Piñata Interactiva y QR)](#5-solana-actions--blinks-piñata-interactiva-y-qr)
6. [Intercambio P2P de Estampas (Animación Estilo Pokémon Trade)](#6-intercambio-p2p-de-estampas-animación-estilo-pokémon-trade)
7. [Pruebas de Ubicación GPS y Mapas 3D / 2D](#7-pruebas-de-ubicación-gps-y-mapas-3d--2d)
8. [Verificación On-Chain en Solscan / Solana Explorer](#8-verificación-on-chain-en-solscan--solana-explorer)

---

## 1. Configuración de Monedero (Phantom / Solflare)

### Requisitos:
- Tener instalada la extensión de navegador **Solflare** o **Phantom** (en escritorio o móvil).
- Cambiar la red del monedero a **Solana Devnet**.

### Pasos para Conectar:
1. Abre la aplicación en tu navegador web o cliente móvil: `http://localhost:8081` o la URL de despliegue en Vercel.
2. Haz clic en el botón **"Conectar Monedero"** en la esquina superior derecha o en la pantalla de bienvenida.
3. Elige tu monedero de preferencia (**Solflare** o **Phantom**).
4. Aprueba la solicitud de conexión en la ventana emergente de la extensión.
5. **Persistencia Automática**: Tu selección de monedero se guarda automáticamente (`huellazo_selected_wallet`). Todas las transacciones y mints posteriores utilizarán directamente el monedero que hayas seleccionado sin solicitar reconexión.

---

## 2. Escáner Inteligente QR Único y Motor de Enrutamiento

En la pantalla **Scan** (`/scan`), se ha unificado la experiencia en un **único botón principal estilo Neo-Brutalista: `📷 ESCANEAR CÓDIGO QR`**.

### Opciones del Escáner Universal:
Al presionar el botón, se abre el modal del **Escáner Universal QR** ofreciendo tres alternativas:
1. 📸 **Cámara en Vivo**: Abre el visor en tiempo real para leer códigos QR físicos.
2. 🖼️ **Subir Imagen de Galería**: Carga cualquier captura o fotografía guardada con un código QR desde tu dispositivo.
3. ⚡ **Demostración Rápida (`./qrcodes`)**: Accesos directos categorizados con los QRs reales incluidos en el proyecto (`./qrcodes`):
   - **Solana Pay**: Café Petirrojo (`0.035 SOL`), Casa del Humo (`0.085 SOL`), Fonda Julita (`0.045 SOL`).
   - **cNFTs y Blinks**: Piñata Blink Petirrojo, Cerro de las Minas, Catedral, Yukunitza, etc.

### Motor de Detección e Interpretación Automática (`handleProcessQrCode`):
Sin importar cómo ingreses el código QR (cámara, imagen o demostración), el motor detecta automáticamente la categoría del QR y lo enruta de forma transparente:
- **Si es Solana Pay (`solana:...`)** ➡️ Redirige a `SolanaPayModal` con conversión SOL/MXN y solicita firma on-chain.
- **Si es Solana Action / Blink (`solana-action:`, `dial.to`)** ➡️ Otorga los puntos de la Piñata Blink (`+100 $HZ`) y abre `StickerClaimAnimation`.
- **Si es Reclamo de Estampa / POI (`huellazo:place`, `id=poi`)** ➡️ Minta el cNFT en Solana Devnet y abre `StickerClaimAnimation`.
- **Si es Intercambio P2P (`huellazo:trade`, `stampId=`)** ➡️ Abre `TradeAcceptModal` con la animación Pokémon Trade.

---

## 3. Recolección de Estampas y Minting de cNFTs

Las estampas de Huajuapan de León se emiten como **Compressed NFTs (cNFTs)** utilizando el programa **Metaplex Bubblegum V2** en Solana Devnet.

### Pasos para Probar:
1. Dirígete a la pestaña **`Scan / Radar`** (`/scan`).
2. En el mapa **Radar 3D**, verás puntos de interés (POIs) ubicados en Huajuapan de León (Zócalo, Catedral, Cerro de las Minas, Mirador Yukunitza, etc.).
3. Haz clic en cualquiera de los marcadores de mapa o presiona el botón **"📷 ESCANEAR CÓDIGO QR"** y elige un lugar de prueba.
4. Aparecerá la **Card Unificada Neo-Brutalista de Escaneo**:
   - Muestra la imagen enmarcada del lugar.
   - Nombre y ubicación exacta (`📍 Huajuapan de León, Oaxaca`).
   - Recompensa estimada de Puntos Huellazos (`+50 $HZ` a `+100 $HZ`).
5. Presiona el botón **"OBTENER ESTAMPA NFT (cNFT)"**.
6. **Resultado**:
   - Se procesa la transacción en Solana Devnet.
   - Aparecerá la pantalla de celebración con la firma hash on-chain (`Firma On-Chain Devnet: ...`).
   - Los puntos se acreditarán inmediatamente en tu monedero de la app.
   - Puedes hacer clic en **"VER EN MI PASAPORTE"** para ver la estampa agregada a tu pasaporte.

---

## 4. Pagos en Comercios Locales con Solana Pay

Permite a los usuarios realizar compras en comercios locales (cafeterías, restaurantes, artesanos) en la red de Solana.

### Pasos para Probar:
1. En la pantalla `Scan`, presiona **"📷 ESCANEAR CÓDIGO QR"**.
2. Selecciona cualquiera de las tres alternativas:
   - Escanear un QR impreso con la cámara en vivo.
   - Subir una imagen de los archivos en `./qrcodes` (`solana_pay_caf_petirrojo.png`, `solana_pay_casa_del_humo.png`, `solana_pay_fonda_julita.png`).
   - Presionar cualquiera de los comercios de demostración rápida (**Café Petirrojo**, **Casa del Humo**, **Fonda Julita**).
3. **Flujo del Modal Solana Pay**:
   - Se abre el modal **Solana Pay** mostrando el comercio, concepto y monto en **SOL** (con su equivalencia aproximada en **MXN**).
   - **Bono de Explorador**: `+20 Puntos Huellazos ($HZ)`.
4. Presiona **"CONFIRMAR Y PAGAR CON SOLANA"**.
5. El monedero conectado (Solflare o Phantom) firmará la transacción en Solana Devnet.

---

## 5. Solana Actions & Blinks (Piñata Interactiva y QR)

Permite convertir transacciones de Solana en enlaces o códigos QR interactivos (Solana Actions & Blinks).

### Pasos para Probar:
1. En la pantalla `Scan`, presiona **"📷 ESCANEAR CÓDIGO QR"** y elige la **Piñata Blink Café Petirrojo** o sube una imagen de `./qrcodes/blinks/`.
2. El motor detectará el formato Blink otorgando automáticamente una recompensa de **+100 Puntos Huellazos ($HZ)** y la estampa cNFT exclusiva.
3. Se abrirá la pantalla de celebración con animación de destello y firma on-chain.

---

## 6. Intercambio P2P de Estampas (Animación Estilo Pokémon Trade)

Permite intercambiar estampas digitales con otros exploradores en la red de Solana de forma directa.

### Pasos para Probar:
1. Dirígete a la pestaña **`Scan`** y presiona el botón **"INTERCAMBIAR"** (o escanea un QR de intercambio P2P).
2. Se abrirá la **Máquina de Intercambio P2P**:
   - **Paso 1**: Muestra la estampa ofrecida por el otro explorador (`Alebrije Místico Ñuiñe`).
   - **Paso 2**: Selecciona la estampa de tu colección que deseas entregar. Las estampas se muestran como **minimágenes contenidas (cards de 56x56px)** con su nombre y ubicación sin abarcar el fondo.
3. Presiona **"CONFIRMAR Y TRANSMITIR A SOLANA"**.
4. **Animación Estilo Pokémon Trade**:
   - Se activa el tubo de transmisión de energía con rayos giratorios.
   - Tu estampa y la estampa ofrecida se desplazan hacia el centro.
   - Al cruzarse en el centro, se dispara un **destello blanco de luz** y se firma la transferencia de los cNFTs en Solana Devnet.
5. **Pantalla de Revelación**:
   - Aparece la nueva estampa recibida con un marco brillante y medalla.
   - Recibes un **Bono de Intercambio P2P** de **+25 $HZ**.
   - Incluye la firma hash de la transacción y el botón directo **`VER SOLSCAN ↗`**.

---

## 7. Pruebas de Ubicación GPS y Mapas 3D / 2D

### Ubicación Central por Defecto:
- **Zócalo de Huajuapan de León, Oaxaca**: `Latitud: 17.8067, Longitud: -97.7786`.

### Probar los Mapas:
1. En la pantalla **Scan**:
   - El mapa renderiza construcciones 3D y el polígono en tono terracota del centro histórico de Huajuapan.
   - Presiona el mapa para expandir a **Modo Pantalla Completa**.
   - Haz clic en el botón circular **(X)** arriba a la derecha para cerrar.
2. En las pantallas de detalle de Comercio o Turismo (`/tourism/[id]` o `/business/[id]`):
   - El mapa renderiza un plano 2D interactivo centrado en las coordenadas del negocio.
   - El marcador muestra un **halo pulsante (`.selected-place-pin`)** y abre automáticamente su tarjeta informativa.

---

## 8. Verificación On-Chain en Solscan / Solana Explorer

Cada transacción ejecutada en la dApp genera una firma criptográfica de Solana Devnet.

### Pasos para Verificar:
1. En los modales de confirmación, haz clic en el botón **"Ver Solscan"** o **"Firma On-Chain Devnet"**.
2. Se abrirá el explorador oficial de Solana:
   `https://explorer.solana.com/tx/<SIGNATURE>?cluster=devnet`
3. Podrás verificar el estado (`Confirmed / Finalized`), el bloque y la transferencia registrada.

---

### Summary Checklist de Pruebas Rápidas:
- [x] Conectar wallet Solflare / Phantom (Devnet).
- [x] Probar el Botón Único **`📷 ESCANEAR CÓDIGO QR`**.
- [x] Escanear/Probar pago rápido en Café Petirrojo, Casa del Humo o Fonda Julita.
- [x] Escanear POI en Huajuapan y mint de cNFT.
- [x] Ejecutar intercambio P2P y disfrutar la animación Pokémon Trade.
- [x] Abrir pasaporte para confirmar las estampas y balance de $HZ.
