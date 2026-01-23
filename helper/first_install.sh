#!/bin/bash

echo "🚀 FADS bereitet dein neues Monorepo vor..."

# 1. Berechtigungen setzen (755 -> -rwxr-xr-x)
echo "📁 Setze Dateiberechtigungen für Skripte..."
chmod 755 fads.orchestrator.dev.js
chmod 755 helper/clean_all.sh

# 2. Git Executable Bit setzen (für Cross-Plattform Konsistenz)
git update-index fads.orchestrator.dev.js
git update-index helper/clean_all.sh

# 3. Validierung der Umgebung
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "⚠️  Warnung: docker-compose ist nicht installiert."
fi

if ! [ -x "$(command -v pnpm)" ]; then
  echo "⚠️  Warnung: pnpm ist nicht installiert."
fi

echo "✅ Setup abgeschlossen. Du kannst jetzt mit 'node orchestrator.js' starten."
