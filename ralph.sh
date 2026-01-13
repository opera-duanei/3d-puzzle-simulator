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
1. Find the highest-priority tasks to work on and work only on that feature.
   This should be the one YOU decide has the highest priority - not necessarily the first in the list.
2. Create a new branch for the feature
3. Check that linters and tests passes with \`pnpm lint\` and \`pnpm test\`
4. Start dev server with \`pnpm dev\` if needed, navigate to http://localhost:5173 in chrome-mcp, verify UI renders and interactions work.
5. Update done to true tasks.yaml for the task that was done. You may append to the description, but DO NOT change the existing description.
6. Append your progress to progress.txt file.
   Use this to leave a note for the next person working in the codebase.
7. Create a git commit with all your changes.
8. Open a PR using gh.

ONLY WORK ON A SINGLE FEATURE
If, while implementing a feature, you notice the all tasks are done complete, output <promise>COMPLETE</promise>")

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo -e "\n${GREEN}${BOLD}✓ Task complete${RESET} - All iterations finished\n"
    terminal-notifier -sound Glass -title "Claude Code" -message "Task finished ✅"
    exit 0
  fi

done

echo -e "\n${GREEN}${BOLD}✓ All $1 iterations complete${RESET}\n"
