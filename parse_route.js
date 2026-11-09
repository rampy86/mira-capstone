// ===== Mira: Parse Route (n8n Code node, "Run Once for All Items") =====
// Reads the Router's JSON, then builds a small, scoped context for ONE agent.
const request = $('When chat message received').first().json.chatInput;
const f = $('Compute Facts').first().json;

// 1) Parse the Router output safely (strip ```json fences if present)
let raw = $input.first().json.text ?? $input.first().json.output ?? '';
raw = String(raw).replace(/```json|```/g, '').trim();
let route;
try { route = JSON.parse(raw); }
catch (e) { route = { intent: 'other', use_project_files: false, sprint: null, reason: 'Router output was not valid JSON' }; }

const intents = ['plan', 'risk', 'status', 'tracking', 'stakeholder_update', 'other'];
if (!intents.includes(route.intent)) route.intent = 'other';
const useFiles = route.use_project_files === true;

// 2) Build the context each agent is allowed to see
let context;
if (!useFiles) {
  context = { note: 'NO PROJECT FILES PROVIDED. Use only the text in the user request.' };
} else if (route.intent === 'plan') {
  context = { as_of: f.as_of, project_description: f.description,
    phases: f.phases.map(p => ({ phase: p.phase, name: p.name, weeks: p.weeks, start: p.start, end: p.end,
      key_activities: p.key_activities, milestones: p.milestones })) };
} else if (route.intent === 'risk') {
  context = { as_of: f.as_of, project_description: f.description, risk_register: f.risks,
    task_evidence: { blocked: f.blocked, overdue: f.overdue, due_next_7_days: f.due_next_7_days } };
} else if (route.intent === 'status') {
  const sprintKey = route.sprint ? `Sprint ${route.sprint}` : null;
  context = { as_of: f.as_of, counts_all_tasks: f.counts,
    sprint: sprintKey, sprint_tasks: sprintKey ? (f.tasks_by_sprint[sprintKey] || []) : null,
    blocked: f.blocked, overdue: f.overdue, due_next_7_days: f.due_next_7_days,
    upcoming_milestones_14_days: f.upcoming_milestones_14_days, late_milestones: f.late_milestones };
} else if (route.intent === 'tracking') {
  context = { as_of: f.as_of, blocked: f.blocked, overdue: f.overdue, due_next_7_days: f.due_next_7_days,
    upcoming_milestones_14_days: f.upcoming_milestones_14_days, late_milestones: f.late_milestones,
    schedule_check: f.schedule_check };
} else if (route.intent === 'stakeholder_update') {
  const sprintKey = route.sprint ? `Sprint ${route.sprint}` : null;
  const st = sprintKey ? (f.tasks_by_sprint[sprintKey] || []) : [];
  const c = {}; for (const t of st) c[t.status] = (c[t.status] || 0) + 1;
  context = { as_of: f.as_of, sprint: sprintKey, sprint_tasks: st, sprint_counts: c,
    overdue_in_this_sprint: f.overdue.filter(t => t.sprint === sprintKey) };
} else {
  context = { note: 'Request is outside Mira scope.' };
}

return [{ json: { request, intent: route.intent, use_project_files: useFiles,
  sprint: route.sprint ?? null, router_reason: route.reason ?? '',
  context: JSON.stringify(context, null, 1) } }];
