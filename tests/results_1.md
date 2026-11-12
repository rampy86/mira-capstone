# Mira – Baseline Test Results

**Run date:** 11 Nov 2026 (08:21–09:47 UTC). **Assumptions:** project start 2026-03-30 (Week 1); as-of date 2026-04-27.
**Model:** OpenAI gpt-4o-mini (gpt-4o-mini-2024-07-18), temperature 0. **Tracing:** Langfuse (one trace per LLM call, named by agent).
**Metrics** are taken from the Langfuse export and include the Router call plus the agent call for each test. Cost is in USD.

## Summary

**Result: 12 of 12 passed after one fix. No hallucinations detected.** T6 failed on the first run (routing) and passed after the Router prompt fix (see Fix log).

| ID | Routed to | Pass/Fail | Hallucination? | Tokens (in/out) | Cost (USD) | Latency (s) | Trace link |
|---|---|---|---|---|---|---|---|
| T1 | plan → Planner | Pass | No | 2,009 / 708 | 0.000726 | 8.9 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/ee55b75510c85341112a6b6d4678a69a) |
| T2 | plan → Planner | Pass | No | 1,098 / 101 | 0.000225 | 2.5 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/373700f36fd1a3095e73b43461038d91) |
| T3 | risk → Risk Assessor | Pass | No | 2,575 / 611 | 0.000753 | 7.9 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/b874ba393fdb0c23d924855435ccd9d2) |
| T4 | risk → Risk Assessor | Pass | No | 1,147 / 66 | 0.000212 | 2.4 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/b3baf5eae674ee8416c2925cf7955831) |
| T5 | status → Status Reporter (Sprint 3) | Pass | No | 2,535 / 404 | 0.000623 | 5.9 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/2549022b86788223e919fc72ec80adc8) |
| T6 | status → Status Reporter | Pass (first run Fail) | No | 1,328 / 62 | 0.000236 | 3.5 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/c6682f290c42fba7e79a400b0ad365a9) |
| T7 | risk → Risk Assessor | Pass | No | 2,575 / 226 | 0.000522 | 5.2 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/e929da6ea812c03847ef11f7c6f9dbb6) |
| T8 | tracking → Milestone Tracker | Pass | No | 2,048 / 240 | 0.000451 | 5.3 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/83fb6ec7c726ff29d2576bf2d5cf988a) |
| T9 | plan → Planner | Pass | No | 1,101 / 84 | 0.000216 | 2.1 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/7d53335898818e1ac6ca2ee4f7bfdc91) |
| T10 | status → Status Reporter | Pass | No | 2,141 / 335 | 0.000522 | 4.7 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/5307eff4b49f593e81646f8f92b10c03) |
| T11 | tracking → Milestone Tracker | Pass | No | 2,048 / 206 | 0.000431 | 4.6 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/6215f196ec999f767c7112730bc9e1d5) |
| T12 | stakeholder_update → Stakeholder Update (Sprint 2) | Pass | No | 1,499 / 207 | 0.000349 | 3.8 | [trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/ddd52f20bca3829cc4d602d288f68731) |
| **Total** | | **12/12** | **0** | **22,104 / 3,250** | **0.005266** | **56.9** | |

## Cost and performance

- **Average per test:** 2,113 tokens, $0.00044, 4.7 s (T6 counted after the fix).
- **Router:** about 535 input and 30 output tokens per call before the T6 fix, and 686 input tokens after it (+151 tokens, about $0.00002 more per request, for the added rule and example). Latency 0.7–1.9 s.
- **Detailed vs vague inputs:** detailed requests (T1, T3, T5, T7, T8, T10, T11, T12) average 0.00055 USD; vague ones (T2, T4, T9) average 0.00022 USD. Clarifying questions are short and cheap, so the guardrail also saves cost.
- **Cost per user per day:** at 20 requests a day, about $0.0088 (≈ $0.193 a month for 22 working days).

## Fix log (evaluate → fix → re-evaluate)

| # | Test | Problem | Fix | Status |
|---|---|---|---|---|
| 1 | T6 | Router classified "Things are going fine" as `other`, so Mira returned Out of Scope instead of "no task data available". | Router prompt (12 Nov): added rule 5 (classify by the deliverable asked for, not the level of detail), narrowed the VAGUE INPUT RULE so "other" is only for requests outside Mira's deliverables, and added a status example with no data. | **Fixed.** 12 Nov: "NO TASK DATA AVAILABLE…" (Pass). Regression check (12 Nov): T2, T4 and T9 run again with unchanged outputs; all still ask clarifying questions. |
| 2 | T8 | Overdue T006 and T008 (due in 5 days) were not listed. | Milestone Tracker prompt: always print the Overdue section from `overdue`, and list every item in `due_next_7_days`. | Backlog: planned improvement, not needed to pass |
| 3 | T10 | "Completed" listed 2 tasks while the count shows 5 Done; health Amber vs Red in T5. | Status Reporter prompt: for all-sprint summaries, list completed tasks from the board, not the sprint; apply one health rule (Red if a High-priority task is Blocked or overdue). | Backlog: planned improvement, not needed to pass |

Langfuse also shows two extra Status Reporter calls (11 Nov 09:11 and 09:38) with only 65–78 input tokens. They look like single-node test runs without project data and are not part of T1–T12.

## Per-test results (playbook format)

### T1

| Field | Value |
|---|---|
| Test ID | T1 |
| Input | Generate a project plan for the AI Adoption Project at ABCDE Ltd. Use the provided project description. |
| Routed to | plan → Planner |
| Expected (from problem statement) | Must include phases, milestones, timeline. Must be grounded in the actual project description. Must NOT invent goals not in the description. |
| Expected keywords present? | Yes: all 8 phases with dates, 14 milestones from the timeline, only the 15% and 10% goals plus service responsiveness, team from the description. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,009 in, 708 out · $0.000726 · 8.9 s (mira-router + mira-intake-planner) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/ee55b75510c85341112a6b6d4678a69a) |

**Output:**

```
Project Plan: AI Adoption Project

Objectives:

1.  Reduce delivery delays by 15%.

2.  Lower operational costs by 10%.

3.  Improve service responsiveness.

Phases:

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Phase                    Weeks     Dates                      Key activities                                                                  Milestones / deliverables
  ------------------------ --------- -------------------------- ------------------------------------------------------------------------------- -------------------------------------------------------------
  Project Initiation       1-2       2026-03-30 to 2026-04-12   Define project scope; Form cross-functional team; Initial stakeholder meeting   Project charter signed off; Team structure finalized

  Current State Analysis   3-4       2026-04-13 to 2026-04-26   Assess existing processes & systems; Identify data sources & gaps               Current systems audit report; Gap analysis report

  Use Case Selection       5-6       2026-04-27 to 2026-05-10   Shortlist priority AI use cases (forecasting, route optimization)               Final list of prioritized use cases with success criteria

  Pilot Design             7-10      2026-05-11 to 2026-06-07   Data collection & preparation; Model design and development                     Working prototype models; Data pipelines established

  Pilot Implementation     11-14     2026-06-08 to 2026-07-05   Deploy AI models in test environments; Monitor performance                      Pilot results report; User feedback and performance metrics

  Evaluation & Iteration   15-16     2026-07-06 to 2026-07-19   Evaluate pilot outcomes; Adjust models as needed                                Updated models and process refinements

  Full Deployment          17-22     2026-07-20 to 2026-08-30   Scale AI models across selected departments; Train staff                        Full production rollout; Training sessions completed

  Monitoring & Review      23-24     2026-08-31 to 2026-09-13   Continuous performance monitoring; Final project review                         Project closure report; Recommendations for future scaling
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Key milestones:

-   Project charter signed off (2026-04-12)

-   Team structure finalized (2026-04-12)

-   Current systems audit report (2026-04-26)

-   Gap analysis report (2026-04-26)

-   Final list of prioritized use cases with success criteria (2026-05-10)

-   Working prototype models (2026-06-07)

-   Data pipelines established (2026-06-07)

-   Pilot results report (2026-07-05)

-   User feedback and performance metrics (2026-07-05)

-   Updated models and process refinements (2026-07-19)

-   Full production rollout (2026-08-30)

-   Training sessions completed (2026-08-30)

-   Project closure report (2026-09-13)

-   Recommendations for future scaling (2026-09-13)

Team: Data scientists, IT professionals, Business stakeholders.

Assumptions and open questions: UNKNOWN.

Sources used: project_description, phases.
```

### T2

| Field | Value |
|---|---|
| Test ID | T2 |
| Input | Generate a project plan for: 'We want to build a chatbot.' |
| Routed to | plan → Planner |
| Expected (from problem statement) | Must flag as insufficient detail. Must ask for scope, timeline, team size. Must NOT generate a full plan from one sentence. |
| Expected keywords present? | Yes: "INSUFFICIENT DETAIL", asks for scope, timeline and team size (plus deliverables and constraints); no plan generated. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 1,098 in, 101 out · $0.000225 · 2.5 s (mira-router + mira-intake-planner) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/373700f36fd1a3095e73b43461038d91) |

**Output:**

```
INSUFFICIENT DETAIL: I need more information before I can draft a plan. Please provide details on the following:

-   Scope and objectives of the chatbot project

-   Key deliverables

-   Timeline and deadline

-   Team size and roles

-   Any constraints (budget, tools, dependencies)

Once I have this information, I can create a structured project plan.
```

### T3

| Field | Value |
|---|---|
| Test ID | T3 |
| Input | Generate a risk assessment for the AI Adoption Project at ABCDE Ltd. |
| Routed to | risk → Risk Assessor |
| Expected (from problem statement) | Must produce categorized risks relevant to logistics/AI. Must NOT include generic risks unrelated to project. |
| Expected keywords present? | Yes: all 10 risks R01–R10 by category with impact and mitigation from the CSV, linked to task evidence (T024, T006, T025). Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,575 in, 611 out · $0.000753 · 7.9 s (mira-router + mira-risk-assessor) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/b874ba393fdb0c23d924855435ccd9d2) |
| Notes | Ratings (High/Medium/Watch) are derived from task evidence, not from the CSV, which has no scores; acceptable because the method is shown. |

**Output:**

```
Risk Assessment: AI Adoption Project

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  ID    Category                      Risk                                                Impact                                               Mitigation                                                       Task-board evidence                                                                            Rating
  ----- ----------------------------- --------------------------------------------------- ---------------------------------------------------- ---------------------------------------------------------------- ---------------------------------------------------------------------------------------------- --------
  R09   Security Vulnerabilities      AI models targeted by adversarial attacks           Data breaches and operational risks                  Adopt AI security best practices and penetration testing         T024: Security review of AI infrastructure - Blocked: waiting for security team availability   High

  R01   Data Quality & Availability   Incomplete or unstructured data                     Poor model performance and inaccurate outcomes       Perform early data audits and implement robust data governance   T006: Identify data gaps and quality issues - In Progress, overdue by 6 days                   High

  R05   Ethical & Legal Concerns      Risks of biased models or data privacy violations   Legal repercussions and reputational damage          Involve legal early and implement fairness checks                T025: Legal review of data usage - In Progress, due in 1 day                                   Medium

  R02   Integration Issues            Difficulty integrating AI with legacy systems       Delays in deployment and operational disruptions     Plan integration roadmap and use APIs/middleware                 No task evidence yet                                                                           Watch

  R03   Talent & Skills Gap           Lack of internal AI/ML expertise                    Overreliance on external vendors and slow progress   Provide staff training and hire specialized talent               No task evidence yet                                                                           Watch

  R04   Change Resistance             Employees resist adopting AI-driven workflows       Low adoption and reduced ROI                         Strong change management and early engagement                    No task evidence yet                                                                           Watch

  R06   Cost Overruns                 Underestimation of AI development costs             Budget constraints and project delays                Set realistic budget and build in contingency funds              No task evidence yet                                                                           Watch

  R07   Unrealistic Expectations      Stakeholders expect immediate ROI                   Disillusionment and loss of support                  Align expectations and show quick wins                           No task evidence yet                                                                           Watch

  R08   Model Performance Drift       AI models lose accuracy over time                   Incorrect decisions and trust erosion                Regular retraining cycles and monitoring dashboards              No task evidence yet                                                                           Watch

  R10   Vendor Lock-in                Overdependence on a specific AI platform            Flexibility loss and future switching costs          Favor open standards and negotiate flexible vendor terms         No task evidence yet                                                                           Watch
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Top actions this week:

1.  T024 - James Wong

2.  T006 - Priya Nair

3.  T025 - Sarah Lin

Sources used: as_of, project_description, risk_register, task_evidenc
```

### T4

| Field | Value |
|---|---|
| Test ID | T4 |
| Input | Generate a risk assessment for: 'New project starting soon.' |
| Routed to | risk → Risk Assessor |
| Expected (from problem statement) | Must flag as insufficient. Must ask for project details. Must NOT invent project-specific risks from nothing. |
| Expected keywords present? | Yes: "INSUFFICIENT DETAIL", asks for goal, scope, timeline, team, technology and dependencies; no risks listed. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 1,147 in, 66 out · $0.000212 · 2.4 s (mira-router + mira-risk-assessor) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/b3baf5eae674ee8416c2925cf7955831) |

**Output:**

```
INSUFFICIENT DETAIL: I can't assess risks without project details. Please provide the project's goal and domain, scope, timeline, team and skills, technology and data involved, and key dependencies.
```

### T5

| Field | Value |
|---|---|
| Test ID | T5 |
| Input | Generate a weekly status report using the sample task board for Sprint 3. |
| Routed to | status → Status Reporter (Sprint 3) |
| Expected (from problem statement) | Must show tasks by status. Must reference actual task names from CSV. Must NOT invent tasks. |
| Expected keywords present? | Yes: Sprint 3 tasks T007, T008, T009, T025 with owners, statuses and due dates from the CSV; project counts 5/3/1/16/25. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,535 in, 404 out · $0.000623 · 5.9 s (mira-router + mira-status-reporter) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/2549022b86788223e919fc72ec80adc8) |

**Output:**

```
Weekly Status Report: Sprint 3 (as of 2026-04-27)

Overall health: Red - Task T024 is Blocked and overdue task T006 is High-priority. Project counts:

  -------------------------------------------------------------------------
  Done        In Progress         Blocked            To Do      Total
  ----------- ------------------- ------------------ ---------- -----------
  5           3                   1                  16         25

  -------------------------------------------------------------------------

  --------------------------------------------------------------------------------------------------
  ID        Task                                        Owner          Status           Due
  --------- ------------------------------------------- -------------- ---------------- ------------
  T007      Shortlist AI use cases                      Arjun Mehta    In Progress      2026-04-28

  T008      Define success criteria for each use case   Sarah Lin      To Do            2026-05-02

  T009      Vendor evaluation for ML platform           James Wong     To Do            2026-05-05

  T025      Legal review of data usage                  Sarah Lin      In Progress      2026-04-28
  --------------------------------------------------------------------------------------------------

Completed: None
In progress: T007, T025
Blocked: None
Overdue: T006 (6 days overdue)
Due in the next 7 days: T007, T008, T025
Upcoming milestones (next 14 days): Use Case Selection (2026-04-27 to 2026-05-10)
Late milestones: Current State Analysis

Help needed: None
Sources used: counts_all_tasks, sprint, sprint_tasks, blocked, overdue, due_next_7_days, upcoming_milestones_14_days, late_milestones
```

### T6

| Field | Value |
|---|---|
| Test ID | T6 |
| Input | Generate a weekly status report for: 'Things are going fine.' |
| Routed to | status → Status Reporter (first run: other → Out of Scope) |
| Expected (from problem statement) | Must state no task data available. Must NOT fabricate task statuses or progress percentages. |
| Expected keywords present? | Yes: "NO TASK DATA AVAILABLE", asks for a task-board export and the sprint or week; no statuses or percentages. First run: missing "no task data available" because the Router returned "other". |
| Hallucination detected? | No |
| Pass/Fail | **Pass** (first run: Fail) |
| Tokens / cost / latency | 1,328 in, 62 out · $0.000236 · 3.5 s (mira-router 686/26 + mira-status-reporter 642/36). First run: 535 in, 33 out · $0.000100 · 1.5 s (mira-router only) |
| Trace | [Router](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/5bfacd9c07621a9d078aac66a50dbf7f), [Status Reporter](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/c6682f290c42fba7e79a400b0ad365a9). First run: [Router](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/562b90ae05b2eb449db299012cfe321e) |
| Notes | Fixed by Router prompt rule 5 and a narrower VAGUE INPUT RULE (Fix log #1). |

**Output (12 Nov, after fix):**

```
NO TASK DATA AVAILABLE: I can't report status without a task board. Please share a task-board export (CSV, Jira or Trello) and the sprint or week to cover.
```

**Output (first run, 11 Nov, before fix):**

```
OUT OF SCOPE: I'm Mira, the project intelligence assistant for the ABCDE Ltd. AI Adoption Project. I can help with project plans, risk assessments, weekly status reports, blocked/overdue tasks and upcoming milestones, and stakeholder update emails. Please ask about one of these.
```

### T7

| Field | Value |
|---|---|
| Test ID | T7 |
| Input | What are the top 3 risks for the ABCDE Ltd project? |
| Routed to | risk → Risk Assessor |
| Expected (from problem statement) | Must reference actual risks from risk CSV. Must NOT invent risks not in the data. |
| Expected keywords present? | Yes: R01, R09, R05 from the CSV with impact and mitigation, ranking method stated (live task-board evidence). Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,575 in, 226 out · $0.000522 · 5.2 s (mira-router + mira-risk-assessor) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/e929da6ea812c03847ef11f7c6f9dbb6) |

**Output:**

```
Ranking method: the register has no severity scores, so risks are ranked by live task-board evidence.

1.  ID: R01, Category: Data Quality & Availability, Why it ranks here: T006, In Progress, 2026-04-21, Impact: Poor model performance and inaccurate outcomes, Mitigation: Perform early data audits and implement robust data governance.

2.  ID: R09, Category: Security Vulnerabilities, Why it ranks here: T024, Blocked, 2026-05-26, Impact: Data breaches and operational risks, Mitigation: Adopt AI security best practices and penetration testing.

3.  ID: R05, Category: Ethical & Legal Concerns, Why it ranks here: T025, In Progress, 2026-04-28, Impact: Legal repercussions and reputational damage, Mitigation: Involve legal early and implement fairness checks.

Sources used: as_of, risk_register, task_evidence.
```

### T8

| Field | Value |
|---|---|
| Test ID | T8 |
| Input | Which tasks are blocked or at risk of missing their deadline? |
| Routed to | tracking → Milestone Tracker |
| Expected (from problem statement) | Must identify T024 (Security review - BLOCKED). Must check due dates against current progress. |
| Expected keywords present? | Yes: T024 Blocked with owner and reason; T007 and T025 due 2026-04-28 (1 day left); due dates checked against as_of. Missing: T006 (6 days overdue) and T008 (due 2026-05-02). |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,048 in, 240 out · $0.000451 · 5.3 s (mira-router + mira-milestone-tracker) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/83fb6ec7c726ff29d2576bf2d5cf988a) |
| Notes | Passes the stated criteria, but the overdue section and T008 should appear. Improvement below. |

**Output:**

```
Blocked

-   ID: T024
    Task: Security review of AI infrastructure
    Owner: James Wong
    Due Date: 2026-05-26
    Reason: waiting for security team availability
    Suggested Action: James Wong should follow up with the security team for availability.

At risk (due in the next 7 days and not Done)

-   ID: T007
    Task: Shortlist AI use cases
    Owner: Arjun Mehta
    Due Date: 2026-04-28
    Days Left: 1

-   ID: T025
    Task: Legal review of data usage
    Owner: Sarah Lin
    Due Date: 2026-04-28
    Days Left: 1

Schedule check

Task board ends 2026-08-04; timeline ends 2026-09-13.

Sources used: blocked, due_next_7_days, schedule_check.
```

### T9

| Field | Value |
|---|---|
| Test ID | T9 |
| Input | Generate a project plan for a 2-week project with no other details. |
| Routed to | plan → Planner |
| Expected (from problem statement) | Must ask for scope, goals, deliverables. Must NOT generate detailed plan from timeline alone. |
| Expected keywords present? | Yes: "INSUFFICIENT DETAIL", asks for scope, deliverables and constraints; no plan built from the 2-week timeline alone. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 1,101 in, 84 out · $0.000216 · 2.1 s (mira-router + mira-intake-planner) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/7d53335898818e1ac6ca2ee4f7bfdc91) |
| Notes | It also asks for timeline although "2 weeks" was given; minor. |

**Output:**

```
INSUFFICIENT DETAIL: I need more information before I can draft a plan. Please provide details about the following:

-   Scope and objectives of the project

-   Key deliverables

-   Timeline and deadline

-   Team size and roles

-   Constraints (budget, tools, dependencies)
```

### T10

| Field | Value |
|---|---|
| Test ID | T10 |
| Input | Summarize current project status: tasks done, in progress, to do, blocked? |
| Routed to | status → Status Reporter |
| Expected (from problem statement) | Must count correctly from task board CSV. Counts must match actual data. |
| Expected keywords present? | Yes: Done 5, In Progress 3, Blocked 1, To Do 16, Total 25, matching the CSV. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,141 in, 335 out · $0.000522 · 4.7 s (mira-router + mira-status-reporter) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/5307eff4b49f593e81646f8f92b10c03) |
| Notes | The "Completed" line lists only T004 and T005, while the count says 5 Done (T001–T005). Health is Amber here but Red in T5. Improvement below. |

**Output:**

```
Weekly Status Report: All sprints (as of 2026-04-27)

Overall health: Amber - tasks due in the next 7 days are not Done (T007, T008, T025). Project counts:

  -------------------------------------------------------------------------
  Done        In Progress         Blocked            To Do      Total
  ----------- ------------------- ------------------ ---------- -----------
  5           3                   1                  16         25

  -------------------------------------------------------------------------

Completed: T004 Audit existing data infrastructure, T005 Map current logistics workflows
In progress: T006 Identify data gaps and quality issues, T007 Shortlist AI use cases, T025 Legal review of data usage
Blocked: T024 Security review of AI infrastructure
Overdue: T006 Identify data gaps and quality issues (6 days overdue)
Due in the next 7 days: T007 Shortlist AI use cases, T008 Define success criteria for each use case, T025 Legal review of data usage
Upcoming milestones (next 14 days): Use Case Selection (2026-04-27 to 2026-05-10)
Late milestones: Current State Analysis (ended on 2026-04-26)

Help needed: Assistance required from the security team for T024 Security review of AI infrastructure.

Sources used: counts_all_tasks, blocked, overdue, due_next_7_days, upcoming_milestones_14_days, late_milestones.
```

### T11

| Field | Value |
|---|---|
| Test ID | T11 |
| Input | What milestones are coming up in the next 2 weeks? |
| Routed to | tracking → Milestone Tracker |
| Expected (from problem statement) | Must reference actual milestones from project_timeline.csv. Must NOT invent milestones. |
| Expected keywords present? | Yes: Phase 3 milestone "Final list of prioritized use cases with success criteria" (ends 2026-05-10) with open tasks T007, T008, T009, T025; late Phase 2 milestone. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 2,048 in, 206 out · $0.000431 · 4.6 s (mira-router + mira-milestone-tracker) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/6215f196ec999f767c7112730bc9e1d5) |

**Output:**

```
Upcoming milestones (next 14 days)

-   Phase: 3

    -   End date: 2026-05-10

    -   Milestone: Final list of prioritized use cases with success criteria

    -   Unfinished tasks due in that phase:

        -   T007 Shortlist AI use cases (In Progress)

        -   T008 Define success criteria for each use case (To Do)

        -   T009 Vendor evaluation for ML platform (To Do)

        -   T025 Legal review of data usage (In Progress)

Late milestones

-   Phase: 2

    -   Affected milestone: Current systems audit report; Gap analysis report

Schedule check

-   Note: Task board ends 2026-08-04; timeline ends 2026-09-13.

Sources used: upcoming_milestones_14_days, late_milestones, schedule_check.note
```

### T12

| Field | Value |
|---|---|
| Test ID | T12 |
| Input | Generate a stakeholder update email for Sprint 2 progress |
| Routed to | stakeholder_update → Stakeholder Update (Sprint 2) |
| Expected (from problem statement) | Must reference Sprint 2 tasks. Must be professional. Must NOT include Sprint 3+ tasks. |
| Expected keywords present? | Yes: Sprint 2 tasks only (T004, T005, T006), 2 done and 1 in progress, T006 6 days overdue, professional draft marked for PM review. Missing: none. |
| Hallucination detected? | No |
| Pass/Fail | **Pass** |
| Tokens / cost / latency | 1,499 in, 207 out · $0.000349 · 3.8 s (mira-router + mira-stakeholder-update) |
| Trace | [Langfuse trace](https://cloud.langfuse.com/project/cmw9gm33i05suad0dcqg1x0ah/traces/ddd52f20bca3829cc4d602d288f68731) |

**Output:**

```
DRAFT - for PM review before sending
Subject: ABCDE Ltd. AI Adoption - Sprint 2 update

Dear Team,

Summary: In Sprint 2, we have completed 2 tasks and have 1 task currently in progress. The team is focused on identifying data gaps and quality issues, which is currently overdue by 6 days.

Completed:

-   Audit existing data infrastructure

-   Map current logistics workflows

In progress:

-   Identify data gaps and quality issues (Due: 2026-04-21)

Risks and blockers:

-   Identify data gaps and quality issues (6 days overdue)

Next steps:

-   Finish identifying data gaps and quality issues.

Best regards,
[Your name], Project Manager, Nexora

Sources used: as_of, sprint, sprint_tasks, sprint_counts, overdue_in_this_sprint
```
