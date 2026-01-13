#!/usr/bin/env bash
set -e

# Colors and formatting
BOLD='\033[1m'
RESET='\033[0m'
BLUE='\033[34m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
CYAN='\033[36m'

if [ -z "$1" ]; then
  echo -e "${RED}${BOLD}Error:${RESET} Missing iterations argument"
  echo -e "${BOLD}Usage:${RESET} $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  echo -e "\n${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BLUE}${BOLD}Iteration $i${RESET}"
  echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"

  result=$(claude --permission-mode bypassPermissions -p "@tasks.yaml @progress.txt

Pick ONE task from tasks.yaml following this priority order:

a. **Rejected task exists?** Fix issues described in description of first Rejected task
b. **Implemented task exists?** Test first Implemented task:
   - Read description carefully to understand expected behavior
   - Start dev server with \`pnpm dev\` if needed
   - Navigate to http://localhost:5173 in chrome-mcp
   - Verify UI renders correctly and all interactions work as described
   - If works: change status to Accepted
   - If broken: change status to Rejected, add failure details to description
c. **Todo task exists?** Implement first Todo task:
   - Create new branch for feature
   - Implement the feature
   - Run \`pnpm lint\` and \`pnpm test\` - must pass
   - Start dev server, verify in chrome-mcp at http://localhost:5173
   - Change status to Implemented
   - Append implementation notes to description (keep original requirements)
   - Append progress to progress.txt
   - Commit changes
   - Open PR using gh
d. **All Accepted?** Output <promise>COMPLETE</promise>

CRITICAL:
- Work on ONE task only
- DO NOT modify original task requirements in description
- For Implemented tasks: ONLY verify, do not implement
- For Rejected tasks: Fix what's broken, then set to Implemented
- Status flow: Todo -> Implemented -> Accepted OR Implemented -> Rejected -> Implemented -> Accepted")

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo -e "\n${GREEN}${BOLD}✓ Task complete${RESET} - All iterations finished\n"
    terminal-notifier -sound Glass -title "Claude Code" -message "Task finished ✅"
    exit 0
  fi

done

echo -e "\n${GREEN}${BOLD}✓ All $1 iterations complete${RESET}\n"
