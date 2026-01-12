# Project Context

## CLAUDE.md Management

**This file is a living document.** You should proactively update it:

- **Add** new important context after implementing features
- **Remove** outdated/unnecessary information during updates
- **Reflect desired state** of the project, not necessarily current state
- **Think twice** before changes - ensure alignment with project goals

Update triggers: new patterns, better workflows, architectural decisions, outdated instructions.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Chrome DevTools MCP

You have access to the chrome-devtools MCP server for browser automation and testing.

### When to Use Chrome DevTools:

- **After making UI changes**: ALWAYS test changes by navigating to the page and verifying functionality
- **Before completing tasks**: Validate that components render correctly and interactions work
- **During development**: Take snapshots to inspect DOM structure and verify implementation

### Key Tools:

- `list_pages` - View open browser tabs
- `navigate_page` - Navigate to URLs (use http://localhost:5173 for SvelteKit dev server)
- `take_snapshot` - Get text-based a11y tree of page elements (prefer over screenshots)
- `take_screenshot` - Capture visual state when needed
- `click`, `fill`, `press_key` - Interact with page elements using uid from snapshots
- `evaluate_script` - Run JavaScript to test functionality or extract data
- `list_console_messages` - Check for errors/warnings in browser console
- `list_network_requests` - Debug API calls and resource loading

### Testing Workflow:

1. Make code changes
2. Navigate to page or reload if already open
3. Take snapshot to verify UI rendered
4. Test interactions (click, fill forms, etc.)
5. Check console for errors
6. Validate functionality before marking task complete

**CRITICAL**: Always verify changes in browser before completing frontend tasks.
