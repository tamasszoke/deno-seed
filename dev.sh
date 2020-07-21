#!/bin/bash

echo "[DENO SEED] DEV - Initializing..."
xterm -title "frontend dev" -e "(cd "frontend/" && npm start)" &
xterm -title "backend fmt" -e "(cd "backend/" && denon format)" &
xterm -title "backend test" -e "(cd "backend/" && denon test)" &
xterm -title "backend dev" -e "(cd "backend/" && denon start)"
exit 1
