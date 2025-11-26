# HabApp

HabApp is a Discord bot for the Habaq Collective that turns slash commands into project management actions tailored to Arabic-first workflows. It combines core services for projects, tasks, templates and loyalty/status with Discord-specific adapters so work can be driven directly inside Discord.

## Structure

- `src/index.js`  
  Entrypoint. Sets up the Discord.js client, loads commands and forwards interactions to handlers.

- `src/discord/`  
  Adapters that:
  - parse interactions
  - call core services
  - format replies such as forum threads, task lists and Arabic summaries

- `src/core/`  
  Core logic and JSON-backed storage for:
  - projects and pipelines
  - tasks and templates
  - loyalty/status rules and copy

- `src/commands/`  
  Slash command definitions consumed by `deploy-commands.js`. Includes project flows such as creating and scaffolding project forums.

- `data/`  
  JSON files for projects, tasks, members and work logs. This will be hidden behind a repository abstraction in later versions.

## What it can do

- Create, update, delete and scaffold projects, including inspecting associated tasks.
- Add, complete, delete and list tasks.
- Spawn tasks from Arabic templates by unit and size via `/template task-spawn`.
- Browse production templates (A/B/C families) that show Arabic summaries on project creation.
- Show program status overviews and reward snippets through `/status` subcommands.

## Architecture direction

HabApp is moving toward a clear split between core and adapters:

- Core in `src/core/` stays UI-agnostic and will eventually consume an injectable storage layer. At the moment it still reads and writes JSON directly.
- Discord adapters in `src/discord/` own all Discord.js wiring, with `src/index.js` becoming a thin event forwarder.
- A `createCoreContext` helper in `src/core/context.js` will bundle core use cases and shared concerns such as clock and data paths so adapters only speak to a single interface.

Planned service layout:

- `src/core/services/` for project, task, template, status and member services.
- `src/discord/adapters/` for command and event handlers.

## Tests and operations

- `npm test`  
  Runs Node based tests that cover storage, templates, status logic and project or task flows.

- `node deploy-commands.js`  
  Registers or updates slash commands in Discord based on `src/commands/`.

## Roadmap

- Finalize Arabic facing text for all user-visible replies.
- Lock in production template families (A, B, C and internal vs external variants).
- Build out the loyalty and status system in `src/core/status.js` and connect it to project creation and task completion.
- Continue the architecture transition:
  - core services under `src/core/services/`
  - Discord adapters under `src/discord/adapters/`
  - unified `createStore` abstraction with injectable data paths
  - stronger unit tests around storage and status behavior.
