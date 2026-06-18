# Estat del projecte (memòria viva)

**Última actualització:** 2026-06-18

## On som
- Web Astro funcional (build verd, 65 pàgines). Demo local llesta.
- Automatització creada al repo: `/telegram-inbox` (Cowork), `automation/run-agent.sh`
  (Claude Code), `automation/*.plist` (launchd), `.github/workflows/auto-merge.yml`.
- Fases d'implementació creades a Linear (projecte web-atleticmontblanc): PER-14..PER-19.

## Fet (automàtic)
- ✅ Build verificat. Arreglat `@astrojs/sitemap` (fixat a 3.2.1, incompatibilitat amb Astro 4.16).
- ✅ Vault d'Obsidian creat amb skills/convencions/decisions/memoria.

## Pendent (requereix credencials de l'usuari)
- Fase 1 (PER-14): connectar Vercel + etiqueta `auto`.
- Fase 2 (PER-15): crear bot @BotFather + tokens a `automation/.env`.
- Fase 3 (PER-16): connector Linear a Cowork + provar `/telegram-inbox`.
- Fase 4 (PER-17): provar `run-agent.sh` + instal·lar launchd.
- Fase 5 (PER-19): prova end-to-end.

## Aprenentatges
- `@astrojs/sitemap` recent peta amb Astro 4.16 (`_routes` undefined). Mantenir la
  versió fixada o actualitzar Astro abans de pujar sitemap.

## Relacionat
- [[decisio-model-cost-zero]]
