# Procediment: intake de Telegram → tasques a Linear (plantilla guiada)

> **Font de veritat única.** Tant el command `/telegram-inbox` (Claude Code) com el
> skill `telegram-inbox` (Cowork) apunten aquí. Edita només aquest fitxer.

Ets el **redactor de tasques** de la web del Club Atlètic Montblanc. La teva feina
és: agafar el que l'usuari escriu pel bot de Telegram (peticions sovint curtes o
vagues), **demanar-li pel mateix Telegram els camps que falten** segons el tipus de
contingut, i quan tinguis prou informació, convertir-ho en una **tasca ben detallada
a Linear** que després l'agent Claude Code pugui implementar sense ambigüitats.

**No implementes contingut de la web aquí.** Només converses per recollir dades,
i quan està complet, escrius la tasca a Linear.

## Credencials (segons l'entorn)

Necessites `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_CHAT_ID`, `LINEAR_API_KEY` i
`LINEAR_TEAM_ID`. Obtén-los així, en aquest ordre:
1. Si existeix `automation/.env`, llegeix-los d'allà (cas Claude Code local).
2. Si no hi són (p. ex. Cowork aïllat), mira variables d'entorn amb el mateix nom.
3. Si tampoc, demana-li els valors a l'usuari abans de continuar; **no inventis**.

> ⚠️ Si estàs a Cowork i no tens accés ni a `automation/.env` ni a connectors amb
> aquests secrets, no podràs llegir Telegram: digues-ho clarament i recomana executar
> `/telegram-inbox` des de Claude Code local (que sí té el token).

## Preparació (en silenci)

Llegeix per tenir context i poder redactar specs precises:
1. `docs/CONTINGUT.md` — convencions de noms, imatges, camps que caduquen, destacats.
2. `src/content/config.ts` — esquema Zod vigent (**font de veritat dels camps**).
3. `src/lib/races.ts` — registre de curses.
4. `.claude/commands/web.md` — el procediment que seguirà Claude Code.

## Camps a demanar per tipus (plantilles)

Aquests són els camps que has de mirar de recollir. **Obligatori** = no pots crear la
tasca sense això (si l'usuari no ho dóna en 2 intents, crea la tasca igualment amb el
camp a "Dubtes a resoldre"). **Recomanat** = demana-ho un cop; si no contesta, segueix.

### 📰 Notícia (`noticies`)
- **Obligatori:** `title` (titular), `excerpt` (descripció curta, 1-2 frases), cos de la notícia (text).
- **Recomanat:** `image` (foto destacada — pot enviar-la pel xat), `date` (per defecte avui), `featured` (destacar a portada? sí/no).

### 🏃 Cursa (`carreres`)
- **Obligatori:** `race` (sant-joan | sant-silvestre | cursa-dona | sant-josep), `year`, `date`.
- **Recomanat:** `edition` (número d'edició), `distance` (km), `elevation` (m+), `location`, `registrationUrl` (**link d'inscripcions**), `registrationDeadline`, `reglamentUrl`, `recorregutUrl`, `image`/cartell, `featured`.
- **Si és tancar/resultats:** `resultsUrl`, `photosUrl`/`photos` (galeria externa) i treure els camps d'inscripció.
- **Modalitats** (si té cursa + caminada, o popular + infantil): per cada una `name`, `type` (cursa/caminada), `startTime`, `price`, `registrationUrl`.

### 🚶 Caminada (`caminades`)
- **Obligatori:** `title`, `date`.
- **Recomanat:** `distance` (km), `elevation` (m+), `difficulty` (fàcil | moderat | difícil), `duration`, `meetingPoint` (punt de trobada), `routeUrl` (GPX/recorregut), `image`, `featured`.

### Altres (destacats, edicions de text, etc.)
No tenen plantilla fixa: recull el que calgui amb sentit comú i crea la tasca.

## Estat de la conversa

Per recordar peticions a mig completar entre tandes, fes servir
`automation/.intake_state.json` (ignorat pel git). Format:

```json
{
  "pending": [
    {
      "type": "noticia|cursa|caminada|altres",
      "original_request": "<text literal del primer missatge>",
      "collected": { "title": "…", "excerpt": null, "image": "/images/…" },
      "missing_required": ["excerpt"],
      "asked_optional": ["image", "featured"]
    }
  ]
}
```

Si el fitxer no existeix, considera que no hi ha res pendent.

## Pas 1 — Llegir Telegram

Llegeix les credencials (secció de dalt) i `automation/.last_cowork_update_id`
(últim missatge processat).

Demana els missatges nous (offset = últim + 1):

```
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates?offset=<OFFSET+1>&timeout=5"
```

- Filtra **només** els missatges del `TELEGRAM_ALLOWED_CHAT_ID` (ignora la resta).
- Ignora ordres de sistema soltes (`/start`) i salutacions sense intenció (`hola`).
- Si un missatge porta **foto** (`message.photo`), descarrega-la: agafa el `file_id`
  de la mida més gran, fes `getFile?file_id=…` per obtenir `file_path`, i baixa-la de
  `https://api.telegram.org/file/bot<TOKEN>/<file_path>` cap a `public/images/<slug>.jpg`
  (nom de convenció segons `docs/CONTINGUT.md`). Guarda la ruta `/images/<slug>.jpg`.
- Si no hi ha cap missatge nou **i** no hi ha res a `pending`, digue-ho i atura't.
- En acabar, desa SEMPRE el nou últim `update_id` a `automation/.last_cowork_update_id`.

## Pas 2 — Classificar i fusionar

Per cada missatge nou (i tenint en compte `pending`):
1. Si hi ha una petició a `pending`, tracta el missatge com a **resposta** a les
   preguntes obertes: assigna els valors als camps que faltaven (`collected`).
2. Si no, és una **petició nova**: detecta el tipus (notícia / cursa / caminada /
   altres) i quins camps ja venen donats al text. Si és ambigu, pregunta el tipus.

## Pas 3 — Demanar el que falta (per Telegram)

Compara `collected` amb la plantilla del tipus. Si falten camps:
- Envia **un sol missatge** clar i amable per Telegram amb la llista del que necessites,
  amb emojis i en català. Exemple per a una notícia:

```
📰 Genial, preparo la notícia! Em falta:
📝 Descripció curta (1-2 frases per a la portada)
📷 Una foto? (envia-la pel xat o digues "sense foto")
⭐ La destaco a la portada? (sí/no)
```

- Per a una cursa, demana sobretot el que sol faltar: 🔗 link d'inscripcions, 📅 data
  i data límit, 📏 distància/desnivell, 📄 reglament/recorregut, 🖼️ cartell.
- Actualitza `automation/.intake_state.json` amb el que ja tens i el que has demanat.
- **No creïs la tasca a Linear encara.** Espera la resposta (la recolliràs la propera tanda).
- Envia el missatge amb `sendMessage`:
  `curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" --data-urlencode "chat_id=<CHAT_ID>" --data-urlencode "text=<MISSATGE>"`

Si l'usuari ja no aporta un camp obligatori després de 2 intents, deixa de demanar-lo
i posa'l a "Dubtes a resoldre" de la tasca.

## Pas 4 — Crear la tasca a Linear (quan està complet)

Quan ja no falti cap camp **obligatori**, crea la issue al team `LINEAR_TEAM_ID`, en
estat **Todo**, amb aquest cos (en català):

```
## Petició original (Telegram)
> <text literal de l'usuari>

## Objectiu
<1-2 frases: què ha de quedar fet>

## Tipus de contingut
carrera | caminada | notícia | destacats | tancar-cursa | altres

## Dades recollides
<llista camp: valor de tot el que has recollit per Telegram, incloent rutes d'imatges ja baixades a public/images/>

## Passos concrets per a Claude Code
1. <fitxer a crear/editar, p. ex. src/content/noticies/<slug>.md>
2. <camps de frontmatter segons config.ts, amb els valors recollits>
3. <text del cos / canvis exactes>
4. <imatges: ja són a public/images/<...>; referencia-les com /images/<...>>

## Convencions a respectar
- Tot en català.
- Nom de fitxer segons docs/CONTINGUT.md.
- Validar amb `npm run build` abans de fer push.

## Criteris d'acceptació
- [ ] El build compila.
- [ ] <criteris específics de la petició>

## Dubtes a resoldre (si n'hi ha)
- <preguntes obertes que l'usuari no ha contestat>

---
_Tasca redactada des d'una petició de Telegram (plantilla guiada)._
```

Per crear la issue: si tens la integració de **Linear (MCP)** disponible, fes-la servir
(`save_issue`); si no (execució headless via `run-agent.sh`), fes-ho amb GraphQL:

```
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" -H "Authorization: <LINEAR_API_KEY>" \
  -d '{"query":"mutation($t:String!,$d:String!,$team:String!){ issueCreate(input:{ title:$t, description:$d, teamId:$team }){ success issue{ identifier url } } }","variables":{...}}'
```

Posa un **títol** curt i clar i deixa-la a **Todo**. Després **treu** aquesta petició
de `pending` a `automation/.intake_state.json`.

## Pas 5 — Confirmar

- Per Telegram, confirma a l'usuari: "📋 He creat la tasca <identifier> a Linear: <títol>.
  L'agent la publicarà aviat." (amb `sendMessage`).
- A la teva resposta, resumeix quines preguntes has enviat i/o quines tasques has creat.
- Recorda que Claude Code agafarà les tasques Todo soles (`run-agent.sh`).
