#!/bin/bash
# Log Test Run
# Hook: PostToolUse:Bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
EXIT_CODE=$(echo "$INPUT" | jq -r '.tool_response.exit_code // 0')

if [[ "$COMMAND" == *"playwright test"* ]]; then
    if [ "$EXIT_CODE" -eq 0 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Playwright test PASSED"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Playwright test FAILED (exit code: $EXIT_CODE)"
    fi
fi
