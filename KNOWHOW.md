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

## [2026-04-03] Multi-Prompt con State Injection (pattern validato da 4 prodotti)
**Cosa:** Architettura a 3 prompt separati (discovery/synthesis/output) con state_object iniettato dal backend
**Perche':** Un monolite da 300 righe confonde il modello. Prompt piu' corti e mirati = migliore instruction-following.
**Come:** Backend tiene `{phase, questionsAsked, traitsFound, outputsGenerated}` in DB. Ogni fase ha il suo prompt con regole specifiche. Transizioni deterministiche nel codice, non delegate al modello. Pattern confermato da: Gradient Labs (central agent + skill), SERHANT (multi-model per task), Vercel "Agent Responsibly" (guardrail nel codice), Claude Code 9B (prompt switching + output contracts).
**Riutilizzabile:** si — bios (fasi: upload doc → analisi → report narrativo), automatica (fasi: lead intake → classification → response), qualsiasi AI con workflow multi-step

## [2026-04-03] Anthropic Model ID: claude-haiku-4-5-20251001 (non claude-3-5-haiku-latest)
**Cosa:** Il model ID `claude-3-5-haiku-latest` restituisce 404 su Anthropic API diretto
**Perche':** Il naming e' cambiato con la famiglia Claude 4.x. Il vecchio alias non esiste piu'.
**Come:** Usare `claude-haiku-4-5-20251001` come default. Testare con `/api/test` prima di deployare.
**Riutilizzabile:** si — qualsiasi progetto che usa Anthropic API diretto

## [2026-04-03] Vercel AI SDK: ai@6 breaking changes — restare su ai@4
**Cosa:** `ai@6` ha 4+ breaking changes che rompono frontend e backend
**Perche':** Upgrade a `ai@6` per compatibilita' `@ai-sdk/anthropic@3` ha rotto build
**Come:** Breaking: `maxTokens` → `maxOutputTokens`, `toDataStreamResponse` → `toTextStreamResponse`, `useChat` spostato in `@ai-sdk/react` con firma diversa, `input` rimosso da `UseChatHelpers`. Fix: restare su `ai@4.3.x` + `@ai-sdk/anthropic@1.x`. Non mischiare major versions.
**Riutilizzabile:** si — TUTTI i progetti Next.js con Vercel AI SDK (bios, automatica)
