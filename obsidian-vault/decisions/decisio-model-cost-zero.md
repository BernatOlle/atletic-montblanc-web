# Decisió — Model "cost 0, només Claude" (Mac com a cervell)

**Data:** 2026-06-18
**Estat:** Acceptada

## Context
Es vol gestionar la web escrivint per Telegram, de forma el més autònoma possible,
sense cost addicional i fent servir només Claude.

## Decisió
El cervell del sistema és el **MacBook** amb la **subscripció de Claude**:
- **Cowork** redacta les tasques (Telegram → Linear) quan s'obre.
- **Claude Code** (headless, via `launchd`) implementa les tasques de Linear.
- **GitHub Actions + Vercel** validen i publiquen (gratis).

## Alternatives descartades
- **API d'Anthropic + GitHub Actions al núvol**: seria desatès amb el Mac apagat,
  però **es paga per ús** → trenca el requisit de cost 0.

## Conseqüències
- ✅ Cost addicional 0; només Claude.
- ⚠️ Les tasques es processen quan el Mac està encès (o en despertar). Amb el Mac
  apagat, esperen a la cua (Telegram → Linear).
- 🔄 Si algun dia s'accepta cost per token, només cal afegir un workflow amb
  `anthropics/claude-code-action` i el cervell passa al núvol; la resta no canvia.

## Relacionat
- `docs/ARQUITECTURA.md` (§3, §7)
- [[estat-projecte]]
