from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # -- App --
    environment: str = "development"
    api_prefix: str = "/api"

    # -- Database --
    database_url: str = "postgresql+asyncpg://huellazo_user:huellazo_dev_2026@localhost:5432/huellazo"

    # -- Solana --
    solana_rpc_url: str = "http://localhost:8899"
    huellazo_program_id: str = "4pioWVSCp5oSbxbeRbquccusTkvT6Z9B8jTg7j2XXNVk"
    vault_program_id: str = "HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU"

    # -- CORS --
    cors_origins: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
