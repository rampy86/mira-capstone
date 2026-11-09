// ===== Mira: Compute Facts (n8n Code node, "Run Once for All Items") =====
// Change these two dates only if you choose different assumptions.
const PROJECT_START = '2026-03-30'; // Monday of Week 1
const AS_OF = '2026-04-27';         // Mira's "today" (Week 5, Sprint 3)

// --- small CSV parser (handles quoted fields with commas) ---
function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false;
  text = String(text).replace(/\r/g, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift().map(h => h.trim());
  return rows.filter(r => r.some(v => v.trim() !== ''))
    .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
}

const day = 86400000;
const toDate = s => new Date(s + 'T00:00:00Z');
const iso = d => d.toISOString().slice(0, 10);
const addDays = (s, n) => iso(new Date(toDate(s).getTime() + n * day));
const diffDays = (a, b) => Math.round((toDate(a) - toDate(b)) / day); // a - b

// --- read the four HTTP Request nodes (Response Format = Text) ---
const description = $('Get Description').first().json.data;
const timeline = parseCSV($('Get Timeline').first().json.data);
const risks = parseCSV($('Get Risks').first().json.data);
const tasks = parseCSV($('Get Task Board').first().json.data);

// --- task counts ---
const statuses = ['Done', 'In Progress', 'Blocked', 'To Do'];
const counts = Object.fromEntries(statuses.map(s => [s, tasks.filter(t => t.status === s).length]));
counts.Total = tasks.length;

const slim = t => ({ id: t.task_id, name: t.task_name, status: t.status, assignee: t.assignee,
  priority: t.priority, sprint: t.sprint, due: t.due_date, label: t.labels, description: t.description });

const open = tasks.filter(t => t.status !== 'Done');
const blocked = open.filter(t => t.status === 'Blocked').map(slim);
const overdue = open.filter(t => t.due_date < AS_OF)
  .map(t => ({ ...slim(t), days_overdue: diffDays(AS_OF, t.due_date) }));
const dueNext7 = open.filter(t => t.due_date >= AS_OF && t.due_date <= addDays(AS_OF, 7))
  .map(t => ({ ...slim(t), days_left: diffDays(t.due_date, AS_OF) }));

// --- tasks by sprint ---
const bySprint = {};
for (const t of tasks) (bySprint[t.sprint] = bySprint[t.sprint] || []).push(slim(t));

// --- phases with real dates (Week n starts PROJECT_START + 7*(n-1)) ---
const phases = timeline.map(p => {
  const start = addDays(PROJECT_START, 7 * (Number(p.start_week) - 1));
  const end = addDays(PROJECT_START, 7 * Number(p.end_week) - 1);
  const phaseTasks = tasks.filter(t => t.due_date >= start && t.due_date <= end);
  const state = end < AS_OF ? 'ended' : (start <= AS_OF ? 'current' : 'future');
  return {
    phase: Number(p.phase), name: p.phase_name, weeks: `${p.start_week}-${p.end_week}`,
    start, end, state, key_activities: p.key_activities, milestones: p.milestones_deliverables,
    tasks_due_in_phase: phaseTasks.map(t => `${t.task_id} ${t.task_name} (${t.status})`),
    unfinished_tasks: phaseTasks.filter(t => t.status !== 'Done').map(t => t.task_id)
  };
});
const horizon = addDays(AS_OF, 14);
const upcomingMilestones = phases.filter(p => p.end >= AS_OF && p.end <= horizon);
const lateMilestones = phases.filter(p => p.state === 'ended' && p.unfinished_tasks.length);

// --- board vs timeline mismatch (board finishes earlier than plan) ---
const lastTaskDue = tasks.map(t => t.due_date).sort().at(-1);
const planEnd = phases.at(-1).end;

return [{ json: {
  as_of: AS_OF, project_start: PROJECT_START, description,
  counts, blocked, overdue, due_next_7_days: dueNext7, tasks_by_sprint: bySprint,
  all_tasks: tasks.map(slim), phases, upcoming_milestones_14_days: upcomingMilestones,
  late_milestones: lateMilestones, risks,
  schedule_check: { last_task_due: lastTaskDue, timeline_end: planEnd,
    note: `Task board ends ${lastTaskDue}; timeline ends ${planEnd}.` }
} }];
