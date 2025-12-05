export async function generatePlanRequest({ goal, hoursPerDay, includeOverdue }) {
  // Stubbed planner: returns a suggested week based on inputs.
  // Replace with backend call when available.
  const today = new Date();
  const baseDay = today.getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mkDate = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return `${days[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
  };

  const tasks = [
    {
      title: 'Prep witness outline',
      matter: 'Lumen Compliance',
      duration: 2,
      state: 'In Progress',
      dayOffset: 1,
      risk: 'deadline in 48h',
    },
    {
      title: 'Approval brief — motion to compel',
      matter: 'State v. Jordan',
      duration: 1.5,
      state: 'Pending Approval',
      dayOffset: 2,
      risk: includeOverdue ? 'requires approver' : null,
    },
    {
      title: 'Client sync — settlement options',
      matter: 'ACME vs. Northwind',
      duration: 1,
      state: 'In Progress',
      dayOffset: 3,
      risk: null,
    },
    {
      title: 'File amended complaint',
      matter: 'Nova IP',
      duration: 1,
      state: 'Approved',
      dayOffset: 4,
      risk: includeOverdue ? 'overdue filing' : null,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        goal: goal || 'Ship critical filings and approvals this week',
        hoursPerDay,
        includeOverdue,
        plan: tasks.map((t) => ({
          ...t,
          slot: mkDate(t.dayOffset),
        })),
        summary: {
          hoursPlanned: tasks.reduce((sum, t) => sum + t.duration, 0),
          risks: tasks.filter((t) => t.risk).length,
        },
      });
    }, 350);
  });
}
