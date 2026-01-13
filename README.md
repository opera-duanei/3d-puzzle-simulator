# Twisty simulator

Deployed here [twisty-simulator.vercel.app](https://twisty-simulator.vercel.app/)

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## How I used Claude Code

**Workflow:**

- **Task manager driven** - tasks.yaml + ralph.sh automated multi-iteration development
- **Status-based progression** - Todo → Implemented → Accepted/Rejected flow
- **Chrome DevTools MCP** - Browser testing after every UI change at http://localhost:5173
- **Automated verification** - `pnpm lint` + `pnpm test` before commits
- **Progress tracking** - progress.txt append-only log of implementations

**Key iterations:**

- **"Support all notations"** → Implemented 69 moves but input broken → Fixed with move-handler.ts refactor
- **"Add interactive controls"** → Raycaster + velocity thresholds for drag-to-rotate with snap logic
- **"Fix light source"** → Attached DirectionalLight to camera for consistent illumination

**Prompt examples:**

```
"It should be possible to rotate cube layers by click and dragging"
→ Three.js Raycaster + world normal calculation + OrbitControls disable during drag

"Shuffling should always happen from a solved cube"
→ Reset state before 25-move random algorithm execution
```

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
