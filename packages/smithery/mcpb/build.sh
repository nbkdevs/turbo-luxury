#!/usr/bin/env bash
# Build dist/turbo-luxury-mcp-<version>.mcpb (MCPB bundle for Smithery's stdio route).
set -euo pipefail
cd "$(dirname "$0")/.."
VER=$(node -p "require('./package.json').version")
STAGE=dist/mcpb-stage
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -r src package.json package-lock.json README.md LICENSE "$STAGE"/
cp mcpb/manifest.json "$STAGE"/manifest.json
(cd "$STAGE" && npm ci --omit=dev --ignore-scripts --no-audit --no-fund >/dev/null)
npx -y @anthropic-ai/mcpb@2.1.2 validate "$STAGE/manifest.json"
npx -y @anthropic-ai/mcpb@2.1.2 pack "$STAGE" "dist/turbo-luxury-mcp-$VER.mcpb"
npx -y @anthropic-ai/mcpb@2.1.2 info "dist/turbo-luxury-mcp-$VER.mcpb"
