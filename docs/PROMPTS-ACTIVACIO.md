# Prompts d'activació per a Claude Code (Fases 1, 2 i 4)

Aquests prompts s'executen **al teu Mac** amb Claude Code (`claude -p "…"`), que té
les teves credencials (GitHub, Vercel, etc.). Cowork no els pot executar perquè corre
en un entorn aïllat sense accés a la teva màquina.

Ordre recomanat: **Fase 1 → Fase 2 → Fase 4** (la Fase 3 és a Cowork; la 5 és la prova final).

---

## Fase 1 — Publicació automàtica (Vercel + etiqueta `auto`) · Linear PER-14

```
claude -p "Fase 1 del projecte web-atleticmontblanc (Linear PER-14): deixar la publicació automàtica llesta.

1. Fes 'git push origin main' per pujar el commit pendent.
2. Comprova si el repo ja està connectat a Vercel: 'vercel ls' (si no tens la CLI, instal·la-la amb 'npm i -g vercel' i fes 'vercel login').
3. Si no està connectat, executa 'vercel link' i després 'vercel --prod' per fer el primer desplegament de producció. Anota la URL.
4. Crea l'etiqueta 'auto' al repo de GitHub: 'gh label create auto --description \"PR que auto-mergeja si el build passa\" --color 0E8A16' (si no tens gh, instal·la-la o fes-ho manualment a github.com → Issues → Labels).
5. Recorda'm que he d'anar a GitHub → Settings → Actions → General → Workflow permissions → Read and write.
6. Fes un resum del que ha quedat fet i què falta."
```

**Verificació manual:** push a `main` desplega producció; un PR genera preview; existeix
l'etiqueta `auto`.

---

## Fase 2 — Bot de Telegram + tokens · Linear PER-15

> El bot es crea des del **teu Telegram** (Claude Code no pot parlar amb @BotFather per tu).
> Fes primer els passos a) i b) tu mateix, i després executa el prompt per a c)-e).

a) A Telegram, @BotFather → `/newbot` → guarda el **token**.
b) @userinfobot → guarda el teu **chat ID**.

```
claude -p "Fase 2 del projecte web-atleticmontblanc (Linear PER-15): configurar els tokens locals.

Et passo el token del bot i el meu chat ID:
- TELEGRAM_BOT_TOKEN: <ENGANXA_AQUÍ>
- TELEGRAM_ALLOWED_CHAT_ID: <ENGANXA_AQUÍ>

1. Comprova que existeix automation/.env (si no, copia'l de automation/.env.example).
2. Omple TELEGRAM_BOT_TOKEN i TELEGRAM_ALLOWED_CHAT_ID amb els valors de dalt.
3. Per LINEAR_API_KEY: recorda'm que l'he de generar a Linear → Settings → API i enganxar-la.
4. LINEAR_TEAM_ID ja el sabem: dd744ba5-1197-4ed2-8571-69f3b125c820 (team PERSONAL). Posa'l.
5. Instal·la jq si cal ('brew install jq').
6. Verifica que automation/.env NO surt a 'git status' (ha d'estar ignorat).
7. Prova: envia un missatge al bot i fes una crida a getUpdates per veure que el reps."
```

---

## Fase 4 — Claude Code developer + launchd · Linear PER-17

> Requereix que les Fases 1-3 estiguin fetes (ha d'haver-hi alguna tasca a Linear en estat Todo).

```
claude -p "Fase 4 del projecte web-atleticmontblanc (Linear PER-17): activar l'agent developer local.

1. Verifica que tens el connector de Linear actiu a Claude Code.
2. Executa manualment 'bash automation/run-agent.sh' i comprova que: agafa una tasca Todo de Linear, edita el contingut, 'npm run build' passa, obre un PR amb etiqueta 'auto', mou la tasca a Done i envia confirmació per Telegram.
3. Si el build falla, confirma que NO fa push i la tasca queda a Todo.
4. Edita les 4 rutes '/RUTA/AL/REPO' del fitxer automation/cat.atleticmontblanc.agent.plist amb la ruta real d'aquest repo.
5. Instal·la el launchd:
   cp automation/cat.atleticmontblanc.agent.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/cat.atleticmontblanc.agent.plist
6. Fes un resum i recorda'm com aturar-lo (launchctl unload …)."
```

---

## Fase 3 (recordatori) — a Cowork, no a Claude Code
Obre Cowork i digues "mira Telegram" o executa `/telegram-inbox`. Cowork crea les
tasques detallades a Linear (estat Todo) que després agafa la Fase 4.
