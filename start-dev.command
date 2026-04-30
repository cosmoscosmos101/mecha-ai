#!/bin/bash
cd "$(dirname "$0")"
NODE24="/opt/homebrew/Cellar/node/24.2.0/bin"
[ -d "$NODE24" ] && export PATH="$NODE24:$PATH"
echo ""
echo "================================================"
echo "  Mecha.AI — Next.js dev server"
echo "================================================"
echo "  Path:   $(pwd)"
echo "  Node:   $(node --version)"
echo ""
echo "  Open http://localhost:3000"
echo "  Test: admin@mecha.ai / admin1234"
echo "================================================"
echo ""
export NEXT_TELEMETRY_DISABLED=1
exec npm run dev
