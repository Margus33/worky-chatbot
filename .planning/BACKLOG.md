# Backlog — Worky Chatbot

## Evoluzione stack (2026-03-30) — da /valutastack

### Fase A — Backend core
- [ ] [2026-03-30] [P1] **Creare progetto Neon Frankfurt** — DB dedicato Worky, free tier indipendente
- [ ] [2026-03-30] [P1] **Setup Clerk** — app dedicata Worky, ruoli student/teacher
- [ ] [2026-03-30] [P1] **Schema Drizzle** — users, sessions, chats, messages, user_profiles (JSONB), generated_outputs, career_events
- [ ] [2026-03-30] [P1] **Switch OpenRouter → Anthropic API diretto** — GDPR: eliminare intermediario USA. `@ai-sdk/anthropic`
- [ ] [2026-03-30] [P1] **Forzare Vercel Functions region EU** — `fra1` in vercel.json
- [ ] [2026-03-30] [P1] **Rate limiting per utente** — sulle API LLM, evitare costi fuori controllo

### Fase B — Profili + output persistenti
- [ ] [2026-03-30] [P1] **Salvataggio conversazioni in DB** — migrare da localStorage a Neon
- [ ] [2026-03-30] [P1] **Estrazione strutturata profilo** — JSONB con Zod validation
- [ ] [2026-03-30] [P1] **Salvataggio automatico output taggati** — elimina Google Form
- [ ] [2026-03-30] [P2] **Versionamento output** — version+1, source (ai/user_edit), parent_id
- [ ] [2026-03-30] [P2] **Pagina profilo studente** — output consultabili, copiabili

### Fase C — Dashboard docente
- [ ] [2026-03-30] [P2] **Lista studenti con stato completamento** — chi ha iniziato, chi no
- [ ] [2026-03-30] [P2] **Vista output per studente** — tutti gli output generati
- [ ] [2026-03-30] [P3] **Filtro per sessione/lezione** — tabella sessions
- [ ] [2026-03-30] [P3] **Export base** — CSV/JSON degli output

## Compliance GDPR (pre-lancio persistenza)
- [ ] [2026-03-30] [P1] **Privacy policy** — specifica per Worky, titolare, base giuridica, trasferimenti
- [ ] [2026-03-30] [P1] **Consenso informato** — checkbox esplicita, documentare facoltatività uso
- [ ] [2026-03-30] [P1] **DPIA** — obbligatoria (profilazione studenti = categoria vulnerabile)
- [ ] [2026-03-30] [P2] **DPA con Anthropic** — verificare e firmare
- [ ] [2026-03-30] [P2] **Hard delete endpoint** — diritto all'oblio, cancellazione completa
- [ ] [2026-03-30] [P2] **Registro trattamenti Art. 30** — documentare tutti i flussi dati

## Prossimi sviluppi (spec originale)
- [ ] [pre-esistente] [P3] **Branding workengo.it** — logo, favicon sul chatbot
- [ ] [pre-esistente] [P4] **Export PDF delle scoperte**
- [ ] [pre-esistente] [P4] **Chatbot #2 Recensioni Online Lab** — port su Vercel

## Da news
- [ ] [P4] [NEWS 2026-04-03] — Valutare EmDash (Cloudflare CMS serverless) come base per siti personali studenti nella visione futura (fonte: Cloudflare Blog)
- [ ] [P4] [NEWS 2026-04-03] — Studiare pattern Gradient Labs (AI account manager autonomo) per architettura multi-fase Worky (fonte: OpenAI Blog)

## Ref
- Assessment completo: `.planning/ASSESS-STACK-EVOLUZIONE.md`
- Know-how: `KNOWHOW.md`
