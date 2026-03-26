const safeString = (v, maxLen = 280) => {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > maxLen ? `${s.slice(0, maxLen - 3).trim()}...` : s;
};

const safeArray = (v) => (Array.isArray(v) ? v : []);

const safeStringArray = (v, maxItems = 12, maxLen = 140) => {
  const items = safeArray(v)
    .map((x) => safeString(x, maxLen))
    .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out.slice(0, maxItems);
};

const normalizeResourceType = (t) => {
  const type = safeString(t, 20).toLowerCase();
  const allowed = new Set(["course", "article", "book", "video", "project", "tool", "other"]);
  return allowed.has(type) ? type : "other";
};

export const normalizeRoadmap = (raw) => {
  const src = raw && typeof raw === "object" ? raw : {};

  const phasesRaw = safeArray(src.phases);
  const phases = phasesRaw
    .map((p, idx) => {
      const ph = p && typeof p === "object" ? p : {};
      const title = safeString(ph.title, 90);
      const duration = safeString(ph.duration, 40);
      const objective = safeString(ph.objective, 240);
      const topics = safeStringArray(ph.topics, 10, 90);
      const tools = safeStringArray(ph.tools, 8, 60);
      const projects = safeStringArray(ph.projects, 8, 120);
      const outcome = safeString(ph.outcome, 220);

      const hasContent =
        title || duration || objective || topics.length > 0 || projects.length > 0 || outcome;
      if (!hasContent) return null;

      return {
        id: idx + 1,
        title,
        duration,
        objective,
        topics,
        tools,
        projects,
        outcome
      };
    })
    .filter(Boolean);

  const resourcesRaw = safeArray(src.resources);
  const resources = resourcesRaw
    .map((r) => {
      const rr = r && typeof r === "object" ? r : {};
      const title = safeString(rr.title, 140);
      if (!title) return null;
      const url = safeString(rr.url, 300);
      return { type: normalizeResourceType(rr.type), title, ...(url ? { url } : {}) };
    })
    .filter(Boolean)
    .slice(0, 10);

  return {
    title: safeString(src.title, 80),
    goal: safeString(src.goal, 160),
    level: safeString(src.level, 24),
    estimated_duration: safeString(src.estimated_duration, 40),
    learning_time_per_week: safeString(src.learning_time_per_week, 40),
    target_outcome: safeString(src.target_outcome, 80),
    learning_style: safeString(src.learning_style, 80),
    prerequisites: safeStringArray(src.prerequisites, 8, 120),
    summary: safeString(src.summary, 520),
    phases,
    resources,
    capstone_project: {
      title: safeString(src.capstone_project?.title, 120),
      description: safeString(src.capstone_project?.description, 420)
    },
    job_readiness: safeStringArray(src.job_readiness, 10, 160)
  };
};





