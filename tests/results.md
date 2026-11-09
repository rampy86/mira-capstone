# Mira – Baseline Test Results

Assumptions: project start 2026-03-30 (Week 1); as-of date 2026-04-27. Model: openai/gpt-4o-mini via OpenRouter. Tracing: Langfuse.

## Summary

| ID | Routed to | Pass/Fail | Hallucination? | Tokens (in/out) | Cost (USD) | Latency (s) | Trace link |
|---|---|---|---|---|---|---|---|
| T1 | | | | | | | |
| T2 | | | | | | | |
| T3 | | | | | | | |
| T4 | | | | | | | |
| T5 | | | | | | | |
| T6 | | | | | | | |
| T7 | | | | | | | |
| T8 | | | | | | | |
| T9 | | | | | | | |
| T10 | | | | | | | |
| T11 | | | | | | | |
| T12 | | | | | | | |

## Per-test results (playbook format)

### T1

| Field | Value |
|---|---|
| Test ID | T1 |
| Input | Generate a project plan for the AI Adoption Project at ABCDE Ltd. Use the provided project description. |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | 8 phases with dates and milestones; only the 15% / 10% goals; no invented goals |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T2

| Field | Value |
|---|---|
| Test ID | T2 |
| Input | Generate a project plan for: "We want to build a chatbot." (vague input) |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Flags insufficient detail; asks scope, timeline, team size; no plan |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T3

| Field | Value |
|---|---|
| Test ID | T3 |
| Input | Generate a risk assessment for the AI Adoption Project at ABCDE Ltd. Use the provided project description. |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Categorized R01-R10 relevant to logistics/AI; no generic risks |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T4

| Field | Value |
|---|---|
| Test ID | T4 |
| Input | Generate a risk assessment for: "New project starting soon." (vague input) |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Flags insufficient; asks for project details; no risks listed |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T5

| Field | Value |
|---|---|
| Test ID | T5 |
| Input | Generate a weekly status report using the sample task board data for Sprint 3. |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Tasks by status; T007, T008, T009, T025 named from CSV; no invented tasks |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T6

| Field | Value |
|---|---|
| Test ID | T6 |
| Input | Generate a weekly status report for: "Things are going fine." (no task data) |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | States no task data; no statuses or percentages |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T7

| Field | Value |
|---|---|
| Test ID | T7 |
| Input | What are the top 3 risks for the ABCDE Ltd project based on the risk data? |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Actual risks from CSV (R09, R05, R01) with stated ranking method; none invented |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T8

| Field | Value |
|---|---|
| Test ID | T8 |
| Input | Which tasks are blocked or at risk of missing their deadline based on the task board? |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | T024 Blocked; T006 overdue 6 days; T007/T025 due Apr 28; due dates checked |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T9

| Field | Value |
|---|---|
| Test ID | T9 |
| Input | Generate a project plan for a 2-week project with no details provided. |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Asks for scope, goals, deliverables; no detailed plan |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T10

| Field | Value |
|---|---|
| Test ID | T10 |
| Input | Summarize the current project status: how many tasks are done, in progress, and to do? |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Done 5, In Progress 3, Blocked 1, To Do 16, Total 25 |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T11

| Field | Value |
|---|---|
| Test ID | T11 |
| Input | What milestones are coming up in the next 2 weeks based on the timeline? |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Phase 3 milestone (ends May 10) from project_timeline.csv; none invented |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

### T12

| Field | Value |
|---|---|
| Test ID | T12 |
| Input | Generate a stakeholder update email summarizing Sprint 2 progress. |
| Output | (paste full pipeline output below the table) |
| Expected (from problem statement) | Sprint 2 tasks only (T004, T005, T006); professional; no Sprint 3+ tasks |
| Expected keywords present? | Yes: [list]. Missing: [list] |
| Hallucination detected? | No / Yes: [describe what was invented] |
| Pass/Fail | |

**Output:**

```
(paste here)
```

## Extra tests

| ID | Input | Expected | Output summary | Hallucination? | Pass/Fail |
|---|---|---|---|---|---|
| E1 | What's the status of Sprint 12? | Says Sprint 12 has no tasks | | | |
| E2 | Who owns the security review and why is it stuck? | James Wong; waiting for security team availability | | | |
| E3 | Write an engineering update for Sprint 3. | IDs, owners, due dates; Sprint 3 only | | | |
| E4 | Book me a flight to London. | Out of Scope reply | | | |

## Fix and re-test log (evaluate → find failure → fix prompt → re-evaluate)

| # | Test | Failure seen in trace | Agent at fault | Prompt change made | Output before | Output after | Trace before / after |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |

## Trace analysis

- Vague vs detailed inputs: average output tokens and cost for T2/T4/T6/T9 vs T1/T3/T5: ...
- Any agent that invented information on a vague input: ...
- Cost per pipeline run (Router + agent), averaged over the 12 tests: ...

## Prompt experiments

1. Counting by LLM vs code (T10 x3 without counts_all_tasks): ...
2. Router without the use_project_files rule (T2, T4, T6, T9): ...
