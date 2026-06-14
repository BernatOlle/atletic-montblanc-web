# Convencions de contingut — web del Club Atlètic Montblanc

Aquesta guia és la referència que segueix el command `/web` per crear i editar
contingut. Si canvies l'estructura del projecte, actualitza aquest fitxer.

> ⚠️ **L'esquema real viu a `src/content/config.ts`.** Abans de crear o editar res,
> llegeix sempre aquell fitxer per saber els camps vigents de cada col·lecció.
> No assumeixis els camps de memòria: l'esquema pot haver canviat.

---

## Regla d'or

**Tot el contingut visible ha d'estar en català.** (Vegeu `CLAUDE.md`.)

---

## Col·leccions i ubicació

| Tipus | Carpeta | Esquema (a `config.ts`) |
|-------|---------|--------------------------|
| Carreres | `src/content/carreres/` | `carreres` |
| Caminades | `src/content/caminades/` | `caminades` |
| Notícies | `src/content/noticies/` | `noticies` |

Curses fixes registrades a `src/lib/races.ts` (`RACES`). Claus vàlides del camp
`race`: `sant-joan`, `sant-silvestre`, `cursa-dona`, `sant-josep`.

---

## Convenció de noms de fitxer

| Tipus | Patró | Exemple |
|-------|-------|---------|
| Carrera | `{race}-{year}.md` | `sant-joan-2027.md` |
| Caminada | `{YYYY-MM}-{slug}.md` | `2026-07-nocturna-prades.md` |
| Notícia | `{slug}.md` | `obertura-temporada-2027.md` |

- `slug`: minúscules, sense accents, paraules separades per guió.
- **Mai sobreescriguis** un fitxer existent sense avisar primer.

---

## Imatges

- Totes les imatges van a **`/public/images/`** i es referencien com `/images/...`.
- L'agent **demana el fitxer** (ruta local o adjunt) i el **copia** a
  `/public/images/` amb el nom de convenció; després posa la ruta al frontmatter.
- Noms de convenció:
  - Imatge destacada d'una cursa: `{race}.jpg` (p. ex. `sant-joan.jpg`)
  - Cartell d'una edició: `{race}-{any}-cartell.jpg`
  - Samarreta: `{race}-samarreta.jpg`
  - Caminada / notícia: `{slug}.jpg`
- **Verifica que el fitxer existeix** a `/public/images/` abans de donar la feina
  per bona; si una ruta `image:` referenciada no existeix, avisa (evita 404 silenciós).
- Els GPX van a **`/public/gpx/`** i es referencien com `/gpx/...`.
- `photosUrl` / `photos` són enllaços **externs** a galeries (Google Fotos, etc.),
  no fitxers locals.

---

## Camps que caduquen (replicar / tancar cursa)

Quan es **replica** una edició anterior per crear-ne una de nova, cal **buidar**:
`registrationUrl`, `registrationDeadline`, `resultsUrl`, `photosUrl`, `photos`.
I ajustar `year`, `edition` i `date`.

Quan es **tanca** una cursa (passa de propera a passada): afegir `resultsUrl` i
`photosUrl`/`photos`, i treure els camps d'inscripció (`registrationUrl`,
`registrationDeadline`).

---

## Destacats de la portada (`featured`)

- La portada (`src/pages/index.astro`) tria l'**esdeveniment hero** així: el primer
  esdeveniment futur (carreres + caminades) amb `featured: true`; si no n'hi ha cap,
  el més proper per data.
- `featured: true` està disponible a **carreres, caminades i notícies**.
- Per destacar un contingut, posa `featured: true` al seu frontmatter. Per evitar
  ambigüitat, mantén **un sol** esdeveniment futur amb `featured: true` alhora.

---

## Modalitats (carreres)

Quan una cursa té cursa + caminada (o popular + infantil), omple `modalities` amb
una entrada per modalitat. `type: cursa` es mostra en vermell (cronometrada);
`type: caminada` en fosc (no competitiva). Camps: `name`, `edition`, `type`,
`startTime`, `dorsalPickup`, `price`, `maxParticipants`, `registrationUrl`.

---

## Validació

Després de qualsevol canvi, executa **`npm run build`**. Astro valida l'esquema Zod;
si compila, el contingut és vàlid. No donis la feina per acabada si el build falla.
