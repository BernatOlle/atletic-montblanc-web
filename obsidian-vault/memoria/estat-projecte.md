# Estat del projecte (memòria viva)

**Última actualització:** 2026-06-20

## On som
- Web Astro funcional i **en producció**: https://atletic-montblanc-web.vercel.app
  (build verd, 65 pàgines).
- **Sistema d'automatització operatiu i validat de punta a punta.** Flux:
  Telegram → `/telegram-inbox` → tasca a Linear → `run-agent.sh` (Claude Code) →
  PR amb etiqueta `auto` → auto-merge si el build passa → Vercel publica → avís per Telegram.

## Fet (Fases 1–4, totes validades)
- ✅ **Fase 1 (PER-14)** — Publicació automàtica: Vercel connectat, etiqueta `auto`,
  workflow `auto-merge.yml` (corregit: merge + esborrat de branca via API). Permisos
  d'Actions a read/write.
- ✅ **Fase 2 (PER-15)** — Bot `@atletic_montblanc_web_bot` + tokens a `automation/.env`
  (chat permès: només l'usuari).
- ✅ **Fase 3 (PER-16)** — `/telegram-inbox` amb **plantilla guiada** (demana pel xat
  els camps que falten per tipus i baixa fotos). Skill llegible per Cowork.
- ✅ **Fase 4 (PER-17)** — `run-agent.sh` validat E2E (corregit: `--dangerously-skip-permissions`
  per autonomia bash + query de Done amb tipus `ID!`). launchd instal·lat (cada 24 h + en encendre).
- ✅ **Prova E2E (PER-20)** — notícia "estrena web nova" creada per l'agent, PR
  auto-mergejat, publicada a producció.

## Pendent
- **Fase 5 (PER-18)** — només queda la prova E2E amb un **missatge real de Telegram**
  (la de PER-20 sortia d'una tasca de Linear). El vault i `docs/ARQUITECTURA.md` ja existeixen.
- Opcional: endurir `run-agent.sh` perquè el "✅" de Telegram només s'enviï si el Done
  s'ha confirmat (durant la tanda E2E el Done no va quedar aplicat per un `DONE_STATE`
  transitori buit; mecanisme verificat correcte).

## Aprenentatges
- `@astrojs/sitemap` recent peta amb Astro 4.16 (`_routes` undefined). Mantenir la versió fixada.
- L'agent desatès (`claude -p`) necessita `--dangerously-skip-permissions`; `acceptEdits`
  bloqueja bash (npm/git/gh) en headless.
- Les queries de Linear amb filtre per equip volen `$team: ID!` (no `String!`).
- Per posar una issue a l'estat **Duplicate** cal crear abans una relació de duplicat.

## Relacionat
- [[decisio-model-cost-zero]] · [[registre-canvis]] · [[convencions-contingut]] · [[redactar-tasques-web]]
