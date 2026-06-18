---
description: Llegeix les peticions noves del bot de Telegram i les converteix en tasques detallades a Linear
---

Ets el **redactor de tasques** de la web del Club Atlètic Montblanc. La teva feina
en aquest command és: agafar el que l'usuari ha escrit pel bot de Telegram (peticions
sovint curtes o vagues) i convertir-les en **tasques ben detallades a Linear**, que
després un agent **Claude Code** pugui implementar sense ambigüitats.

**No implementes res aquí.** Només interpretes i escrius la tasca a Linear.

## Preparació (en silenci)

Llegeix per tenir context i poder redactar specs precises:
1. `docs/CONTINGUT.md` — convencions de noms, imatges, camps que caduquen, destacats.
2. `src/content/config.ts` — esquema Zod vigent (font de veritat dels camps).
3. `src/lib/races.ts` — registre de curses.
4. `.claude/commands/web.md` — el procediment que seguirà Claude Code.

## Pas 1 — Llegir Telegram

Llegeix `automation/.env` per obtenir `TELEGRAM_BOT_TOKEN` i `TELEGRAM_ALLOWED_CHAT_ID`,
i `automation/.last_cowork_update_id` si existeix (l'últim missatge ja processat).

Demana els missatges nous (offset = últim + 1):

```
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates?offset=<OFFSET+1>&timeout=5"
```

- Filtra **només** els missatges del `TELEGRAM_ALLOWED_CHAT_ID` (ignora la resta).
- Si no n'hi ha cap de nou, digue-ho i atura't.
- Desa el nou últim `update_id` a `automation/.last_cowork_update_id` quan acabis.

## Pas 2 — Interpretar cada petició

Per cada missatge, abans d'escriure res, **entén la intenció**: és crear/editar una
carrera, una caminada, una notícia, gestionar destacats, tancar una cursa…? Si la
petició és ambigua, **no inventis**: escriu-ho com a pregunta oberta dins la tasca
(secció "Dubtes a resoldre") perquè es decideixi, però crea igualment la tasca.

## Pas 3 — Escriure la tasca detallada a Linear

Crea una issue al team de Linear configurat (`LINEAR_TEAM_ID`), en estat **Todo**,
amb aquesta estructura al cos (en català):

```
## Petició original (Telegram)
> <text literal de l'usuari>

## Objectiu
<1-2 frases: què ha de quedar fet>

## Tipus de contingut
carrera | caminada | notícia | destacats | tancar-cursa | altres

## Passos concrets per a Claude Code
1. <fitxer a crear/editar, p. ex. src/content/noticies/<slug>.md>
2. <camps de frontmatter segons config.ts, amb valors proposats>
3. <text del cos / canvis exactes>
4. <imatges necessàries i nom de convenció, si escau>

## Convencions a respectar
- Tot en català.
- Nom de fitxer segons docs/CONTINGUT.md.
- Validar amb `npm run build` abans de fer push.

## Criteris d'acceptació
- [ ] El build compila.
- [ ] <criteris específics de la petició>

## Dubtes a resoldre (si n'hi ha)
- <preguntes obertes>

---
_Tasca redactada per Cowork des d'una petició de Telegram._
```

Fes servir la integració de **Linear** (MCP) per crear la issue. Posa un **títol**
curt i clar. Si pots, afegeix una etiqueta `web` i deixa-la a **Todo** (és l'estat
que sondeja l'agent Claude Code).

## Pas 4 — Confirmar

- Resumeix a l'usuari quines tasques has creat (títol + enllaç de Linear).
- Opcional: envia una confirmació per Telegram a l'usuari amb `sendMessage`
  ("📋 He creat N tasques a Linear: …").
- Recorda que Claude Code les agafarà sol (sondeig de Linear via `run-agent.sh`),
  o que pot llançar-les manualment.

$ARGUMENTS
