#!/bin/bash
# Validate Test Naming
# Hook: PreToolUse:Write

FILE=$1

# Check if the file is a test file and validate naming convention
if [[ "$FILE" == *tests/* ]]; then
    FILENAME=$(basename "$FILE")
    if [[ ! "$FILENAME" == *.spec.js ]]; then
        echo "Error: Test file '$FILENAME' does not follow naming convention '*.spec.js'"
        exit 1
    fi
fi