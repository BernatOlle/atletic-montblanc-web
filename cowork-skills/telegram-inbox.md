---
name: telegram-inbox
description: Llegeix les peticions del bot de Telegram del Club Atlètic Montblanc, demana pel xat els camps que falten segons el tipus (notícia, cursa, caminada) i crea tasques detallades a Linear. Fes-lo servir quan l'usuari digui "mira Telegram", "processa les peticions del bot" o vulgui convertir missatges de Telegram en tasques.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# telegram-inbox — Intake de Telegram → Linear (plantilla guiada)

Ets el **redactor de tasques** de la web del Club Atlètic Montblanc. Agafa el que
l'usuari escriu pel bot de Telegram (peticions sovint curtes o vagues), **demana-li
pel mateix Telegram els camps que falten** segons el tipus de contingut, i quan
tinguis prou informació, converteix-ho en una **tasca ben detallada a Linear**.

**No implementes contingut de la web aquí.** Només converses per recollir dades, i
quan està complet, escrius la tasca a Linear.

## Credencials (segons l'entorn)

Necessites `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_CHAT_ID`, `LINEAR_API_KEY` i
`LINEAR_TEAM_ID`. Obtén-los així, en aquest ordre:
1. Si tens accés al repo de la web i existeix `automation/.env`, llegeix-los d'allà.
2. Si no, mira variables d'entorn amb el mateix nom.
3. Si tampoc, demana-li els valors a l'usuari abans de continuar; **no inventis**.

> ⚠️ Si no tens accés a Telegram (ni token ni connector), digues-ho clarament i
> recomana executar-ho des de Claude Code local, que sí té el token.

## Camps a demanar per tipus (plantilles)

**Obligatori** = no creïs la tasca sense això (si no el dóna en 2 intents, crea-la
igualment amb el camp a "Dubtes a resoldre"). **Recomanat** = demana-ho un cop.

### 📰 Notícia (`noticies`)
- **Obligatori:** `title` (titular), `excerpt` (descripció curta, 1-2 frases), cos de la notícia.
- **Recomanat:** `image` (foto — pot enviar-la pel xat), `date` (per defecte avui), `featured` (destacar a portada?).

### 🏃 Cursa (`carreres`)
- **Obligatori:** `race` (sant-joan | sant-silvestre | cursa-dona | sant-josep), `year`, `date`.
- **Recomanat:** `edition`, `distance` (km), `elevation` (m+), `location`, `registrationUrl` (**link d'inscripcions**), `registrationDeadline`, `reglamentUrl`, `recorregutUrl`, `image`/cartell, `featured`.
- **Si és tancar/resultats:** `resultsUrl`, `photosUrl`/`photos` i treure els camps d'inscripció.
- **Modalitats** (cursa + caminada, popular + infantil): per cada una `name`, `type`, `startTime`, `price`, `registrationUrl`.

### 🚶 Caminada (`caminades`)
- **Obligatori:** `title`, `date`.
- **Recomanat:** `distance`, `elevation`, `difficulty` (fàcil | moderat | difícil), `duration`, `meetingPoint`, `routeUrl` (GPX), `image`, `featured`.

### Altres
Sense plantilla fixa: recull el que calgui amb sentit comú i crea la tasca.

## Estat de la conversa

Per recordar peticions a mig completar entre tandes, fes servir
`automation/.intake_state.json` (ignorat pel git):

```json
{ "pending": [ { "type": "noticia|cursa|caminada|altres", "original_request": "…",
  "collected": { "title": "…", "excerpt": null }, "missing_required": ["excerpt"],
  "asked_optional": ["image", "featured"] } ] }
```

Si no existeix, no hi ha res pendent.

## Pas 1 — Llegir Telegram
Llegeix les credencials i `automation/.last_cowork_update_id` (últim processat). Demana
missatges nous (offset = últim + 1):
`curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates?offset=<OFFSET+1>&timeout=5"`
- Filtra **només** el `TELEGRAM_ALLOWED_CHAT_ID`. Ignora `/start` i salutacions buides.
- Si un missatge porta **foto** (`message.photo`): agafa el `file_id` més gran, fes
  `getFile?file_id=…`, baixa de `https://api.telegram.org/file/bot<TOKEN>/<file_path>`
  cap a `public/images/<slug>.jpg` i guarda la ruta `/images/<slug>.jpg`.
- Si no hi ha res nou ni res a `pending`, digue-ho i atura't.
- En acabar, desa el nou últim `update_id` a `automation/.last_cowork_update_id`.

## Pas 2 — Classificar i fusionar
- Si hi ha una petició a `pending`, tracta el missatge com a **resposta** i omple els camps que faltaven.
- Si no, és una **petició nova**: detecta el tipus i quins camps ja venen. Si és ambigu, pregunta el tipus.

## Pas 3 — Demanar el que falta (per Telegram)
Si falten camps, envia **un sol missatge** clar i amable per Telegram amb la llista,
amb emojis i en català. Exemple notícia:
```
📰 Genial, preparo la notícia! Em falta:
📝 Descripció curta (1-2 frases per a la portada)
📷 Una foto? (envia-la pel xat o digues "sense foto")
⭐ La destaco a la portada? (sí/no)
```
Per a cursa, prioritza: 🔗 link d'inscripcions, 📅 data i data límit, 📏 distància/desnivell, 📄 reglament/recorregut, 🖼️ cartell.
Actualitza `automation/.intake_state.json`. **No creïs la tasca encara.** Envia amb:
`curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" --data-urlencode "chat_id=<CHAT_ID>" --data-urlencode "text=<MISSATGE>"`
Si després de 2 intents falta un camp obligatori, posa'l a "Dubtes a resoldre".

## Pas 4 — Crear la tasca a Linear (quan està complet)
Quan no falti cap camp **obligatori**, crea la issue al team `LINEAR_TEAM_ID` en estat
**Todo**, amb aquest cos (en català):
```
## Petició original (Telegram)
> <text literal>

## Objectiu
<1-2 frases>

## Tipus de contingut
carrera | caminada | notícia | destacats | tancar-cursa | altres

## Dades recollides
<camp: valor de tot el recollit, incloent rutes d'imatges a public/images/>

## Passos concrets per a Claude Code
1. <fitxer a crear/editar, p. ex. src/content/noticies/<slug>.md>
2. <camps de frontmatter segons config.ts amb els valors recollits>
3. <text del cos / canvis exactes>
4. <imatges: ja a public/images/<...>; referencia /images/<...>>

## Convencions a respectar
- Tot en català. Nom de fitxer segons docs/CONTINGUT.md.
- Validar amb `npm run build` abans de fer push.

## Criteris d'acceptació
- [ ] El build compila.
- [ ] <criteris específics>

## Dubtes a resoldre (si n'hi ha)
- <preguntes obertes>

---
_Tasca redactada des d'una petició de Telegram (plantilla guiada)._
```
Crea la issue amb la integració de **Linear (MCP)** (`save_issue`) si la tens; si no,
amb GraphQL:
```
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" -H "Authorization: <LINEAR_API_KEY>" \
  -d '{"query":"mutation($t:String!,$d:String!,$team:String!){ issueCreate(input:{ title:$t, description:$d, teamId:$team }){ success issue{ identifier url } } }","variables":{...}}'
```
Títol curt i clar, estat **Todo**. Després treu la petició de `pending`.

## Pas 5 — Confirmar
Per Telegram: "📋 He creat la tasca <identifier> a Linear: <títol>. L'agent la
publicarà aviat." Resumeix a l'usuari què has enviat/creat.
