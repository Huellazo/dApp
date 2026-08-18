from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    pubkey: str
    username: Optional[str] = None

class UserOut(BaseModel):
    id: str
    pubkey: str
    username: Optional[str]
    created_at: datetime
    model_config = {"from_attributes": True}

class MerchantCreate(BaseModel):
    wallet_pubkey: str
    name: str
    tier: int = 1
    latitude: float
    longitude: float
    radius_meters: int = 100

class MerchantOut(BaseModel):
    id: str
    wallet_pubkey: str
    name: str
    tier: int
    is_active: bool
    latitude: float
    longitude: float
    radius_meters: int
    model_config = {"from_attributes": True}

class VisitCreate(BaseModel):
    merchant_id: str
    user_latitude: float
    user_longitude: float
    tx_signature: Optional[str] = None

class VisitOut(BaseModel):
    id: str
    merchant_id: str
    is_valid: bool
    tx_signature: Optional[str]
    visited_at: datetime
    model_config = {"from_attributes": True}

class ProposalCreate(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float

class ProposalOut(BaseModel):
    id: str
    name: str
    status: str
    latitude: float
    longitude: float
    created_at: datetime
    model_config = {"from_attributes": True}
