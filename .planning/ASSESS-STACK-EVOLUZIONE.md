# ASSESS — Stack Evoluzione Worky Chatbot
<!-- Creato: 2026-03-30 -->
<!-- Workflow: /valutastack -->

## FASE 0 — Stato attuale e obiettivi

### Stack attuale
| Componente | Tecnologia | Note |
|------------|------------|------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4 | |
| LLM | Claude 3.5 Haiku via OpenRouter | ~$3 per 3 giornate |
| AI SDK | Vercel AI SDK (@ai-sdk/openai + ai) | |
| Persistenza | localStorage browser | Fragile, non condivisibile |
| Auth | Nessuna | |
| DB | Nessuno | |
| Deploy | Vercel (auto-deploy su push) | |
| Repo | github.com/Margus33/worky-chatbot | |

### Cosa esiste gia' nello stack Marco (riutilizzabile)
- **Neon** — PostgreSQL serverless, free tier PER PROGETTO (0.5GB + 100 CU-h/mo ciascuno)
- **Clerk** — Auth, free tier 50K MAU (aggiornato feb 2026, era 10K)
- **Vercel** — Hosting, gia' in uso per Worky
- **Drizzle ORM** — usato in BIOS e Automatica

### Cosa serve
1. **Auth studenti** — login semplice per identificare chi e' chi
2. **Database** — profili studente, output salvati, versioni, conversazioni
3. **Dashboard docente** — Marco vede tutto: stato, output, progressi
4. **Salvataggio automatico output** — elimina Google Form
5. **Versionamento output** — tracciare evoluzione nel tempo

### Vincoli
- **Budget: ZERO** — solo free tier
- **Utenti: ~20-50** iniziali, potenziale centinaia
- **Infra: Vercel** — gia' configurato
- **Team: 1 dev** (Margus) + Marco
- **Timeline: post-lezione** (non urgente per domani)
- **GDPR: SI** — dati personali studenti EU (nome, studi, profilo identitario)
- **Privacy minori: FUTURO** — non ora ma da considerare nell'architettura

---

## FASE 1 — Inventario alternative

(Vedi file originale — inventario completo DB/Auth/ORM)

---

## FASE 2 — Deep Research (compilata)

### DB: Neon (nuovo progetto dedicato a Worky)
- **Fonte:** https://neon.com/pricing, https://neon.com/docs/introduction/plans
- **Free tier:** 0.5 GB storage, 100 CU-h/mo, 10 branch, **PER PROGETTO** (non condiviso con altri)
- **GDPR:** SOC 2 Type 1/2, ISO 27001, ISO 27701, DPA pubblica. Region EU: Frankfurt (aws-eu-central-1)
- **Pro Worky:** Stack identico a BIOS/Automatica (Drizzle, pattern noti). Integrazione Vercel nativa. pgvector per futuro RAG.
- **Contro Worky:** 0.5 GB e' poco per conversazioni lunghe se scala a centinaia. Scale-to-zero 5min = cold start.
- **Trend:** Free tier MIGLIORATO nel 2025 (compute raddoppiato da 50 a 100 CU-h/mo)

### DB: Supabase
- **Fonte:** https://supabase.com/pricing
- **Free tier:** 500 MB, 50K MAU auth incluso, 2 progetti attivi, RLS incluso, API illimitate
- **GDPR:** SOC 2, DPA disponibile, regioni EU (eu-west-1, eu-central-1)
- **Pro Worky:** Auth + DB + RLS in un unico servizio. Magic link gratis.
- **Contro Worky:** **PAUSA AUTOMATICA dopo 7 giorni inattivita'** — app scolastica con pause estive = rischio. Stack diverso da quello Marco (Drizzle+Neon). Gia' 1 progetto free usato per RepAlert.
- **Verdict:** Buono ma introduce complessita' di stack e rischio pausa

### DB: Turso (libSQL)
- **Fonte:** https://turso.tech/pricing
- **Free tier:** 5 GB storage (!), 100 DB, 500M reads/mo — molto generoso
- **GDPR:** SOC 2 Type II, location EU (Frankfurt, Dublin, Brussels). DPA da verificare.
- **Pro Worky:** Storage 10x Neon gratis. SQLite leggero.
- **Contro Worky:** Stack completamente nuovo per Marco. Niente pgvector. Ecosistema piu' piccolo.
- **Verdict:** Interessante ma introduce diversita' di stack senza necessita'

### DB: Cloudflare D1
- **SCARTATO** — usa Workers bindings, non pratico da Vercel. Cittadino di seconda classe fuori Cloudflare.

### DB: Vercel Postgres
- **SCARTATO** — deprecato dic 2024, migrato a Neon. Non esiste piu'.

### DB: Firebase/MongoDB
- **Non approfonditi** — PostgreSQL e' la scelta corretta per dati strutturati + JSONB, confermato da ricerca best practices.

### Auth: Clerk
- **Fonte:** https://clerk.com/pricing, https://clerk.com/legal/gdpr
- **Free tier:** **50K MAU** (alzato feb 2026). App illimitate. Organizations + RBAC built-in.
- **GDPR:** Server Germania, backup Irlanda. DPF certificato. DPA disponibile.
- **Setup:** 30 min con Next.js. Componenti pre-built. Magic link disponibile.
- **Verdict:** Marco gia' lo usa, zero learning curve, GDPR OK, capacity enorme

### Auth: Supabase Auth
- **Free tier:** 50K MAU, magic link nativo. Ma no UI pre-built, setup 1-2h.
- **Verdict:** Buono solo se usi Supabase come DB. Non il caso qui.

### Auth: Auth.js v5
- **Free tier:** Illimitato (self-hosted). Setup 2-4h. Nessun componente UI.
- **Verdict:** Massimo controllo GDPR ma effort 4-8x Clerk per stesso risultato.

### Auth: Lucia Auth
- **SCARTATA** — deprecata e non mantenuta dal 2025.

### Auth: Codice condiviso
- **SCARTATO** — zero tracciabilita' individuale, non compatibile con profili/GDPR.

### ORM: Drizzle
- **Verdict:** Scelta obbligata — Marco lo usa gia' su 2 progetti, type-safe, supporto Neon nativo.

---

## FASE 3 — Matrice comparativa

### Database

| Criterio | Neon (nuovo progetto) | Supabase | Turso |
|----------|----------------------|----------|-------|
| Storage free | 0.5 GB | 500 MB | **5 GB** |
| Compute free | 100 CU-h/mo | N/A (API) | 500M reads |
| GDPR EU | **SI** (Frankfurt) | SI (eu-west-1) | SI (Frankfurt) |
| DPA pubblica | **SI** | SI | Da verificare |
| Vercel integrazione | **Nativa** | Buona | Buona (HTTP) |
| Drizzle support | **SI (gia' usato)** | SI | SI |
| pgvector (futuro RAG) | **SI** | SI | NO |
| Rischio pausa | NO | **SI (7 giorni)** | NO |
| Stack coerente Marco | **SI** | Parziale | NO |
| Cold start | 5min scale-to-zero | N/A | N/A |

**Vincitore DB: Neon** — nuovo progetto dedicato, free tier indipendente, stack identico

### Auth

| Criterio | Clerk | Auth.js | Supabase Auth |
|----------|-------|---------|---------------|
| MAU free | **50K** | Illimitati | 50K |
| Setup effort | **30 min** | 2-4 ore | 1-2 ore |
| UI components | **SI** | NO | NO |
| RBAC built-in | **SI** | NO | Manuale (RLS) |
| GDPR EU servers | **SI** (Germania) | Tuo DB | SI (se EU) |
| Stack coerente | **SI (gia' usato)** | Nuovo | Nuovo |
| Vendor lock-in | Medio | Zero | Medio |

**Vincitore Auth: Clerk** — gia' nello stack, 50K MAU, 30 min setup, RBAC per ruolo docente

### Stack proposto per Council

| Componente | Scelta | Motivazione |
|------------|--------|-------------|
| DB | **Neon** (nuovo progetto Frankfurt) | Stack coerente, free tier dedicato, GDPR |
| Auth | **Clerk** | Gia' usato, 50K MAU, RBAC, 30 min |
| ORM | **Drizzle** | Gia' usato su BIOS/Automatica |
| Frontend | **Next.js 15** (esistente) | Nessun cambio |
| Deploy | **Vercel** (esistente) | Nessun cambio |
| LLM | **Claude Haiku via OpenRouter** (esistente) | Nessun cambio |

---

## FASE 4 — Council multi-prospettiva (completata)

### CTO
- Stack corretto, procedi. Zero curva di apprendimento.
- 0.5GB Neon basta per 500 utenti (~125MB stimati)
- OpenRouter unico SPOF → prevedere fallback Anthropic diretto
- Cold start Neon tollerabile (3-5s primo utente del giorno)
- **Obbligatorio**: rate limiting per utente sulle API LLM
- Storage binari (PDF, immagini) → Vercel Blob o R2, non Neon

### Analista dominio EdTech
- Schema OK, aggiungere `session` (lezione/data) per filtri docente
- JSONB per profili: corretto, ma con validazione Zod applicativa
- Versionamento output: nuova riga con `version+1`, `source` (ai/user_edit), `parent_id`
- Dashboard docente priorita': (1) chi non ha iniziato, (2) completamento output, (3) ricchezza profilo
- Predisporre nello schema senza implementare: `visibility`, `consent_flags`, `export_format`
- NO over-engineering: niente Redis, queue, microservizi, multi-tenant

### Legale GDPR
- **CRITICO: OpenRouter USA senza DPA/SCC** → rischio sanzione. Raccomandazione: passare ad Anthropic API diretto (hanno DPA)
- **DPIA obbligatoria** (profilazione studenti = categoria vulnerabile)
- Vercel Functions → forzare `region: fra1` (EU) per evitare transito dati extra-EU
- Consenso: documentare che l'uso e' facoltativo e non incide su valutazione accademica
- Profilazione Art. 22: garantire intervento umano, non usare profili per valutazioni
- Diritto all'oblio: hard delete obbligatorio, non soft delete
- **Minori: prodotto completamente separato**, non estensione di Worky
- Documenti pre-lancio: privacy policy, consenso informato, DPIA, DPA con ogni provider, registro trattamenti Art. 30

### Business
- Modello: B2B2C — vendi alle universita', non agli studenti. 5-10 EUR/studente/semestre
- Feature creep reale: 7 direzioni per 20 utenti. Tagliare tutto tranne core.
- Priorita' brutale: (1) profili persistenti, (2) dashboard docente, (3) career tracking. Il resto DOPO 200+ utenti.
- Distribuzione: il docente e' il canale. 5 docenti-ambassador in 3 uni entro 12 mesi.
- 90 giorni: persistenza + dashboard + 2 corsi fuori Roma Tre

---

## FASE 5 — Decisione finale

### Stack scelto

| Componente | Scelta | Motivazione |
|------------|--------|-------------|
| **DB** | Neon PostgreSQL (nuovo progetto, Frankfurt) | Stack coerente, free tier dedicato (0.5GB, 100 CU-h/mo), GDPR EU |
| **Auth** | Clerk | Gia' usato, 50K MAU free, RBAC docente/studente, 30 min setup |
| **ORM** | Drizzle | Gia' usato su BIOS/Automatica, type-safe, Neon nativo |
| **Frontend** | Next.js 15 (esistente) | Nessun cambio |
| **Deploy** | Vercel (region EU forzata per functions) | Nessun cambio, ma forzare `fra1` |
| **LLM** | **Anthropic API diretto** (cambio da OpenRouter) | GDPR: DPA disponibile, elimina intermediario USA |
| **LLM fallback** | OpenRouter (solo come fallback) | Se Anthropic down |

### Cambio critico: OpenRouter → Anthropic diretto

Il council legale ha identificato OpenRouter come rischio GDPR critico (intermediario USA senza DPA verificato). La raccomandazione e': usare Anthropic API diretto come provider primario (hanno DPA), tenere OpenRouter solo come fallback.

Impatto tecnico: minimo. Il Vercel AI SDK supporta `@ai-sdk/anthropic` nativamente. Costo: identico (Claude 3.5 Haiku stesso prezzo via API diretto).

### Schema DB proposto

```
users (via Clerk, sync con webhook)
  clerk_id, email, name, role (student/teacher), created_at

sessions (lezioni)
  id, teacher_id, title, date, created_at

chats (conversazioni)
  id, user_id, session_id (nullable), title, created_at

messages
  id, chat_id, role, content, created_at

user_profiles (JSONB con Zod validation)
  id, user_id, data (JSONB), version, created_at

generated_outputs (versionati)
  id, user_id, chat_id, type (enum), content, version,
  source (ai_generated/user_edit), parent_id, visibility (draft/private/public),
  created_at

career_events (timeline futura)
  id, user_id, event_type, description, context (JSONB), created_at
```

### Rischi accettati

1. **Neon cold start 3-5s** → accettabile, mitigabile con ping cron se necessario
2. **Clerk vendor lock-in** → accettabile, sostituibile con Auth.js se necessario
3. **0.5GB storage** → sufficiente per 500 utenti (stima 125MB), monitorare
4. **LLM costi** → ~$50-80/mese a 500 utenti, accettabile se B2B revenue

### Rischi da mitigare PRIMA del lancio con persistenza

1. **Privacy policy + consenso informato** → obbligatorio
2. **DPIA** → obbligatoria per profilazione studenti
3. **DPA con Anthropic** → verificare e firmare
4. **Vercel Functions region EU** → configurare in vercel.json
5. **Rate limiting per utente** → implementare dal giorno zero
6. **Hard delete endpoint** → diritto all'oblio

### Piano implementazione (3 fasi)

**Fase A — Backend core (1-2 giorni)**
- Creare progetto Neon Frankfurt
- Setup Clerk (app dedicata Worky)
- Schema Drizzle (tabelle sopra)
- Switch da OpenRouter a @ai-sdk/anthropic
- Forzare Vercel Functions region EU
- Rate limiting base

**Fase B — Profili + output (2-3 giorni)**
- Salvataggio conversazioni in DB (non piu' localStorage)
- Estrazione strutturata profilo da conversazione (JSONB)
- Salvataggio automatico output taggati
- Versionamento output
- Pagina profilo studente

**Fase C — Dashboard docente (1-2 giorni)**
- Lista studenti con stato completamento
- Vista output per studente
- Filtro per sessione/lezione
- Export base (CSV/JSON)

**Totale stimato: 5-7 giorni di sviluppo**

### Log decisioni
- 2026-03-30: Valutazione avviata
- 2026-03-30: 5 alternative DB + 5 auth ricercate con fonti
- 2026-03-30: Council 4 prospettive completato
- 2026-03-30: **Decisione: Neon + Clerk + Drizzle + Anthropic diretto**
- 2026-03-30: Cambio critico: OpenRouter → Anthropic diretto per GDPR
