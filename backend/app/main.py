import os
import sys
from pathlib import Path

# Inyectar el directorio backend a sys.path para resolución de módulos en Vercel Serverless
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "huellazo-api", "version": "1.0.0"}
