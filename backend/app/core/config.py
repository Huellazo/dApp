from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # -- App --
    environment: str = "development"
    api_prefix: str = "/api"

    # -- Database --
    database_url: str = "postgresql+asyncpg://huellazo_user:huellazo_dev_2026@localhost:5432/huellazo"

    # -- Solana --
    solana_rpc_url: str = "https://api.devnet.solana.com"
    huellazo_program_id: str = "2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ"
    vault_program_id: str = "HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU"

    # -- CORS --
    cors_origins: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
