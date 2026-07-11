<style>
  @page {
    size: letter;
    margin: 25mm 20mm;
    @bottom-right {
      content: "Pasaporte Huellazo 2026 | Pagina " counter(page);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 8pt;
      color: #7f8c8d;
      font-weight: bold;
    }
  }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background-color: #fdfaf4; /* Fondo Arena Calida */
    line-height: 1.6;
    font-size: 11pt;
  }
  h1 {
    color: #b71c1c; /* Rojo Grana Cochinilla */
    font-size: 26pt;
    font-weight: bold;
    border-bottom: 4px solid #e67e22; /* Amarillo Cempasuchil / Barro */
    padding-bottom: 12px;
    margin-bottom: 30px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  h2 {
    color: #16a085; /* Azul Talavera / Jade */
    font-size: 15pt;
    font-weight: bold;
    margin-top: 35px;
    margin-bottom: 15px;
    border-left: 6px solid #b71c1c; /* Detalle Rojo Grana Cochinilla */
    padding-left: 12px;
    text-transform: uppercase;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 10pt;
    background-color: #ffffff;
  }
  th {
    background-color: #b71c1c; /* Encabezado Rojo Grana Cochinilla */
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    padding: 12px;
    border: 1px solid #b71c1c;
    letter-spacing: 0.5px;
  }
  td {
    padding: 12px;
    border: 1px solid #eaeded;
    vertical-align: top;
    color: #2c3e50;
  }
  tr:nth-child(even) {
    background-color: #fdf2f2; /* Variacion sutil de Rojo Claro */
  }
  p {
    text-align: justify;
    margin-bottom: 15px;
  }
  hr {
    border: 0;
    border-top: 3px dotted #e67e22;
    margin: 40px 0;
  }
</style>

# Documento de Planificacion: Huellazo

## 1. Roadmap de Desarrollo

| FASE / SEMANAS | OBJETIVOS TECNICOS | COMPONENTES E INTEGRACIONES CLAVE |
| :--- | :--- | :--- |
| Fase 1 (Sem 1-3) | Infraestructura Movil Base | Configuracion en React Native, integracion de Solana Mobile Wallet Adapter (MWA) y despliegue en Devnet de contratos core en Anchor (Rust) |
| Fase 2 (Sem 4-6) | Interfaz, Pagos P2P y Puntos Turisticos | Desarrollo del mapa interactivo con GPS, logica de cuentas PDA para el Pasaporte NFT Dinamico, integracion fisica con Solana Pay, delimitacion de zonas con Mapbox o Turfjs y escaneo de codigos QR para ganar tokens Huellazos |
| Fase 3 (Sem 7-9) | Gamificacion, Escrows y Validacion | Emision de NFTs convencionales para medallas y visitas, contratos de garantia (Smart Escrows) para reservas, automatizacion de regalias, modulo de validacion por foto para propuestas de nuevos sitios y gestion con Metaplex Bubblegum |
| Fase 4 (Sem 10-12) | Conectividad y Lanzamiento | Integracion de Solana Blinks para redes sociales, credenciales criptograficas anti fraude, pruebas de descompresion de activos convencionales y despliegue final de la dApp en Mainnet |

<hr />

## 2. Lista Priorizada de Funcionalidades

| PRIORIDAD | FUNCIONALIDAD | IMPLEMENTACION TECNICA EN SOLANA |
| :--- | :--- | :--- |
| **MUST-HAVE** | App Movil Nativa Cross-Platform | Interfaz en React Native conectada a billeteras mediante Mobile Wallet Adapter (MWA) |
| **MUST-HAVE** | Pasaporte NFT Dinamico | Registro de identidad evolutivo gestionado de forma inmutable a traves de cuentas PDA |
| **MUST-HAVE** | Terminal de Cobro QR Fisico | Procesamiento de pagos instantaneos y sin comisiones bancarias utilizando Solana Pay |
| **MUST-HAVE** | Contratos de Reserva y Liquidacion | Programas on-chain en Anchor para agendar experiencias y asegurar el pago directo a locales |
| **MUST-HAVE** | Coleccion de NFTs por Visita | Entrega de NFTs convencionales con alta accesibilidad y compatibilidad al visitar puntos turisticos y escanear codigos QR |
| **MUST-HAVE** | Validacion y Propuesta por Foto | Sistema para proponer nuevos lugares o negocios subiendo una foto para registrar el espacio e imprimir su propio QR |
| **NICE-TO-HAVE** | Acciones Fuera de la App | Integracion de Solana Blinks para reservar o comprar artesanias directo desde redes sociales |
| **NICE-TO-HAVE** | Descompresion con Bubblegum | Uso de Metaplex Bubblegum para optimizar, interactuar y permitir la descompresion de los NFTs convencionales de lugares visitados |
| **NICE-TO-HAVE** | Modulo de Seguridad Avanzada | Smart Escrows para congelar fondos de reservas y resenas verificadas criptograficamente |
| **NICE-TO-HAVE** | DeFi Social y Gobernanza | Sistema de Staking de impacto y votaciones colectivas de la DAO mediante el token HUELLA o Huellazos |

<hr />

## 3. Descripcion Breve del Flujo Principal

El usuario inicia sesion de forma segura vinculando su wallet movil con un solo toque gracias al soporte de MWA, lo que activa y acuna de inmediato su Pasaporte NFT Dinamico de viajero. Posteriormente, el turista explora el destino en tiempo real mediante el mapa interactivo con GPS para descubrir puntos turisticos, monumentos o lugares ocultos, asi como agendar experiencias autenticas directamente con artesanos, guias o comercios locales validados. Al llegar a un punto turistico o monumento, el usuario escanea un codigo QR fisico instalado en el sitio para validar su ubicacion, lo que genera de forma automatica recompensas en tokens Huellazos y le otorga un NFT convencional del lugar visitado para asegurar la maxima accesibilidad. Ademas, el ecosistema permite a los usuarios proponer nuevos lugares turisticos o negocios locales mediante un sistema de validacion por foto; una vez aprobada la propuesta, el lugar se registra y se habilita la opcion de imprimir el codigo QR correspondiente para colocarlo en el sitio fisico. Al consumir en la comunidad, el viajero escanea el codigo QR del establecimiento y realiza el pago de billetera a billetera con Solana Pay utilizando USDC o SOL de manera instantanea y sin intermediarios bancarios. Finalmente, la blockchain ejecuta un contrato inteligente en Rust que liquida los fondos al comercio al instante, distribuye las regalias de forma automatica a los artistas regionales, otorga tokens de utilidad HUELLA como recompensa y evoluciona el nivel visual del pasaporte del usuario.

<hr />

## 4. Por que el Proyecto Aprovecha Solana

Huellazo utiliza Solana como su infraestructura central porque sus tarifas de red de fracciones de centavo de dolar y su velocidad de procesamiento instantaneo hacen viable una microeconomia real de micropagos diarios sin que las comisiones absorban las ganancias de los artesanos. Ademas, herramientas nativas del ecosistema como el Mobile Wallet Adapter (MWA) y Solana Pay permiten trasladar toda la seguridad de la blockchain directamente al telefono celular del turista, transformando procesos Web3 complejos en una experiencia movil familiar, fluida y libre de fricciones. La infraestructura de Solana permite gestionar de manera eficiente la identidad dinamica del pasaporte y la integracion con Metaplex Bubblegum para la optimizacion y descompresion de los NFTs convencionales de los lugares visitados, garantizando que tengan la maxima accesibilidad y compatibilidad con todo el mercado. Finalmente, tecnologias como Blinks permiten expandir el alcance comercial y de exploracion del proyecto hacia las redes sociales tradicionales a un costo practicamente nulo.
