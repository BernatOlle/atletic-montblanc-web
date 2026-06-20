# Registre de canvis de l'agent

Diari del que l'agent dev va fent al repo. El més recent a dalt.

## 2026-06-20 — Activació i validació de tot el sistema (Fases 1–4)

Posada en marxa i prova real de l'ecosistema d'automatització.

- **Fase 1 (PER-14):** validat l'auto-merge amb PRs de prova. Corregit `auto-merge.yml`:
  el merge i l'esborrat de branca ara es fan **via API** (el `--delete-branch` local
  fallava al runner). Permisos d'Actions a read/write.
- **Fase 2 (PER-15):** bot `@atletic_montblanc_web_bot` creat, tokens + `LINEAR_API_KEY`
  (rotada un cop) a `automation/.env`. Chat ID capturat via `getUpdates`.
- **Fase 3 (PER-16):** `/telegram-inbox` reescrit amb **plantilla guiada** (camps per
  tipus, demanar pel xat el que falta, baixar fotos). Font única a `docs/TELEGRAM-INTAKE.md`;
  shims a `.claude/commands/` i `.claude/skills/`; versions per a Cowork a `cowork-skills/`.
- **Fase 4 (PER-17):** `run-agent.sh` validat E2E. Fixos: `--dangerously-skip-permissions`
  (l'agent desatès no podia fer bash amb `acceptEdits`) i query de Done a `ID!`.
  launchd instal·lat (cada 24 h + en encendre el Mac).
- **Prova E2E (PER-20):** notícia "estrena web nova" creada per l'agent → PR `auto`
  → auto-merge verd → **publicada a producció** (HTTP 200).
- Configurades regles d'`allow` a `.claude/settings.local.json` per a autonomia (git/gh/npm/curl).

### Pendent
- Fase 5 (PER-18): prova E2E amb un **missatge real de Telegram** (un sol gest de l'usuari).

---

## 2026-06-18 (tarda) — Backlog complet executat (PER-8 → PER-13)

Les 6 issues fetes i en **Done** a Linear. Build final verd: 65 pàgines. Canvis al
repo (7 fitxers modificats + 3 nous).

- **PER-8** Favicon/logo local → `/images/logo.jpg` a `Layout`, `Header`, `Footer`
  (eliminada tota dependència d'atleticmontblanc.cat).
- **PER-9** Nova `src/pages/404.astro` en català amb la marca del club.
- **PER-10** a11y: imatges ja tenien `alt` i h1 correctes; afegit `aria-current="page"`
  + `aria-label` a la navegació.
- **PER-11** Sitemap + `robots.txt`. Dependència: `@astrojs/sitemap` (fixat a 3.2.1;
  la 3.6 fallava amb Astro 4.16). **Requereix `npm install`.**
- **PER-12** Nova `src/pages/calendari.astro` (esdeveniments agrupats per mes) +
  enllaç "Calendari" al menú.
- **PER-13** `loading="lazy"` + `decoding="async"` a les targetes. Pendent:
  recomprimir `sant-joan-cartell-2026.jpg` (1,1 MB).

### Per publicar (al Mac)
```bash
cd ~/Bernat/Proyectos/atletic_montblanc_web
npm install                 # baixa @astrojs/sitemap
npm run build               # validar
git add -A
git commit -m "Millores web: favicon local, 404, calendari, sitemap, a11y i lazy-loading"
git push
```

---

## 2026-06-18 — Muntatge de l'ecosistema

- Auditat el projecte (Astro 4 + Tailwind, contingut en català, deploy a Vercel).
- Verificada la línia base: `npm run build` compila (63 pàgines).
- Creat el backlog de millores i issues a Linear.
- Muntat aquest vault de coneixement (skills/convencions/decisions/memoria).

## Relacionat
- [[estat-projecte]]
