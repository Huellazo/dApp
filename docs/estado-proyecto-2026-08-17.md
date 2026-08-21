# Auditoría de Estado: Proyecto Huellazo

**Fecha:** 17 de Agosto de 2026
**Objetivo:** Contraste de estado real del código vs documentación y arquitectura propuesta.

## 1. Resumen Ejecutivo
Actualmente, **Huellazo es un prototipo de interfaz (UI) con un esqueleto on-chain y una API desconectada, no un MVP completo**. 
La intención original en los documentos (`docs/planeacion.md` y `docs/S2 Documentacion de Huellazo.txt`) describe un flujo integral: el usuario escanea un QR geolocalizado y recibe un NFT (POAP) o realiza un pago con Solana Pay. 
Sin embargo, en el código actual las tres capas principales (Mobile, Backend FastAPI, y Anchor) existen pero no se comunican entre sí. La app móvil utiliza datos simulados (mocks), interfaces "falsas" para escáner y mapas, y mantiene restos de un proyecto anterior llamado "cause-pots".

## 2. Matriz Docs vs Código vs Diagrama

| Funcionalidad | Diagrama/Docs | Estado en Código | Notas / Archivo Ancla |
| --- | --- | --- | --- |
| **Login MWA** | Previsto con roles | **Parcial** | Existe Mobile Wallet Adapter (`wallet.tsx`), pero los roles (turista/negocio) no bloquean el acceso real. |
| **Mapa (Mapbox/PostGIS)** | Previsto | **Mock/Ausente** | Hay dependencias en `package.json`, pero la UI usa CSS para simular un radar. Backend usa `Shapely`, no PostGIS. |
| **Cámara / Escáner QR** | Previsto | **Mock** | No se importa `expo-camera`. Se simula el escaneo en la UI (`scan.tsx`). |
| **Solana Pay** | Previsto | **Ausente en App** | FastAPI expone ruta `payments.py` que genera la URL, pero la app móvil no la consume ni implementa `@solana/pay`. |
| **Recompensas (NFT/POAP)** | Previsto | **Parcial** | Anchor define `PoapState` (PDA) en `mint_place` / `mint_business` (`lib.rs`). La app móvil simula el minteo en red local. |
| **Tesorería / Vault** | Previsto | **Desconectado** | Existe programa Anchor para Vault, pero no está enlazado al flujo de pagos QR de negocios. |
| **Geofence** | Previsto | **Parcial** | `POST /api/visits/validate` en Backend implementa lógica Shapely. Mobile usa `Math.random` para simular "Fake GPS". |
| **Pyth, Bonfida, Blinks** | Previsto | **Ausente** | Solo existen en `docs/arquitectura actualizada.jpeg`. |

## 3. Observaciones por Capa

### Mobile (`mobile/`)
- Mantiene dependencias y variables de estado del proyecto "pots" (`@cause_pots:*`).
- La red de Solana está hardcodeada a `devnet` público, ignorando variables de entorno como `EXPO_PUBLIC_SOLANA_RPC`.
- Hay duplicidad de componentes base (ej. `BrutalistButton` y `brutalist-button`).
- La "gamificación" mencionada en el README ocurre solo en estado local de React, sin impacto real en la cadena.

### Backend (`backend/`)
- Implementa endpoints esenciales (merchants, visits, proposals, payments) pero faltan validaciones de autorización (rutas abiertas).
- Faltan migraciones reales (`alembic` está listado pero no configurado).
- Usa PostgreSQL + Shapely (no PostGIS como afirma el diagrama).

### Anchor (`anchor/programs/huellazo`)
- **Estado de Program ID:** El Program ID `2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ` ya ha sido sincronizado exitosamente entre `lib.rs`, `Anchor.toml`, la configuración del backend y el IDL.
- El IDL en la app móvil (`mobile/idl/huellazo.json`) pertenece a una versión antigua (`recordVisit` etc.) y no concuerda con el código en Rust actual (`mint_place`, `mint_business`).
- Pruebas TypeScript (`anchor/tests/anchor.ts`) están rotas porque apuntan a una API antigua.
- Utiliza `ephemeral_rollups_sdk` de MagicBlock para delegación de PDAs, lo cual es avanzado pero requiere validación si se mantendrá.

## 4. Correcciones Inmediatas (Deuda Técnica - P0)
*Acciones que rompen el MVP si no se arreglan de inmediato:*
- **Sincronizar Anchor:** El Program ID principal ya ha sido corregido. Queda pendiente regenerar el IDL y actualizar `mobile/idl/huellazo.json` acorde a los nuevos métodos en Rust.
- **Conectar Capas:** Enlazar la app móvil con FastAPI (usar `EXPO_PUBLIC_API_URL` correctamente) y el RPC real de Solana.
- **Limpiar Herencia:** Eliminar o aislar completamente todo rastro de "cause-pots".
- **Transparencia UI:** Retirar copy que sugiera que se están minteando NFTs reales si solo es una simulación visual.

## 5. Sugerencias de Producto y Stack (YAGNI)
- **MVP On-Chain:** Mantener el modelo actual de PDA (`PoapState`) es suficiente. Integrar Metaplex/Bubblegum es innecesario para la validación inicial (Fase 1-2).
- **Pagos:** Centrarse exclusivamente en Solana Pay + USDC. Ignorar Pyth/oráculos hasta que haya pagos multi-divisa.
- **Geolocalización:** `Shapely` en backend es suficiente. No migrar a PostGIS a menos que las consultas espaciales sean un cuello de botella.
- **UX Simplificada:** Seguir las recomendaciones del estudio de usuarios: consolidar tabs innecesarios y enfocarse en una CTA clara para turistas.

## 6. Futuras Implementaciones (Roadmap Propuesto)
1. **Ahora (Cierre Fase 1):** Sincronizar IDs/IDL, conectar Wallet + API, limpieza de código heredado y ajuste de copy de UX.
2. **Siguiente (Fase 2):** Implementar mapa GPS real (Mapbox), integrar cámara para QR, validación real de geofence, y pagos reales vía Solana Pay.
3. **Después (Fase 3):** Implementar Auth para administradores, creación de propuestas con imágenes, programa Vault completo y despliegue del token $HUELLA.
4. **Futuro Lejano:** Integración con Blinks, SNS, DAO y Staking.

## 7. Documentación Marcada como Stale (Obsoleta)
Los siguientes documentos describen arquitecturas anteriores y han sido marcados con un banner de advertencia:
- `docs/huellazo-report.md`
- `docs/cause-report.md`
- (El diagrama visual también debe considerarse desactualizado en cuanto a base de datos y flujos).
