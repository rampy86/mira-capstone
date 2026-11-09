# Mira – AI-Powered Project Intelligence Assistant

Capstone for Applied Agentic AI for PMs/TPMs (Interview Kickstart). Mira generates grounded project plans, risk assessments, weekly status reports, milestone alerts and stakeholder updates from project files.

## Architecture
Router pattern in n8n: Chat Trigger → load 4 files → Compute Facts (code) → Router (LLM, JSON) → Parse Route (code) → Switch → one of 5 agents (Planner, Risk Assessor, Status Reporter, Milestone Tracker, Stakeholder Update). Every LLM call is traced in Langfuse via OpenRouter Broadcast. Built and documented following the course Capstone Project Playbook (7 steps).
![Architecture](docs/architecture.png)

## Assumptions
- Project start (Week 1, Monday): 2026-03-30
- As-of date ("today" for Mira): 2026-04-27
- Data note: the task board has 5 Done tasks (T001–T005), not 3 as stated in the problem statement. Mira counts from the CSV.

## How to run
1. Import `workflows/mira.json` into n8n.
2. Add an OpenRouter credential; select it in each chat model node.
3. Update the 4 HTTP Request URLs to the raw URLs of the files in `data/`.
4. Open the chat and run the inputs in `data/eval_mira_inputs.txt`.

## Contents
- `docs/` – Q1 Ideation, Q2 write-up, Q3 Program Charter, Q4 Reflection, architecture diagram
- `prompts/` – router and agent system prompts (ROLE / INPUT / OUTPUT / RULES / VAGUE INPUT RULE), ready to paste
- `src/` – Code node scripts
- `tests/results.md` – baseline and extra test results
- `screenshots/` – canvas, runs, traces
