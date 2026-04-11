#!/bin/bash
# Read the JSON input from stdin
INPUT=$(cat)

# Get the file path that was written
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Only check .spec.js files
if [[ "$FILE_PATH" != *.spec.js ]]; then
    exit 0
fi

# Check for at least one expect()
if ! grep -q "expect(" "$FILE_PATH" 2>/dev/null; then
  echo "Missing assertions: no expect() found in $FILE_PATH"
    exit 2
fi

exit 0
