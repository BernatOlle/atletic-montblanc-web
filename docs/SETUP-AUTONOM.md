# Setup del sistema — COST 0, només Claude (Cowork redacta · Claude Code desenvolupa)

Gestió de la web escrivint per Telegram, sense cost addicional (la teva
subscripció de Claude) i sense servidors. Tres rols:

- **Cowork** = redactor: llegeix Telegram i escriu la tasca detallada a Linear.
- **Claude Code** = developer: agafa les tasques de Linear i les implementa.
- **GitHub Actions + Vercel** = validen i publiquen (gratis).

> Detalls i comportament del Mac: `ARQUITECTURA.md` (§3 i §7).

---

## Flux

```
Escrius al bot de Telegram
   → obres Cowork i dius: /telegram-inbox   (Cowork crea tasca detallada a Linear, estat Todo)
Mac encès → launchd llança automation/run-agent.sh
   → Claude Code sondeja Linear, agafa la tasca, edita, npm run build, push + PR "auto", tasca → Done
   → GitHub fa merge si compila → Vercel publica → confirma per Telegram
```

---

## Requisits

- **Claude Code** instal·lat, amb sessió i amb el **connector de Linear** actiu.
- **Cowork** amb el connector de **Linear** actiu.
- **jq**: `brew install jq`. Node i git ja els tens.

---

## Pas 1 — Bot de Telegram
1. @BotFather → `/newbot` → guarda el **token** (`TELEGRAM_BOT_TOKEN`).
2. @userinfobot → el teu **chat ID** (`TELEGRAM_ALLOWED_CHAT_ID`).

## Pas 2 — Linear
1. Settings → API → Personal API keys → crea `LINEAR_API_KEY`.
2. Tria/crea un **Team** per a la web i copia el seu ID (`LINEAR_TEAM_ID`).
3. (Opcional) crea una etiqueta `web` per a les tasques.

## Pas 3 — Tokens locals
```bash
cd /RUTA/AL/REPO/automation
cp .env.example .env
# omple: TELEGRAM_BOT_TOKEN, TELEGRAM_ALLOWED_CHAT_ID, LINEAR_API_KEY, LINEAR_TEAM_ID
```
`automation/.env` està al `.gitignore`: mai es committeja.

## Pas 4 — Publicació (GitHub + Vercel, gratis)
1. Connecta el repo a **Vercel** (preview per PR; prod en merge a `main`).
2. Crea l'etiqueta `auto` al repo GitHub. `auto-merge.yml` fa merge dels PR amb
   aquesta etiqueta **només si el build compila**.

---

## Pas 5 — Provar el flux sencer (a mà)

1. Escriu una petició al bot, p. ex.: *"Crea una notícia: obert el període
   d'inscripció de la Sant Joan 2027"*.
2. Obre **Cowork** i executa **`/telegram-inbox`**. Hauria de llegir el missatge,
   crear una tasca detallada a Linear (Todo) i confirmar-te l'enllaç.
3. Al Mac, executa l'agent developer:
   ```bash
   cd /RUTA/AL/REPO && bash automation/run-agent.sh
   ```
   Hauria d'agafar la tasca, fer els canvis, `npm run build`, obrir un PR i moure la
   tasca a Done. Revisa `automation/agent.log` si cal.
4. Comprova el PR a GitHub i, si compila, el merge automàtic i la publicació a Vercel.

---

## Pas 6 — Programar Claude Code amb launchd

1. Edita `automation/cat.atleticmontblanc.agent.plist` i posa la ruta real del repo
   a `/RUTA/AL/REPO` (4 llocs).
2. ```bash
   cp automation/cat.atleticmontblanc.agent.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/cat.atleticmontblanc.agent.plist
   ```
Claude Code correrà **en encendre el Mac** i **cada 15 min**. Per aturar-lo:
`launchctl unload ~/Library/LaunchAgents/cat.atleticmontblanc.agent.plist`.

> Cowork (`/telegram-inbox`) el llances tu quan vols (no és automàtic): obres
> Cowork i dius "mira Telegram". Claude Code sí que és automàtic via launchd.

---

## Què passa si el build falla?
- Claude Code **no fa push** si `npm run build` falla localment.
- Si un PR no compila a CI, `auto-merge.yml` **no fa merge** i comenta l'error. La
  producció no canvia. La tasca de Linear queda sense passar a Done.

---

## Seguretat
- Només el teu chat ID es té en compte (Cowork ignora la resta).
- Cap token al codi: tot a `automation/.env` (ignorat per git).
- Claude Code corre amb `--permission-mode acceptEdits`: pot editar el repo i fer
  git. Revisa `run-agent.sh` si vols afinar permisos.

---

## Coneixement (Obsidian)
Skills, convencions i decisions → Obsidian; contingut publicable → `git`.
Per donar context del vault, afegeix la ruta al prompt de `/telegram-inbox` (perquè
Cowork redacti millor) i/o a `run-agent.sh`. Quan afinis instruccions, actualitza
`.claude/commands/web.md`, `.claude/commands/telegram-inbox.md` i `docs/CONTINGUT.md`.
