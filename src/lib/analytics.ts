type Event = {
  type: string;
  step?: number;
  featureId?: string;
  extraId?: string;
  timestamp: number;
};

function getEvents(): Event[] {
  try {
    const raw = localStorage.getItem("iwq_analytics_events");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setEvents(events: Event[]) {
  localStorage.setItem("iwq_analytics_events", JSON.stringify(events));
}

export function track(e: Omit<Event, "timestamp">) {
  const events = getEvents();
  events.push({ ...e, timestamp: Date.now() });
  setEvents(events);
}

export function summary() {
  const events = getEvents();
  const stepViews: Record<number, number> = {};
  const featureSelections: Record<string, number> = {};
  const extraSelections: Record<string, number> = {};
  const dropOffs: Record<number, number> = {};

  for (const e of events) {
    if (e.type === "step_view" && typeof e.step === "number") stepViews[e.step] = (stepViews[e.step] ?? 0) + 1;
    if (e.type === "feature_toggle" && e.featureId) featureSelections[e.featureId] = (featureSelections[e.featureId] ?? 0) + 1;
    if (e.type === "extra_toggle" && e.extraId) extraSelections[e.extraId] = (extraSelections[e.extraId] ?? 0) + 1;
    if (e.type === "drop_off" && typeof e.step === "number") dropOffs[e.step] = (dropOffs[e.step] ?? 0) + 1;
  }

  return { stepViews, featureSelections, extraSelections, dropOffs };
}
