from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
import base64
import struct
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from solders.instruction import Instruction, AccountMeta
from solders.system_program import ID as SYS_PROGRAM_ID, TransferParams, transfer
from solders.transaction import Transaction
from solders.message import Message

router = APIRouter()

HUELLAZO_PROGRAM_ID = Pubkey.from_string("2S3Xwt56qB314HcLVrRtREyquEz78rAgJaxZmv1s6emZ")
CONFIG_SEED = b"config"
POAP_SEED = b"poap"

# Standard Solana Action CORS and Version Headers
ACTION_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Action-Version, X-Blockchain-Ids",
    "X-Action-Version": "2.1.3",
    "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
}

# Image Catalog: Maps POI ID to GitHub Raw PNG image URL
POI_IMAGE_CATALOG: Dict[str, Dict[str, str]] = {
    "cerro_minas": {
        "title": "Estampa Digital — Cerro de las Minas",
        "description": "¡Reclama tu estampa digital de pasaporte del antiguo asentamiento de la cultura Ñuiñe con +100 $HZ!",
        "image": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_cerro_minas.png",
        "metadata_uri": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/cerro_minas.json",
    },
    "yukunitza": {
        "title": "Estampa Digital — Mirador de Cristal Yukunitzá",
        "description": "¡Reclama tu estampa digital ecoturística del Mirador Yukunitzá y acumula +90 $HZ en Huellazo!",
        "image": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_mirador_yukunitza.png",
        "metadata_uri": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/mirador_yukunitza.json",
    },
    "jaguarcito_nuine": {
        "title": "Estampa Legendaria — Jaguarcito Ñuiñe",
        "description": "¡Obtén el mítico guardián de piedra de la cultura Ñuiñe de Huajuapan de León!",
        "image": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/nfts/nft_jaguarcito_nuine.png",
        "metadata_uri": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/jaguarcito_nuine.json",
    },
    "cafe_petirrojo": {
        "title": "Café de Especialidad Petirrojo",
        "description": "Apoya al comercio local mixteco comprando café artesanal de especialidad en Huajuapan.",
        "image": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/images/huajuapan/huajuapan_cafe_petirrojo.png",
        "metadata_uri": "https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/cafe_petirrojo.json",
    },
}

class ActionPayload(BaseModel):
    account: str

def get_config_pda() -> Pubkey:
    pda, _ = Pubkey.find_program_address([CONFIG_SEED], HUELLAZO_PROGRAM_ID)
    return pda

def get_poap_pda(user_pubkey: Pubkey, token_id: int) -> Pubkey:
    token_id_bytes = token_id.to_bytes(8, byteorder="little")
    pda, _ = Pubkey.find_program_address([POAP_SEED, bytes(user_pubkey), token_id_bytes], HUELLAZO_PROGRAM_ID)
    return pda

def create_mint_place_instruction(
    user_pubkey: Pubkey,
    token_id: int,
    token_uri: str,
    latitude: float,
    longitude: float,
    poap_type: int
) -> Instruction:
    discriminator = bytes([19, 137, 245, 118, 149, 108, 12, 60])
    token_id_buf = token_id.to_bytes(8, byteorder="little")
    
    uri_bytes = token_uri.encode("utf-8")
    uri_len_buf = len(uri_bytes).to_bytes(4, byteorder="little")
    
    lat_buf = struct.pack("<d", latitude)
    lng_buf = struct.pack("<d", longitude)
    type_buf = bytes([poap_type])
    
    data = discriminator + token_id_buf + uri_len_buf + uri_bytes + lat_buf + lng_buf + type_buf

    config_pda = get_config_pda()
    poap_pda = get_poap_pda(user_pubkey, token_id)

    accounts = [
        AccountMeta(pubkey=user_pubkey, is_signer=True, is_writable=True),
        AccountMeta(pubkey=config_pda, is_signer=False, is_writable=True),
        AccountMeta(pubkey=poap_pda, is_signer=False, is_writable=True),
        AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
    ]

    return Instruction(HUELLAZO_PROGRAM_ID, data, accounts)

def set_action_headers(response: Response):
    for key, value in ACTION_HEADERS.items():
        response.headers[key] = value

@router.options("/{full_path:path}")
async def options_handler(response: Response, full_path: str):
    set_action_headers(response)
    return Response(status_code=200, headers=ACTION_HEADERS)

@router.get("/actions.json")
async def get_actions_json(response: Response):
    set_action_headers(response)
    return {
        "rules": [
            {
                "pathPattern": "/api/v1/blinks/**",
                "apiPath": "/api/v1/blinks/**"
            }
        ]
    }

@router.get("/claim-stamp")
async def get_claim_stamp_blink(response: Response, poiId: Optional[str] = "cerro_minas"):
    set_action_headers(response)
    
    item = POI_IMAGE_CATALOG.get(poiId or "cerro_minas", POI_IMAGE_CATALOG["cerro_minas"])
    
    return {
        "icon": item["image"],
        "title": item["title"],
        "description": item["description"],
        "label": "Reclamar Estampa Digital",
        "links": {
          "actions": [
            {
              "label": "Reclamar Estampa Digital de Pasaporte",
              "href": f"/api/v1/blinks/claim-stamp?poiId={poiId}"
            }
          ]
        }
    }

@router.post("/claim-stamp")
async def post_claim_stamp_blink(response: Response, payload: ActionPayload, poiId: Optional[str] = "cerro_minas"):
    set_action_headers(response)
    try:
        user_pubkey = Pubkey.from_string(payload.account)
        item = POI_IMAGE_CATALOG.get(poiId or "cerro_minas", POI_IMAGE_CATALOG["cerro_minas"])
        
        token_id = 101
        token_uri = item["metadata_uri"]
        
        ix = create_mint_place_instruction(
            user_pubkey=user_pubkey,
            token_id=token_id,
            token_uri=token_uri,
            latitude=17.8071,
            longitude=-97.7762,
            poap_type=0
        )

        client = Client("https://api.devnet.solana.com")
        blockhash_resp = client.get_latest_blockhash()
        blockhash = blockhash_resp.value.blockhash

        msg = Message.new_with_blockhash([ix], user_pubkey, blockhash)
        tx = Transaction.new_unsigned(msg)
        
        serialized_tx = base64.b64encode(bytes(tx)).decode("utf-8")

        return {
            "transaction": serialized_tx,
            "message": f"¡Firma tu transacción para registrar tu {item['title']} en Huellazo!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/buy-craft")
async def get_buy_craft_blink(response: Response, craftId: Optional[str] = "cafe_petirrojo"):
    set_action_headers(response)
    item = POI_IMAGE_CATALOG.get("cafe_petirrojo")
    
    return {
        "icon": item["image"],
        "title": item["title"],
        "description": item["description"],
        "label": "Comprar por 0.025 SOL",
        "links": {
          "actions": [
            {
              "label": "Comprar Café Artesanal (0.025 SOL)",
              "href": f"/api/v1/blinks/buy-craft?craftId={craftId}"
            }
          ]
        }
    }

@router.post("/buy-craft")
async def post_buy_craft_blink(response: Response, payload: ActionPayload, craftId: Optional[str] = "cafe_petirrojo"):
    set_action_headers(response)
    try:
        user_pubkey = Pubkey.from_string(payload.account)
        merchant_pubkey = Pubkey.from_string("KLVFn69o3w9pvKNsza3YJtyszf8e1E5GCDByxeRhVzg")
        
        ix = transfer(TransferParams(
            from_pubkey=user_pubkey,
            to_pubkey=merchant_pubkey,
            lamports=25000000 # 0.025 SOL
        ))

        client = Client("https://api.devnet.solana.com")
        blockhash_resp = client.get_latest_blockhash()
        blockhash = blockhash_resp.value.blockhash

        msg = Message.new_with_blockhash([ix], user_pubkey, blockhash)
        tx = Transaction.new_unsigned(msg)
        
        serialized_tx = base64.b64encode(bytes(tx)).decode("utf-8")

        return {
            "transaction": serialized_tx,
            "message": "¡Firma para completar tu compra de Café Petirrojo en Huellazo!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
