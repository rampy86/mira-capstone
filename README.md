# Mira – AI-Powered Project Intelligence Assistant

Capstone for Applied Agentic AI for PMs/TPMs (Interview Kickstart). Mira generates grounded project plans, risk assessments, weekly status reports, milestone alerts and stakeholder updates from project files.

## Architecture
Router pattern in n8n: Chat Trigger → load 4 files → Compute Facts (code) → Router (LLM, JSON) → Parse Route (code) → Switch → one of 5 agents (Planner, Risk Assessor, Status Reporter, Milestone Tracker, Stakeholder Update). Model: OpenAI gpt-4o-mini (`openai:gpt-4o-mini`, temperature 0), called through the Langfuse AI Gateway, so every LLM call is traced in Langfuse with tokens, cost and latency. Each agent uses its own trace name (`mira-router`, `mira-intake-planner`, `mira-risk-assessor`, `mira-status-reporter`, `mira-milestone-tracker`, `mira-stakeholder-update`). Built and documented following the course Capstone Project Playbook (7 steps).
![Architecture](docs/architecture.png)

## Assumptions
- Project start (Week 1, Monday): 2026-03-30
- As-of date ("today" for Mira): 2026-04-27
- Data note: the task board has 5 Done tasks (T001–T005), not 3 as stated in the problem statement. Mira counts from the CSV.

## Results
12 of 12 baseline tests pass, with no hallucinations; T6 passed after one Router prompt fix. Average cost about $0.00044 and 4.7 s per request (Router plus agent). Details: `tests/results.md`.

## How to run
1. Import `workflows/mira.json` into n8n.
2. In Langfuse, set up the AI Gateway (OpenAI provider) and create a gateway key. In n8n, create one OpenAI credential per agent: API key = the gateway key, Base URL = `https://gateway.cloud.langfuse.com/openai/v1`, and a custom header `langfuse-trace-name` set to the agent's trace name. Select the matching credential in each OpenAI Chat Model node, with model `openai:gpt-4o-mini`.
3. Update the 4 HTTP Request URLs to the raw URLs of the files in `data/`.
4. Open the chat and run the inputs in `data/eval_mira_inputs.txt`.

## Contents
- `docs/` – Q1 Ideation, Q2 write-up, Q3 Program Charter, Q4 Reflection, architecture diagram
- `prompts/` – router and agent system prompts (ROLE / INPUT / OUTPUT / RULES / VAGUE INPUT RULE), ready to paste
- `src/` – Code node scripts
- `tests/results.md` – baseline and extra test results
- `screenshots/` – canvas, runs, traces
