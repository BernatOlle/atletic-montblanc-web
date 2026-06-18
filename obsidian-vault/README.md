# Vault de coneixement — Club Atlètic Montblanc (web)

Aquest vault és el **cervell** del sistema de gestió autònoma de la web. Guarda el
coneixement; el contingut publicable viu a `git` (carpeta `src/content/`).

## Estructura

- **`skills/`** — instruccions reutilitzables per als agents (com fer X).
- **`convencions/`** — regles vives de contingut (còpia/enllaç de `docs/CONTINGUT.md`).
- **`decisions/`** — per què s'ha decidit cada cosa (registre de decisions, ADR-lite).
- **`memoria/`** — estat del projecte, idees, pendents, aprenentatges.

## Com es connecta

- **Cowork** (`/telegram-inbox`) llegeix aquest vault per redactar tasques amb context.
- **Claude Code** (`automation/run-agent.sh`) el pot llegir en implementar.

## Regla d'or

Coneixement → aquí. Contingut publicable → `git`. Esquema de dades → `src/content/config.ts`.
No dupliquis: cada cosa té una única font de veritat.
