from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_session
from app.db.models import User
from app.schemas.schemas import UserCreate, UserOut
from app.middleware.auth import verify_wallet_signature

router = APIRouter()

@router.post("/auth", response_model=UserOut, status_code=status.HTTP_200_OK)
async def authenticate_user(
    body: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(User).where(User.pubkey == body.pubkey))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(pubkey=body.pubkey, username=body.username)
        session.add(user)
        await session.flush()
    return user

@router.get("/me", response_model=UserOut)
async def get_me(
    pubkey: str = Depends(verify_wallet_signature),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(User).where(User.pubkey == pubkey))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
