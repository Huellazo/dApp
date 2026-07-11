from fastapi import Header, HTTPException, status
import base64
import nacl.signing
import nacl.exceptions

async def verify_wallet_signature(
    x_wallet_pubkey: str = Header(..., alias="X-Wallet-Pubkey"),
    x_wallet_signature: str = Header(..., alias="X-Wallet-Signature"),
    x_wallet_message: str = Header(..., alias="X-Wallet-Message"),
) -> str:
    try:
        pubkey_bytes = base64.b64decode(x_wallet_pubkey)
        signature_bytes = base64.b64decode(x_wallet_signature)
        message_bytes = x_wallet_message.encode("utf-8")

        verify_key = nacl.signing.VerifyKey(pubkey_bytes)
        verify_key.verify(message_bytes, signature_bytes)
        return x_wallet_pubkey
    except (nacl.exceptions.BadSignatureError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid wallet signature",
        )
