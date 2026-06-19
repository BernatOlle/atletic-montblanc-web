#!/usr/bin/env bash
# =============================================================================
# Agent developer local — COST 0, NOMÉS CLAUDE
# =============================================================================
# A cada tanda, Claude Code:
#   0. Processa Telegram (command /telegram-inbox, plantilla guiada): demana per
#      Telegram els camps que falten i, quan estan complets, crea la tasca a Linear.
#   1. Busca tasques a Linear en estat "Todo" del team configurat.
#   2. Per cada tasca, la mou a "In Progress", la desenvolupa, fa build + push + PR.
#   3. Si tot va bé, mou la tasca a "Done" i avisa per Telegram.
#
# El "cervell" és aquest Mac amb la teva SUBSCRIPCIÓ de Claude (Claude Code headless).
# No usa l'API de pagament ni servidors al núvol.
#
# Requisits (una vegada):
#   - Claude Code instal·lat, amb sessió iniciada i amb la integració de Linear activa.
#   - `jq` i `curl`.
#   - automation/.env amb TELEGRAM_*, LINEAR_API_KEY, LINEAR_TEAM_ID.
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="$SCRIPT_DIR/agent.log"

if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a; source "$SCRIPT_DIR/.env"; set +a
else
  echo "ERROR: falta automation/.env (copia automation/.env.example)" >&2
  exit 1
fi

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

tg_reply() { # tg_reply <text>
  curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_ALLOWED_CHAT_ID}" \
    --data-urlencode "text=$1" >/dev/null || true
}

linear() { # linear <graphql-query-json>  → resposta JSON
  curl -s -X POST https://api.linear.app/graphql \
    -H "Content-Type: application/json" \
    -H "Authorization: ${LINEAR_API_KEY}" \
    -d "$1"
}

# --- 0. Processar Telegram (plantilla guiada) --------------------------------
# Demana per Telegram els camps que falten i crea les tasques completes a Linear.
log "Processant intake de Telegram (/telegram-inbox)…"
cd "$REPO_DIR"
if ! claude -p "/telegram-inbox" --permission-mode acceptEdits >> "$LOG_FILE" 2>&1; then
  log "Intake de Telegram ha fallat; continuo amb les tasques de Linear."
fi

# --- 1. Buscar tasques a "Todo" del team -------------------------------------
log "Buscant tasques Todo a Linear…"

QUERY=$(jq -n --arg team "$LINEAR_TEAM_ID" '{
  query: "query($team: ID!) { issues(filter: { team: { id: { eq: $team } }, state: { type: { eq: \"unstarted\" } } }, first: 10) { nodes { id identifier title description url } } }",
  variables: { team: $team }
}')

RESP="$(linear "$QUERY")"
COUNT="$(echo "$RESP" | jq '.data.issues.nodes | length')"

if [ "${COUNT:-0}" -eq 0 ]; then
  log "Cap tasca pendent."
  exit 0
fi
log "$COUNT tasca(es) pendent(s)."

# --- 2. Processar cada tasca -------------------------------------------------
echo "$RESP" | jq -c '.data.issues.nodes[]' | while read -r issue; do
  ISSUE_ID="$(echo "$issue" | jq -r '.id')"
  IDENT="$(echo "$issue" | jq -r '.identifier')"
  TITLE="$(echo "$issue" | jq -r '.title')"
  DESC="$(echo "$issue" | jq -r '.description // ""')"
  URL="$(echo "$issue" | jq -r '.url')"

  log "Desenvolupant $IDENT: $TITLE"
  tg_reply "🔧 Treballant en $IDENT — $TITLE"

  cd "$REPO_DIR"

  PROMPT="Ets l'agent developer de la web del Club Atlètic Montblanc (Astro).
Treballa SEMPRE en català. Segueix el procediment del command /web,
docs/CONTINGUT.md i src/content/config.ts (esquema Zod = font de veritat).

Implementa aquesta tasca (redactada a Linear per Cowork):

TÍTOL: $TITLE

DESCRIPCIÓ I PASSOS:
$DESC

Instruccions:
1. Fes els canvis al contingut tal com indica la tasca, respectant les convencions.
2. Executa 'npm run build'. Si falla, arregla-ho; NO facis push si no compila.
3. Quan compili: crea una branca, commit, push i obre un Pull Request amb
   l'etiqueta 'auto' (auto-merge.yml el publicarà si el build de CI passa).
   Al cos del PR, posa 'Tasca: $URL'.
4. Acaba amb un resum breu (1-3 frases) del que has fet."

  if claude -p "$PROMPT" --permission-mode acceptEdits > "$SCRIPT_DIR/last_run.txt" 2>&1; then
    SUMMARY="$(tail -c 1200 "$SCRIPT_DIR/last_run.txt")"
    # Mou la tasca a "Done" (cerca un estat de tipus "completed" al team).
    DONE_STATE="$(linear "$(jq -n --arg team "$LINEAR_TEAM_ID" '{query:"query($team: String!){ workflowStates(filter:{ team:{ id:{ eq:$team } }, type:{ eq:\"completed\" } }, first:1){ nodes{ id } } }", variables:{ team:$team }}')" | jq -r '.data.workflowStates.nodes[0].id // empty')"
    if [ -n "$DONE_STATE" ]; then
      linear "$(jq -n --arg id "$ISSUE_ID" --arg st "$DONE_STATE" '{query:"mutation($id: String!, $st: String!){ issueUpdate(id:$id, input:{ stateId:$st }){ success } }", variables:{ id:$id, st:$st }}')" >/dev/null || true
    fi
    tg_reply "✅ $IDENT fet. PR obert (es publicarà si el build passa).
$SUMMARY"
    log "$IDENT completada."
  else
    tg_reply "⚠️ Problema amb $IDENT. Revisa automation/agent.log al Mac. La tasca queda a Todo."
    log "ERROR a $IDENT. Vegeu last_run.txt."
  fi
done

log "Tanda completada."
