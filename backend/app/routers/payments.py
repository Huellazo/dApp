from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_session
from app.db.models import Merchant
from app.middleware.auth import verify_wallet_signature
from pydantic import BaseModel
import uuid

router = APIRouter()

class PaymentReferenceOut(BaseModel):
    reference: str
    merchant_wallet: str
    amount: float
    label: str
    solana_pay_url: str

@router.post("/reference", response_model=PaymentReferenceOut)
async def create_payment_reference(
    merchant_id: str,
    amount: float,
    pubkey: str = Depends(verify_wallet_signature),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Merchant).where(Merchant.id == merchant_id, Merchant.is_active == True)
    )
    merchant = result.scalar_one_or_none()
    if merchant is None:
        raise HTTPException(status_code=404, detail="Merchant not found or inactive")

    reference = str(uuid.uuid4()).replace("-", "")
    label = merchant.name.replace(" ", "%20")
    solana_pay_url = (
        f"solana:{merchant.wallet_pubkey}"
        f"?amount={amount}"
        f"&reference={reference}"
        f"&label={label}"
        f"&memo=huellazo-pay"
    )

    return PaymentReferenceOut(
        reference=reference,
        merchant_wallet=merchant.wallet_pubkey,
        amount=amount,
        label=merchant.name,
        solana_pay_url=solana_pay_url,
    )
