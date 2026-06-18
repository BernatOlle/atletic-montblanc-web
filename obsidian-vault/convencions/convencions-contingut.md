# Convencions de contingut (resum viu)

> Font de veritat detallada: `docs/CONTINGUT.md` al repo. Esquema real:
> `src/content/config.ts`. Aquesta nota és el resum d'accés ràpid per a Cowork.

## Idioma
Tot el contingut visible **en català**.

## Col·leccions
- `carreres` → `src/content/carreres/` — fitxer `{race}-{year}.md`
- `caminades` → `src/content/caminades/` — fitxer `{YYYY-MM}-{slug}.md`
- `noticies` → `src/content/noticies/` — fitxer `{slug}.md`

Curses fixes (`race`): `sant-joan`, `sant-silvestre`, `cursa-dona`, `sant-josep`.

## Imatges
A `/public/images/`, referenciades com `/images/...`. GPX a `/public/gpx/`.
Noms: `{race}.jpg`, `{race}-{any}-cartell.jpg`, `{race}-samarreta.jpg`, `{slug}.jpg`.

## Camps que caduquen
En replicar una edició: buida `registrationUrl`, `registrationDeadline`,
`resultsUrl`, `photosUrl`, `photos`. Ajusta `year`, `edition`, `date`.

## Destacats (`featured`)
Mantén **un sol** esdeveniment futur amb `featured: true` alhora.

## Validació
Sempre `npm run build` (valida l'esquema Zod) abans de donar res per bo.

## Relacionat
- [[redactar-tasques-web]]
