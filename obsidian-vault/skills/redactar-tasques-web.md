# Skill — Redactar tasques de web detallades

Quan arribi una petició (Telegram) per canviar la web, converteix-la en una tasca
de Linear que Claude Code pugui executar sense ambigüitats.

## Checklist abans de redactar
1. Identifica el **tipus**: carrera, caminada, notícia, destacats, tancar cursa, altres.
2. Consulta `src/content/config.ts` per als **camps vigents** del tipus.
3. Consulta `convencions/` (o `docs/CONTINGUT.md`) per noms de fitxer i imatges.

## La tasca ha d'incloure sempre
- Petició original (literal).
- Objectiu (1-2 frases).
- Passos concrets: quins fitxers, quins camps de frontmatter amb valors proposats.
- Convencions a respectar (català, nom de fitxer, validar amb `npm run build`).
- Criteris d'acceptació.
- Dubtes a resoldre (si la petició és ambigua — **no inventis**).

## Relacionat
- [[convencions-contingut]]
- [[decisio-model-cost-zero]]
