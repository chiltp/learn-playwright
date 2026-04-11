#!/bin/bash
# Open HTML Report After Test Run
# Hook: PostToolUse:Bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ "$COMMAND" == *"playwright test"* ]]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Opening Playwright HTML report..."
    npx playwright show-report
fi
