from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json

class Settings(BaseSettings):
    # -- App --
    environment: str = "development"
    api_prefix: str = "/api/v1"

    # -- Database --
    database_url: str = "postgresql+asyncpg://huellazo_user:huellazo_dev_2026@localhost:5432/huellazo"

    # -- Solana --
    solana_rpc_url: str = "https://api.devnet.solana.com"
    huellazo_program_id: str = "2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ"
    vault_program_id: str = "HLGbJxYnfKAnYxoaLyWVFMR2gQp1MKFdEtg1auK4VuRU"

    # -- CORS --
    cors_origins: List[str] = ["*"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            if "," in v:
                return [i.strip() for i in v.split(",")]
            return [v.strip()]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
