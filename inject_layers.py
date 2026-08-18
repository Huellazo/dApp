import json

with open("graphify-out/graph.json", "r", encoding="utf-8") as f:
    data = json.load(f)

nodes = data.get("nodes", [])
edges = data.get("edges", [])

layer_nodes = [
    {"id": "LAYER_MOBILE", "name": "Mobile App (Expo)", "type": "module", "file": "mobile/", "content": "Frontend React Native", "size": 100},
    {"id": "LAYER_BACKEND", "name": "Backend (FastAPI)", "type": "module", "file": "backend/", "content": "Backend API", "size": 100},
    {"id": "LAYER_ANCHOR", "name": "Anchor (Smart Contracts)", "type": "module", "file": "anchor/", "content": "Solana Programs", "size": 100}
]

# Add edges between layers
layer_edges = [
    {"source": "LAYER_MOBILE", "target": "LAYER_BACKEND", "type": "calls_api", "weight": 50, "description": "Mobile consumes REST API"},
    {"source": "LAYER_MOBILE", "target": "LAYER_ANCHOR", "type": "sends_tx", "weight": 50, "description": "Mobile sends Solana transactions"},
    {"source": "LAYER_BACKEND", "target": "LAYER_ANCHOR", "type": "reads_state", "weight": 50, "description": "Backend reads/writes Solana state"}
]

# Connect all existing nodes to their respective layers
for n in nodes:
    fid = n.get("id", "")
    if fid.startswith("mobile_"):
        layer_edges.append({"source": "LAYER_MOBILE", "target": fid, "type": "contains", "weight": 5})
    elif fid.startswith("backend_"):
        layer_edges.append({"source": "LAYER_BACKEND", "target": fid, "type": "contains", "weight": 5})
    elif fid.startswith("anchor_"):
        layer_edges.append({"source": "LAYER_ANCHOR", "target": fid, "type": "contains", "weight": 5})

# Avoid duplicates
existing_node_ids = {n["id"] for n in nodes}
for ln in layer_nodes:
    if ln["id"] not in existing_node_ids:
        nodes.append(ln)

edges.extend(layer_edges)

with open("graphify-out/graph.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

