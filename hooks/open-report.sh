#!/bin/bash
# Open HTML Report After Test Run
# Hook: PostToolUse:Bash

COMMAND=$1
EXIT_CODE=$2

if [[ "$COMMAND" == *playwright\ test* ]]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Opening Playwright HTML report..."
    npx playwright show-report
fi
