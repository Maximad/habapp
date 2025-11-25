# HabApp Project Overview

HabApp is a Discord bot for the Habaq Collective that turns slash commands into
project management actions tailored for the community's Arabic-first workflows.
It combines a small set of core services (projects, tasks, templates, loyalty
status) with Discord adapters so the bot can create tasks, scaffold projects,
post updates, and surface status information directly inside a server.

## High-level flow
- **Entrypoint (`src/index.js`)** wires a Discord.js client, listens for slash
  commands, and routes each subcommand to a handler under `src/discord`.
- **Discord adapters (`src/discord/`)** translate interactions into core
  operations and format replies (e.g., creating forum threads or posting task
  lists).
- **Core logic (`src/core/`)** owns the business rules and JSON-backed storage
  for projects, tasks, reusable templates, and loyalty-status copy.
- **Data (`data/`)** stores the bot's state in JSON files; the architecture
  notes call this out as a candidate for future repository abstraction.

## Key capabilities
- **Projects**: create, stage, delete, scaffold project forums, and inspect
  associated tasks.
- **Tasks**: add, complete, delete, or list tasks for a project, including
  spawning tasks from predefined templates.
- **Templates**: browse Arabic task templates by unit/size and clone them into
  projects via `/template task-spawn`.
- **Status**: show program status info or rewards snippets through `/status`
  subcommands.

## Testing and commands
- `npm test` runs Node's built-in test runner over the core logic.
- `deploy-commands.js` registers the available slash commands with Discord
  using the definitions in `src/commands/`.

See `docs/ARCHITECTURE.md` for a deeper look at the current layering plan and
how the team intends to further separate Discord wiring from the core domain.
