from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_session
from app.db.models import Proposal, User
from app.schemas.schemas import ProposalOut
from app.middleware.auth import verify_wallet_signature
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=ProposalOut, status_code=status.HTTP_201_CREATED)
async def create_proposal(
    name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    pubkey: str = Depends(verify_wallet_signature),
    session: AsyncSession = Depends(get_session),
):
    user_result = await session.execute(select(User).where(User.pubkey == pubkey))
    user = user_result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    photo_url = None
    if photo is not None:
        photo_url = f"pending/{photo.filename}"

    proposal = Proposal(
        user_id=user.id,
        name=name,
        description=description,
        latitude=latitude,
        longitude=longitude,
        photo_url=photo_url,
        status="pending",
    )
    session.add(proposal)
    await session.flush()
    return proposal

@router.get("/", response_model=List[ProposalOut])
async def list_proposals(
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Proposal).order_by(Proposal.created_at.desc()))
    return result.scalars().all()

@router.patch("/{proposal_id}/status", response_model=ProposalOut)
async def update_proposal_status(
    proposal_id: str,
    new_status: str,
    session: AsyncSession = Depends(get_session),
):
    if new_status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="status must be approved or rejected")

    result = await session.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalar_one_or_none()
    if proposal is None:
        raise HTTPException(status_code=404, detail="Proposal not found")

    proposal.status = new_status
    await session.flush()
    return proposal
