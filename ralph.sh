set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do 
  echo "Iteration $i"
  echo "------------------------------------------"

  result=$(claude --permission-mode acceptEdits -p "@tasks.yaml @progress.txt
1. Find the highest-priority tasks to work on and work only on that feature.
   This should be the one YOU decide has the highest priority - not necessarily the first in the list.
2. Check that linters and tests passes with \`pnpm lint\` and \`pnpm test\`
3. Update tasks.yaml with the work that was done.
4. Append your progress to progress.txt file.
   Use this to leave a note for the next person working in the codebase.
5. Make a commit of that feature.

ONLY WORK ON A SINGLE FEATURE
If, while implementing the feature, you notice the feature complete, output <promise>COMPLETE</promise>")

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "Task complete, exiting."
    terminal-notifier -sound Glass -title "Claude Code" -message "Task finished ✅"  
    exit 0
  fi

done
