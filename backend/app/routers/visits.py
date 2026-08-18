from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_session
from app.db.models import Visit, Merchant, User
from app.schemas.schemas import VisitCreate, VisitOut
from app.services.geofence import validate_geofence
from app.middleware.auth import verify_wallet_signature

router = APIRouter()

@router.post("/validate", response_model=VisitOut, status_code=status.HTTP_201_CREATED)
async def validate_visit(
    body: VisitCreate,
    pubkey: str = Depends(verify_wallet_signature),
    session: AsyncSession = Depends(get_session),
):
    user_result = await session.execute(select(User).where(User.pubkey == pubkey))
    user = user_result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    merchant_result = await session.execute(
        select(Merchant).where(Merchant.id == body.merchant_id, Merchant.is_active == True)
    )
    merchant = merchant_result.scalar_one_or_none()
    if merchant is None:
        raise HTTPException(status_code=404, detail="Merchant not found or inactive")

    is_valid = validate_geofence(
        user_lat=body.user_latitude,
        user_lon=body.user_longitude,
        merchant_lat=merchant.latitude,
        merchant_lon=merchant.longitude,
        radius_meters=merchant.radius_meters,
    )

    visit = Visit(
        user_id=user.id,
        merchant_id=merchant.id,
        user_latitude=body.user_latitude,
        user_longitude=body.user_longitude,
        is_valid=is_valid,
        tx_signature=body.tx_signature,
    )
    session.add(visit)
    await session.flush()

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="GPS validation failed: user is outside the merchant geofence",
        )

    return visit

@router.patch("/{visit_id}/confirm", response_model=VisitOut)
async def confirm_visit_tx(
    visit_id: str,
    tx_signature: str,
    pubkey: str = Depends(verify_wallet_signature),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Visit).join(User).where(Visit.id == visit_id, User.pubkey == pubkey)
    )
    visit = result.scalar_one_or_none()
    if visit is None:
        raise HTTPException(status_code=404, detail="Visit not found")

    visit.tx_signature = tx_signature
    await session.flush()
    return visit
