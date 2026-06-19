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

Llegeix **`docs/TELEGRAM-INTAKE.md`** (a l'arrel del repo de la web) i segueix el
procediment exactament tal com hi està descrit. Aquell fitxer és la **font de veritat
única**: les plantilles de camps per tipus, la lògica de demanar el que falta per
Telegram, l'estat de la conversa i la creació de la tasca a Linear hi són tots.

> Si estàs a Cowork i no tens accés a `automation/.env` ni a connectors amb el
> `TELEGRAM_BOT_TOKEN`/`LINEAR_API_KEY`, segueix la secció **"Credencials"** de
> `docs/TELEGRAM-INTAKE.md`: demana els valors a l'usuari o recomana executar-ho des
> de Claude Code local.
