#!/bin/bash
# Log Test Run
# Hook: PostToolUse:Bash

COMMAND=$1
EXIT_CODE=$2

if [[ "$COMMAND" == *playwright\ test* ]]; then
    if [ "$EXIT_CODE" -eq 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Playwright test PASSED"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Playwright test FAILED (exit code: $EXIT_CODE)"
    fi
fi
