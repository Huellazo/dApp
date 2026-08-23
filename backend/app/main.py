import os
import sys
from pathlib import Path

# Inyectar el directorio backend a sys.path para resolución de módulos en Vercel Serverless
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.core.config import settings
from app.routers import users, visits, merchants, proposals, payments, blinks

app = FastAPI(
    title="Huellazo API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix=f"{settings.api_prefix}/users", tags=["users"])
app.include_router(visits.router, prefix=f"{settings.api_prefix}/visits", tags=["visits"])
app.include_router(merchants.router, prefix=f"{settings.api_prefix}/merchants", tags=["merchants"])
app.include_router(proposals.router, prefix=f"{settings.api_prefix}/proposals", tags=["proposals"])
app.include_router(payments.router, prefix=f"{settings.api_prefix}/payments", tags=["payments"])
app.include_router(blinks.router, prefix=f"{settings.api_prefix}/blinks", tags=["blinks"])

@app.get("/", response_class=HTMLResponse)
async def root_web_app():
    html_content = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Huellazo — Pasaporte Turístico Web3 & Solana Blinks ☀️</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg: #FAF9F6;
      --border: #3D405B;
      --primary: #E07A5F;
      --green: #81B29A;
      --gold: #F2CC8F;
      --card-bg: #FFFFFF;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Outfit', -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--border);
      padding: 2rem 1rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .container {
      max-width: 900px;
      width: 100%;
    }

    .header {
      background-color: var(--card-bg);
      border: 3px solid var(--border);
      box-shadow: 6px 6px 0px var(--border);
      border-radius: 16px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .badge {
      display: inline-block;
      background-color: var(--gold);
      color: var(--border);
      border: 2px solid var(--border);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      box-shadow: 2px 2px 0px var(--border);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 1rem;
    }

    p.subtitle {
      font-size: 1.1rem;
      font-weight: 600;
      color: #555;
      max-width: 700px;
      margin: 0 auto 1.5rem auto;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      font-weight: 800;
      padding: 0.8rem 1.4rem;
      border: 2px solid var(--border);
      border-radius: 12px;
      box-shadow: 3px 3px 0px var(--border);
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      cursor: pointer;
    }

    .btn:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px var(--border);
    }

    .btn-secondary {
      background-color: var(--green);
      color: var(--border);
    }

    .btn-outline {
      background-color: var(--card-bg);
      color: var(--border);
    }

    .section-title {
      font-size: 1.6rem;
      font-weight: 900;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background-color: var(--card-bg);
      border: 3px solid var(--border);
      box-shadow: 5px 5px 0px var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-bottom: 3px solid var(--border);
      background-color: #EEE;
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .card-text {
      font-size: 0.95rem;
      color: #666;
      margin-bottom: 1.25rem;
      flex-grow: 1;
      line-height: 1.4;
    }

    .footer {
      text-align: center;
      font-weight: 600;
      font-size: 0.9rem;
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: var(--card-bg);
      border: 2px solid var(--border);
      border-radius: 12px;
      box-shadow: 3px 3px 0px var(--border);
    }
  </style>
</head>
<body>
  <div class="container">
    
    <header class="header">
      <div class="badge">☀️ Pasaporte Turístico Web3</div>
      <h1>Huellazo dApp & Solana Blinks</h1>
      <p class="subtitle">
        Descubre Huajuapan de León, colecciona Estampas Digitales e interactúa en redes sociales con Enlaces Interactivos en Solana Devnet.
      </p>
      
      <div class="nav-buttons">
        <a href="/docs" class="btn">📘 Documentación API</a>
        <a href="/actions.json" class="btn btn-secondary">⚙️ Actions Manifest</a>
        <a href="/health" class="btn btn-outline">💚 Estado Servicio</a>
      </div>
    </header>

    <h2 class="section-title">📍 Catálogo de Solana Blinks Interactivos</h2>
    
    <div class="grid">
      
      <!-- Card 1 -->
      <div class="card">
        <img class="card-img" src="https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_cerro_minas.png" alt="Cerro de las Minas">
        <div class="card-body">
          <div class="card-title">Zona Arqueológica Cerro de las Minas</div>
          <p class="card-text">Estampa de pasaporte de la cultura Ñuiñe con Recompensa Mística (+100 $HZ).</p>
          <a href="/api/v1/blinks/claim-stamp?poiId=cerro_minas" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center;">🔍 Probar JSON Action</a>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card">
        <img class="card-img" src="https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_mirador_yukunitza.png" alt="Mirador Yukunitzá">
        <div class="card-body">
          <div class="card-title">Mirador de Cristal Yukunitzá</div>
          <p class="card-text">Estampa ecoturisticá con vista panorámica a la Mixteca y recompensa de +90 $HZ.</p>
          <a href="/api/v1/blinks/claim-stamp?poiId=yukunitza" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center;">🔍 Probar JSON Action</a>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="card">
        <img class="card-img" src="https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/nfts/nft_jaguarcito_nuine.png" alt="Jaguarcito Ñuiñe">
        <div class="card-body">
          <div class="card-title">Jaguarcito Ñuiñe Legendario</div>
          <p class="card-text">Estampa mística legendaria del guardián de piedra prehispánico (+150 $HZ).</p>
          <a href="/api/v1/blinks/claim-stamp?poiId=jaguarcito_nuine" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center;">🔍 Probar JSON Action</a>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="card">
        <img class="card-img" src="https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_cafe_petirrojo.png" alt="Café Petirrojo">
        <div class="card-body">
          <div class="card-title">Café de Especialidad Petirrojo</div>
          <p class="card-text">Blink Comercial para compra directa de café artesanal mixteco por 0.025 SOL.</p>
          <a href="/api/v1/blinks/buy-craft?craftId=cafe_petirrojo" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center;">🔍 Probar JSON Action</a>
        </div>
      </div>

    </div>

    <footer class="footer">
      ☀️ Huellazo dApp — Desplegado en Vercel Serverless & Solana Devnet | Programa Anchor: <code>2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ</code>
    </footer>

  </div>
</body>
</html>
"""
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/actions.json")
async def actions_manifest():
    return {
        "rules": [
            {
                "pathPattern": "/api/v1/blinks/**",
                "apiPath": "/api/v1/blinks/**"
            },
            {
                "pathPattern": "/claim-stamp",
                "apiPath": "/api/v1/blinks/claim-stamp"
            }
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "huellazo-api", "version": "1.0.0"}
