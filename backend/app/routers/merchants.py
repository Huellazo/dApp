from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_session
from app.db.models import Merchant
from app.schemas.schemas import MerchantCreate, MerchantOut
from typing import List

router = APIRouter()

@router.get("/", response_model=List[MerchantOut])
async def list_merchants(
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Merchant).where(Merchant.is_active == True)
    )
    return result.scalars().all()

@router.get("/{merchant_id}", response_model=MerchantOut)
async def get_merchant(
    merchant_id: str,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Merchant).where(Merchant.id == merchant_id))
    merchant = result.scalar_one_or_none()
    if merchant is None:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return merchant

@router.post("/", response_model=MerchantOut, status_code=status.HTTP_201_CREATED)
async def create_merchant(
    body: MerchantCreate,
    session: AsyncSession = Depends(get_session),
):
    merchant = Merchant(**body.model_dump())
    session.add(merchant)
    await session.flush()
    return merchant
