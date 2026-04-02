# Know-How — Worky Chatbot

## [2026-03-30] LLM Gateway vs API Diretto per GDPR
**Cosa:** Usare Anthropic API diretto invece di OpenRouter per evitare rischio GDPR
**Perche':** OpenRouter e' intermediario USA senza DPA verificato. I dati studenti (nome, valori, blocchi psicologici) transitano per server USA. Anthropic ha DPA disponibile.
**Come:** Switch da `@ai-sdk/openai` (OpenRouter) a `@ai-sdk/anthropic` (diretto). Stesso modello (Claude 3.5 Haiku), stesso costo, cambio di 1 import + config.
**Riutilizzabile:** si — qualsiasi progetto che invia dati personali EU a LLM (bios, automatica, repalert)

## [2026-03-30] Schema AI Coach con Profili Persistenti
**Cosa:** Pattern DB per chatbot che costruisce profili utente progressivamente
**Perche':** Serviva passare da localStorage a DB con profili versionati e dashboard docente
**Come:** `user_profiles` con JSONB + Zod validation (campo `data`), `generated_outputs` con `version/source/parent_id` per versionamento, `sessions` per legare conversazioni a lezioni. Composite pattern dal Vercel AI Chatbot template + estensioni custom.
**Riutilizzabile:** si — bios (profilo paziente), automatica (profilo lead strutturato), qualsiasi AI assistant con profili progressivi

## [2026-03-30] maxTokens troppo basso tronca output AI
**Cosa:** maxTokens 512 nel route.ts tagliava bio, calendari e articoli a meta'
**Perche':** Il default era stato scelto per risposte brevi di scoperta, ma gli output finali sono lunghi
**Come:** Alzato a 1500. Costo irrilevante su Haiku (~$0.002/msg vs $0.0005/msg)
**Riutilizzabile:** si — qualsiasi chatbot con output strutturati lunghi. Regola: stimare il token count dell'output piu' lungo atteso e aggiungere 50% margine.
