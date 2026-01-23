#!/bin/bash
# helper/clean_all.sh

echo "🌆 SHIBUYA: Initialisiere vollständigen Factory Reset..."

# 1. Infrastruktur & Docker (Muss zuerst passieren!)
# Das löscht auch die geschützten 'data' Ordner via Docker-Hilfscontainer
if [ -d "node_modules" ]; then
    echo "📦 Stoppe Infrastruktur und bereinige Container-Daten..."
    pnpm nx run-many -t down --all --outputStyle=static
fi

# 2. Rekursives Löschen aller generierten Dateien und Ordner
echo "🗑️  Lösche alle Artefakte (node_modules, dist, build-infos, caches)..."

# Wir nutzen find, um wirklich jeden versteckten Winkel zu erreichen
# -prune sorgt dafür, dass find nicht in gelöschte Ordner hineinschaut
find . \( \
    -name "node_modules" -o \
    -name "dist" -o \
    -name ".nx" -o \
    -name ".angular" -o \
    -name ".stencil" -o \
    -name "build" -o \
    -name "*.tsbuildinfo" \
\) -exec rm -rf {} +

# 3. Lock-Files und Root-Caches
echo "📄 Entferne Lock-Files..."
rm -f pnpm-lock.yaml
rm -rf .pnpm-store # Falls vorhanden

echo "✨ Der Distrikt ist im Auslieferungszustand."
echo "🚀 SHIBUYA: System bereit für Neu-Installation (pnpm install)."
