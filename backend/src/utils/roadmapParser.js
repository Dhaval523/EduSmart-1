/**
 * Roadmap parsing + normalization utilities.
 * Kept framework-agnostic so both controllers and tests can reuse it.
 *
 * We intentionally store the roadmap in Mongo as `Mixed` and enforce shape here.
 */

/**
 * @typedef {"Beginner" | "Intermediate" | "Advanced"} SkillLevel
 *
 * @typedef {Object} RoadmapFormInput
 * @property {string} goal
 * @property {SkillLevel} level
 * @property {string[]=} preferredTopics
 * @property {string=} learningTimePerWeek
 * @property {string=} targetOutcome
 * @property {string=} learningStyle
 *
 * @typedef {Object} LearningPhase
 * @property {number} id
 * @property {string} title
 * @property {string} duration
 * @property {string} objective
 * @property {string[]} topics
 * @property {string[]} tools
 * @property {string[]} projects
 * @property {string} outcome
 *
 * @typedef {Object} LearningResource
 * @property {"course"|"article"|"book"|"video"|"project"|"tool"|"other"} type
 * @property {string} title
 * @property {string=} url
 *
 * @typedef {Object} CapstoneProject
 * @property {string} title
 * @property {string} description
 *
 * @typedef {Object} LearningRoadmap
 * @property {string} title
 * @property {string} goal
 * @property {SkillLevel|string} level
 * @property {string} estimated_duration
 * @property {string} learning_time_per_week
 * @property {string} target_outcome
 * @property {string} learning_style
 * @property {string[]} prerequisites
 * @property {string} summary
 * @property {LearningPhase[]} phases
 * @property {LearningResource[]} resources
 * @property {CapstoneProject} capstone_project
 * @property {string[]} job_readiness
 */

const MAX_TEXT = 240;
const MAX_SUMMARY = 420;

const safeString = (value, maxLen = MAX_TEXT) => {
  if (value === null || value === undefined) return "";
  const str = String(value).replace(/\s+/g, " ").trim();
  if (!str) return "";
  return str.length > maxLen ? `${str.slice(0, maxLen - 1).trim()}…` : str;
};

const safeStringArray = (value, maxItems = 12, maxLen = 120) => {
  const arr = Array.isArray(value) ? value : [];
  const cleaned = arr
    .map((v) => safeString(v, maxLen))
    .filter(Boolean);
  // Deduplicate while preserving order
  const seen = new Set();
  const deduped = [];
  for (const item of cleaned) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }
  return deduped.slice(0, maxItems);
};

const ensureResourceType = (value) => {
  const t = safeString(value, 30).toLowerCase();
  const allowed = new Set(["course", "article", "book", "video", "project", "tool", "other"]);
  return allowed.has(t) ? t : "other";
};

const cleanupModelText = (raw) => {
  if (!raw || typeof raw !== "string") return "";

  let text = raw.trim();
  // remove code fences
  text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "");
  // normalize smart quotes
  text = text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u0000/g, "");
  return text.trim();
};

const extractFirstJsonObject = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return "";
  return text.slice(start, end + 1);
};

/**
 * Attempts to parse model output to JSON.
 * 1) direct parse
 * 2) cleanup code fences + extract first {...}
 * 3) last resort: replace trailing commas and retry
 *
 * @param {string} raw
 * @returns {{ ok: true, data: any } | { ok: false, error: string, cleanedText: string }}
 */
export const parseRoadmapResponse = (raw) => {
  const cleaned = cleanupModelText(raw);
  if (!cleaned) return { ok: false, error: "Empty model output", cleanedText: "" };

  const attempts = [];
  attempts.push(cleaned);
  const extracted = extractFirstJsonObject(cleaned);
  if (extracted && extracted !== cleaned) attempts.push(extracted);
  if (extracted) {
    attempts.push(
      extracted
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
    );
  }

  for (const candidate of attempts) {
    try {
      // Some models sneak BOM or weird whitespace; trim again.
      const parsed = JSON.parse(candidate.trim());
      return { ok: true, data: parsed };
    } catch {
      // continue
    }
  }

  return { ok: false, error: "Invalid JSON from model", cleanedText: cleaned };
};

/**
 * Coerces any value into a stable LearningRoadmap object.
 * Never throws.
 *
 * @param {any} raw
 * @param {RoadmapFormInput=} input
 * @returns {LearningRoadmap}
 */
export const normalizeRoadmapResponse = (raw, input) => {
  /** @type {LearningRoadmap} */
  const base = {
    title: "",
    goal: "",
    level: "",
    estimated_duration: "",
    learning_time_per_week: "",
    target_outcome: "",
    learning_style: "",
    prerequisites: [],
    summary: "",
    phases: [],
    resources: [],
    capstone_project: { title: "", description: "" },
    job_readiness: []
  };

  const src = raw && typeof raw === "object" ? raw : {};

  base.title = safeString(src.title || (input?.goal ? `${input.goal} Learning Path` : ""), 80);
  base.goal = safeString(src.goal || input?.goal || "", 120);
  base.level = safeString(src.level || input?.level || "", 24);
  base.estimated_duration = safeString(src.estimated_duration || "", 40);
  base.learning_time_per_week = safeString(
    src.learning_time_per_week || input?.learningTimePerWeek || "",
    40
  );
  base.target_outcome = safeString(src.target_outcome || input?.targetOutcome || "", 60);
  base.learning_style = safeString(src.learning_style || input?.learningStyle || "", 60);
  base.prerequisites = safeStringArray(src.prerequisites, 8, 110);
  base.summary = safeString(src.summary || "", MAX_SUMMARY);

  // phases
  const rawPhases = Array.isArray(src.phases) ? src.phases : [];
  const normalizedPhases = rawPhases
    .map((p, idx) => {
      const phase = p && typeof p === "object" ? p : {};
      /** @type {LearningPhase} */
      const out = {
        id: Number.isFinite(Number(phase.id)) ? Number(phase.id) : idx + 1,
        title: safeString(phase.title || "", 90),
        duration: safeString(phase.duration || "", 40),
        objective: safeString(phase.objective || "", 220),
        topics: safeStringArray(phase.topics, 10, 90),
        tools: safeStringArray(phase.tools, 8, 60),
        projects: safeStringArray(phase.projects, 8, 120),
        outcome: safeString(phase.outcome || "", 200)
      };
      // Avoid empty phases
      const hasContent =
        out.title || out.duration || out.objective || out.topics.length || out.projects.length;
      return hasContent ? out : null;
    })
    .filter(Boolean);

  // Ensure sequential ids
  base.phases = normalizedPhases.map((p, i) => ({ ...p, id: i + 1 }));

  // resources
  const rawResources = Array.isArray(src.resources) ? src.resources : [];
  base.resources = rawResources
    .map((r) => {
      const res = r && typeof r === "object" ? r : {};
      const title = safeString(res.title || "", 120);
      if (!title) return null;
      return {
        type: ensureResourceType(res.type),
        title,
        url: safeString(res.url || "", 300) || ""
      };
    })
    .filter(Boolean)
    .slice(0, 10);

  const cap = src.capstone_project && typeof src.capstone_project === "object"
    ? src.capstone_project
    : {};
  base.capstone_project = {
    title: safeString(cap.title || "", 120),
    description: safeString(cap.description || "", 360)
  };

  base.job_readiness = safeStringArray(src.job_readiness, 10, 140);

  // Final safety defaults
  if (!Array.isArray(base.phases)) base.phases = [];
  if (!Array.isArray(base.prerequisites)) base.prerequisites = [];
  if (!Array.isArray(base.resources)) base.resources = [];
  if (!Array.isArray(base.job_readiness)) base.job_readiness = [];

  return base;
};

/**
 * A safe fallback roadmap when parsing fails.
 * @param {RoadmapFormInput} input
 * @param {string} reason
 * @returns {LearningRoadmap}
 */
export const buildFallbackRoadmap = (input, reason) => {
  const goal = safeString(input?.goal || "", 120);
  const level = safeString(input?.level || "", 24);
  const topics = safeStringArray(input?.preferredTopics || [], 6, 60);

  return normalizeRoadmapResponse(
    {
      title: goal ? `${goal} Learning Path` : "Learning Path",
      goal: goal ? `Become a job-ready ${goal}` : "Become job-ready",
      level,
      estimated_duration: "4-8 weeks",
      learning_time_per_week: safeString(input?.learningTimePerWeek || "6-8 hours", 40),
      target_outcome: safeString(input?.targetOutcome || "Job-ready", 60),
      learning_style: safeString(input?.learningStyle || "Project-based", 60),
      prerequisites: ["Basic computer skills", "Comfort using web applications"],
      summary: reason
        ? `We had trouble parsing the AI response (${safeString(reason, 120)}). Here is a safe starter roadmap you can regenerate.`
        : "A safe starter roadmap you can regenerate.",
      phases: [
        {
          id: 1,
          title: "Foundations",
          duration: "1-2 weeks",
          objective: "Build core fundamentals and set up your learning environment.",
          topics: topics.length ? topics : ["Core concepts", "Tooling setup", "Practice basics"],
          tools: [],
          projects: ["Create a simple notes repo and track progress"],
          outcome: "Ready to start structured learning with confidence."
        },
        {
          id: 2,
          title: "Applied Practice",
          duration: "2-4 weeks",
          objective: "Practice with small exercises and one guided mini-project.",
          topics: topics.length ? topics : ["Hands-on exercises", "Mini project"],
          tools: [],
          projects: ["Build a small portfolio-ready mini project"],
          outcome: "Have at least one concrete project artifact."
        }
      ],
      resources: [],
      capstone_project: {
        title: "Capstone Project",
        description: "Build a small end-to-end project aligned with your goal."
      },
      job_readiness: ["Create 1 portfolio project", "Practice consistently", "Document your work"]
    },
    input
  );
};

