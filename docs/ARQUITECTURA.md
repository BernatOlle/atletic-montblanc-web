# Arquitectura — Gestió de la web per Telegram (Club Atlètic Montblanc)

> Document de planificació. Objectiu: poder **escriure per Telegram** el que vols
> canviar/desenvolupar a la web, que això es converteixi en **tasques detallades a
> Linear**, que un **agent developer (Claude Code)** les executi sobre el codi
> Astro, i obrir un **Pull Request** perquè tu el revisis i facis merge.
> El coneixement (skills, convencions, decisions, memòria) viu a **Obsidian**.

---

## 1. Decisions preses

| Tema | Decisió |
|------|---------|
| Mode de funcionament | **Cost 0, només Claude.** Tres rols ben separats (vegeu sota) |
| **Cowork** (redactor) | Tu obres Cowork i li dius "mira Telegram". Interpreta les peticions i les escriu **detallades a Linear** |
| **Claude Code** (developer) | Corre al Mac per `launchd`; **sondeja Linear**, agafa les tasques "Todo", les implementa, build + push + PR |
| Cervell | **El teu MacBook** amb la teva **subscripció de Claude**. NO usa l'API de pagament ni servidors |
| Linear | **Cua de feina** entre Cowork i Claude Code (pla gratuït) |
| Rol d'Obsidian | **Knowledge base** (memòria + skills + decisions). El contingut de la web continua a `git`. *(§6)* |
| Publicació | **Auto-merge si el build passa** (GitHub Actions, gratis) → Vercel publica |
| Accés al bot | **Només tu** (el teu chat ID de Telegram) |
| Idioma | **Català** |

### Els tres rols (clau d'aquesta arquitectura)

1. **Cowork = redactor.** Tradueix una petició curta de Telegram ("puja la cursa de
   Sant Joan 2027") en una **spec detallada** a Linear: quins fitxers, quins camps
   del frontmatter, quines convencions, criteris d'acceptació. Command: `/telegram-inbox`.
2. **Linear = cua.** Guarda les tasques en estat "Todo". És la memòria visual.
3. **Claude Code = developer.** No interpreta intencions vagues (ja ho ha fet
   Cowork); només **executa** la spec: edita, valida amb `npm run build`, push + PR.

> **Versió implementada.** `.claude/commands/telegram-inbox.md` (Cowork redactor),
> `automation/run-agent.sh` (Claude Code sondeja Linear), `automation/*.plist`
> (launchd), `.github/workflows/auto-merge.yml` (merge gratis). Guia: `SETUP-AUTONOM.md`.
>
> **Compromís honest:** cost 0 = el cervell és el Mac. Claude Code processa les
> tasques **quan el Mac està encès** (o en despertar). Amb el Mac apagat, les
> tasques esperen a Linear. Per ser desatès amb el Mac apagat caldria l'API (§7).

---

## 2. Visió en una frase

```
Telegram (tu escrius, des del mòbil)  →  els missatges queden al xat del bot
        │
        ▼  tu obres Cowork i li dius "mira Telegram"
COWORK (redactor)  → /telegram-inbox: interpreta i escriu tasca DETALLADA a Linear (Todo)
        │
        ▼
LINEAR (cua de feina)  ←——— Obsidian aporta context (skills/convencions)
        │
        ▼  [MacBook encès] launchd llança automation/run-agent.sh
CLAUDE CODE (developer, subscripció, cost 0)
        │  sondeja Linear "Todo" · edita la web · npm run build · push + PR "auto" · tasca → Done
        ▼
GitHub Actions (auto-merge.yml, gratis)  →  build verd?  →  merge a main
        ▼
Vercel publica producció  →  Claude Code confirma per Telegram
```

**Pas humà:** escriure la petició i obrir Cowork per redactar-la. La implementació és automàtica.

---

## 3. Per què el cervell és el Mac (cost 0, només Claude)

La clau de "cost 0 + només Claude" és **no usar l'API de pagament d'Anthropic ni
servidors al núvol**. L'únic Claude sense cost addicional és la teva **subscripció**:
- **Cowork** corre quan tu l'obres (redacta les tasques a Linear).
- **Claude Code** corre al Mac via `launchd` (implementa les tasques de Linear).

Conseqüència (resposta a la teva pregunta del Mac):

- Les peticions **no es perden**: primer queden al xat de Telegram; un cop Cowork
  les passa a Linear, queden a la cua de Linear fins que Claude Code les agafa.
- `launchd` executa Claude Code **en encendre el Mac** (`RunAtLoad`) i **cada 15 min**.
  Si el Mac estava **adormit**, s'executa **en despertar**. Si està **apagat**, les
  tasques esperen a Linear i es processen en encendre'l.

Per què NO les alternatives:
- **API d'Anthropic + GitHub Actions**: desatès amb el Mac apagat, però **es paga
  per ús** → trenca el "cost 0".

> Si algun dia acceptes un cost per token, afegint un workflow amb
> `anthropics/claude-code-action` el rol de Claude Code passa al núvol i deixa de
> dependre del Mac. Cowork, Linear, auto-merge i Vercel no canvien.

---

## 4. El cor: l'agent developer (Claude Code)

Aquí és on s'aprofita tot el que **ja tens fet** al repo:

- `src/content/config.ts` — esquema Zod (font de veritat dels camps).
- `.claude/commands/web.md` — el command `/web` que ja guia la creació/edició de
  contingut sense tocar codi.
- `docs/CONTINGUT.md` — convencions de noms, imatges, camps que caduquen, destacats.
- `src/lib/races.ts` — registre de curses.

L'agent (`automation/run-agent.sh`) invoca **Claude Code headless**
(`claude -p "…"`) amb la teva subscripció. **Ja no interpreta Telegram** (això ho
fa Cowork): llegeix la spec detallada que Cowork ha deixat a Linear i l'implementa.

### Com s'executa (al Mac, cost 0)
1. `launchd` (`automation/cat.atleticmontblanc.agent.plist`) llança el script en
   encendre el Mac i cada 15 min.
2. El script consulta **Linear** per tasques en estat "Todo" del team.
3. Per cada tasca, crida `claude -p` passant-li el títol i la descripció (la spec).
4. Claude edita, valida amb `npm run build`, obre el PR amb etiqueta `auto`, mou la
   tasca a "Done" i et confirma per Telegram.

> No hi ha `ANTHROPIC_API_KEY` enlloc: el cost recau a la teva subscripció via
> Claude Code i Cowork, no a l'API.

---

## 5. Vercel: PR → preview → producció

- Connecta el repo de GitHub a Vercel (ja apuntes a `atletic-montblanc-web.vercel.app`).
- Cada **PR** genera un **deploy de preview** automàtic → revises el resultat real
  al navegador abans de fer merge.
- En fer **merge a `main`** → deploy de **producció** automàtic.

Així el teu flux d'aprovació "Auto-PR + revisió" queda reforçat amb una preview
visual de cada canvi.

---

## 6. Rol d'Obsidian (recomanació)

**Recomano: Obsidian = knowledge base, NO contingut de la web.**

| Què va a Obsidian | Què NO va a Obsidian |
|-------------------|----------------------|
| Skills i instruccions de l'agent | El contingut publicable (markdown de carreres/caminades/notícies) → va a `git` |
| Convencions i decisions ("per què ho fem així") | L'esquema Zod → viu a `config.ts` |
| Memòria de projecte (estat, idees, pendents) | Imatges → `/public/images/` |
| Plantilles de peticions de Telegram → Linear | |

**Per què separar-ho així:**
- El contingut de la web ha de passar per validació Zod + build + PR. Si visqués a
  Obsidian, perdries aquesta xarxa de seguretat.
- Obsidian és ideal per a coneixement enllaçat (`[[links]]`), que és exactament el
  que necessita l'agent per entendre el context — no per ser la base de dades de
  producció.
- Mantens **una sola font de veritat per a cada cosa**: codi a git, coneixement a
  Obsidian. Sense duplicar.

**Com s'hi connecta l'agent:** la carpeta d'Obsidian és només una carpeta de fitxers
`.md`. Com que l'agent corre **local al Mac** (cost 0), Claude Code la pot llegir
directament — pots passar la ruta del vault al prompt o tenir-lo dins l'abast del repo.

> Si en el futur vols redactar **esborranys** de notícies a Obsidian, es pot afegir
> un pas de sync Obsidian→`src/content/`, però comença sense això per simplicitat.

---

## 7. La teva pregunta: tasques amb el Mac en pausa o apagat

Com que el cervell és el Mac (cost 0), aquest és el comportament real:

| Estat del Mac | Què passa amb les tasques de Linear |
|---------------|--------------------------------------|
| Encès i actiu | Claude Code les agafa en ≤15 min (o a l'instant en encendre) |
| **Adormit (pausa)** | `launchd` executa Claude Code **en despertar** el Mac |
| **Apagat** | Les tasques esperen a Linear; es desenvolupen **en encendre'l** |

Detalls:
- Fem servir **`launchd`** (no `cron`). Amb `RunAtLoad: true` Claude Code corre **en
  iniciar sessió** (= en encendre el Mac), i amb `StartInterval` cada 15 min.
- Cap feina es perd: les peticions queden primer al **xat de Telegram** (fins que
  obres Cowork) i després a la **cua de Linear** (fins que el Mac s'encén).

**Per ser desatès amb el Mac apagat** caldria moure el cervell al núvol amb l'API
de pagament. Mentre vulguis cost 0, el Mac encès és la condició — però gràcies a la
cua de Telegram, n'hi ha prou que l'encenguis de tant en tant.

---

## 8. Pla d'implementació per fases

### Fase 0 — Demo per a l'equip
- [ ] `npm run dev` per ensenyar la web nova i el command `/web` en directe.
- [ ] Explicar aquest flux amb el document i el diagrama.

### Fase 1 — Publicació automàtica (gratis)
- [ ] Connectar el repo a **Vercel** (preview per PR + prod en merge a `main`).
- [ ] El workflow `.github/workflows/auto-merge.yml` ja fa build + merge si compila.
- [ ] Crear l'etiqueta `auto` al repo.

### Fase 2 — Linear + Cowork redactor
- [ ] Crear team/projecte a Linear i obtenir `LINEAR_TEAM_ID` + `LINEAR_API_KEY`.
- [ ] Connectar el connector de Linear a Cowork.
- [ ] Provar el command `/telegram-inbox`: Cowork llegeix Telegram i crea una tasca
      detallada a Linear (estat Todo).

### Fase 3 — Claude Code developer (cost 0)
- [ ] `brew install jq`, Claude Code instal·lat, amb sessió i connector de Linear.
- [ ] Crear `automation/.env` des de `.env.example` amb els tokens.
- [ ] Provar `bash automation/run-agent.sh`: agafa la tasca Todo i obre un PR.
- [ ] Instal·lar el `launchd` plist (editar les rutes). Vegeu `docs/SETUP-AUTONOM.md`.

### Fase 4 — Obsidian com a knowledge base
- [ ] Crear el vault: `skills/`, `convencions/`, `decisions/`, `memoria/`.
- [ ] Passar la ruta del vault al prompt de l'agent perquè el llegeixi.

---

## 9. Riscos i com mitigar-los

| Risc | Mitigació |
|------|-----------|
| L'agent escriu contingut incorrecte | `npm run build` valida Zod abans del push + auto-merge només si CI compila + preview de Vercel |
| Tokens exposats | `automation/.env` al `.gitignore`; mai al repo |
| Duplicar font de veritat (Obsidian vs git) | Regla clara: codi→git, coneixement→Obsidian (§6) |
| Mac apagat = no es processa | Les tasques esperen a Linear; es desenvolupen en encendre (§7) |
| Petició de Telegram ambigua | **Cowork** la detalla abans (criteris d'acceptació, dubtes a resoldre); Claude Code rep una spec clara, no una intenció vaga |

---

## 10. Resum executiu

1. **Cost 0, només Claude**, amb tres rols separats: **Cowork** redacta (Telegram →
   tasca detallada a Linear), **Claude Code** desenvolupa (Linear → codi + PR),
   **GitHub Actions + Vercel** validen i publiquen (gratis). **Obsidian** = coneixement.
2. Aquesta separació és el que fa el sistema fiable: Claude Code no ha d'endevinar
   què volies; rep una **spec clara** que Cowork ja ha pensat seguint les convencions.
3. **El Mac processa quan està encès** (o en despertar). Amb el Mac apagat les
   tasques esperen a Linear. Per ser desatès amb el Mac apagat caldria l'API de pagament.
4. Ja tens fet el més difícil: l'esquema Zod, el command `/web` i les convencions.
   Els fitxers (`/telegram-inbox`, `automation/`, `auto-merge.yml`) ja estan creats;
   només cal seguir `docs/SETUP-AUTONOM.md` per activar-ho.

---

### Fonts consultades
- [Claude Code GitHub Actions — docs oficials](https://code.claude.com/docs/en/github-actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- [Scheduled jobs on macOS with launchd](https://blog.darnell.io/automation-on-macos-with-launchctl/)
- [Scheduling a Cron Job on macOS with Wake Support](https://deniapps.com/blog/scheduling-a-cron-job-on-macos-with-wake-support)
