import httpx
from app.core.config import settings

class SolanaRPCClient:
    def __init__(self):
        self.rpc_url = settings.solana_rpc_url

    async def get_account_info(self, pubkey: str) -> dict | None:
        async with httpx.AsyncClient() as client:
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getAccountInfo",
                "params": [pubkey, {"encoding": "base64"}],
            }
            resp = await client.post(self.rpc_url, json=payload, timeout=10.0)
            resp.raise_for_status()
            return resp.json().get("result")

    async def get_transaction(self, signature: str) -> dict | None:
        async with httpx.AsyncClient() as client:
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTransaction",
                "params": [signature, {"encoding": "json", "commitment": "confirmed"}],
            }
            resp = await client.post(self.rpc_url, json=payload, timeout=10.0)
            resp.raise_for_status()
            return resp.json().get("result")

    async def confirm_transaction(self, signature: str) -> bool:
        tx = await self.get_transaction(signature)
        if tx is None:
            return False
        return tx.get("meta", {}).get("err") is None

solana_client = SolanaRPCClient()
