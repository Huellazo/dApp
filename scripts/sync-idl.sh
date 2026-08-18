#!/bin/bash
set -e

echo "Building Anchor programs..."
cd anchor
anchor build

echo "Syncing IDL to mobile..."
cd ..
mkdir -p mobile/idl
cp anchor/target/idl/huellazo.json mobile/idl/huellazo.json
cp anchor/target/idl/vault.json mobile/idl/vault.json 2>/dev/null || true

echo "IDLs synchronized successfully."
