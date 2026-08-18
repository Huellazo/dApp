import React from 'react';

export default function HuellazoEstadoProyecto() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Auditoría de Estado: Huellazo</h1>
      <p style={{ color: '#666' }}>Resumen visual del estado del proyecto al 17 de Agosto de 2026.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        
        {/* SEMÁFORO */}
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2>🚥 Semáforo de Componentes</h2>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ height: '16px', width: '16px', borderRadius: '50%', background: '#f59e0b', marginRight: '12px' }}></span>
              <strong>Mobile App:</strong> Interfaz mockeada, no conectada. Contiene basura de 'cause-pots'.
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ height: '16px', width: '16px', borderRadius: '50%', background: '#10b981', marginRight: '12px' }}></span>
              <strong>Backend (FastAPI):</strong> Endpoints base construidos, geofence implementado, falta auth y conexión.
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ height: '16px', width: '16px', borderRadius: '50%', background: '#ef4444', marginRight: '12px' }}></span>
              <strong>Contratos (Anchor):</strong> IDL desactualizado vs Rust (`mint_place`). Program IDs no coinciden.
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <span style={{ height: '16px', width: '16px', borderRadius: '50%', background: '#ef4444', marginRight: '12px' }}></span>
              <strong>Infra Web3:</strong> Solana Pay, NFTs (Bubblegum), Oráculos (Pyth) ausentes o sin integrar.
            </li>
          </ul>
        </div>

        {/* BACKLOG P0 */}
        <div style={{ background: '#fff1f2', padding: '20px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
          <h2 style={{ color: '#be123c' }}>🔥 Backlog Crítico (P0)</h2>
          <ul style={{ paddingLeft: '20px', color: '#be123c' }}>
            <li><strong>Sincronizar Anchor:</strong> Unificar Program ID en <code>lib.rs</code>, <code>.env</code> y <code>Anchor.toml</code>.</li>
            <li><strong>Actualizar IDL:</strong> Exportar IDL actual y reemplazar el de <code>mobile/idl/huellazo.json</code>.</li>
            <li><strong>Conectar Capas:</strong> Enlazar llamadas HTTP de Mobile a FastAPI en vez de usar mocks locales.</li>
            <li><strong>Limpieza Radical:</strong> Eliminar el código heredado de <code>cause-pots</code> en Mobile.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '24px', background: '#f0fdfa', padding: '20px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
        <h2 style={{ color: '#0f766e' }}>🗺 Roadmap Simplificado (Fase 1-2)</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, padding: '12px', background: 'white', borderRadius: '4px', border: '1px solid #99f6e4' }}>
            <strong>1. Estabilización</strong><br/>
            Sincronizar IDs, APIs y limpiar código.
          </div>
          <div style={{ flex: 1, padding: '12px', background: 'white', borderRadius: '4px', border: '1px solid #99f6e4' }}>
            <strong>2. UX Básica</strong><br/>
            Mapa real (Mapbox), escáner de cámara real.
          </div>
          <div style={{ flex: 1, padding: '12px', background: 'white', borderRadius: '4px', border: '1px solid #99f6e4' }}>
            <strong>3. Web3 Core</strong><br/>
            Solana Pay (USDC) + Minteo de PDA (PoapState).
          </div>
        </div>
      </div>
    </div>
  );
}
