# Twisty simulator

Deployed here [twisty-simulator.vercel.app](https://twisty-simulator.vercel.app/)

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## How I used Claude Code

**Workflow:**

- **Task manager driven** I've used a file called tasks.yaml. This represents a
  simple Kanban board with a Title, Description and Status field. A long running
  bashscript [ralph.sh](https://www.youtube.com/watch?v=_IK18goX4X8) picks task
  for this board and implement them. In this case, claude decides which tasks to
  work on next, implements it and opens a PR for it. Claude then moves on to the
  next task.
- **Status-based progression** - I noticed even with chrome mcp and explicit
  instructions to test the changes, claude did a terrible job evaluating whether
  the changes work correctly. Therefore, I added statuses such that:
  - `Todo`: Something to be picked up, implemented and tested. Afterwards, change
    status to `Implemented`, then exit.
  - `Implemented`: Something that to be tested. Afterwards, change status `Accepted` or `Rejected`.
  - `Rejected`: Something that needs fixing and retesting. Afterwards, change status to `Implemented`.
  - `Accepted`: Done and accepted. A PR has been opened.

**Task examples:**

```yml
- title: Shuffle cube
  status: Implemented
  description: |
    It should be possible to shuffle the cube
    - Shuffle algorithm should be visible on the screen
    - There should be a button to generate a new shuffle
    - When a new shuffle is triggered, it should animate the shuffle
    - Shuffling should always happen from a solved cube.
    - Use 25 random moves to shuffle
```

```yml
- title: Fix light source
  status: Implemented
  description: |
    Something seems to be wrong with then light source.
    It looks like the camera is moving, because one side of the cube is darker than the other.
    When we rotate the cube, we want the cube to rotate, not the camera. We want the light to have a consistent direction, independently of the cube rotation.
```

In the end, the results were terrible. Lots of broken PRs still made it
through. The solutions seem to solve the wrong problems and the code is awfully
designed. This workflow might be better for a more mature project with more
"conventional specs", such as multi-page CRUD frontend.

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
