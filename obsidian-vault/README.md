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

## Enllaços del projecte

- **Repo local:** `/Users/bernatolle/Bernat/Proyectos/atletic_montblanc_web`
- **GitHub:** https://github.com/BernatOlle/atletic-montblanc-web
- **Web actual (vella):** https://atleticmontblanc.cat/
- **Deploy (nova):** https://atletic-montblanc-web.vercel.app
- **Linear (projecte):** https://linear.app/bernatollef/project/web-atleticmontblanc-d2b108b79db4

## Notes del vault

- [[estat-projecte]] — memòria viva: on som, fet i pendent
- [[registre-canvis]] — diari de canvis fets per l'agent
- [[convencions-contingut]] — noms de fitxer, imatges, camps
- [[redactar-tasques-web]] — skill per convertir peticions en tasques
- [[decisio-model-cost-zero]] — per què el Mac és el cervell

## Regla d'or

Coneixement → aquí. Contingut publicable → `git`. Esquema de dades → `src/content/config.ts`.
No dupliquis: cada cosa té una única font de veritat.
