#!/bin/bash

# Encontrar la raíz del proyecto (donde se encuentra este script, subiendo tres niveles)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../../.." && pwd )"

echo "Levantando el Backend (Node.js/Express)..."
cd "$PROJECT_ROOT/backend" && npm run dev &

echo "Levantando el Frontend (Vite)..."
cd "$PROJECT_ROOT/frontend" && npm run dev &

echo "¡Todo listo! Frontend y Backend están corriendo en paralelo."
# El comando 'wait' mantiene la terminal activa viendo los logs de ambos
wait