// Tiny ML layer — no external models. Two purposes:
// 1) embed(topics) → fixed-size vector for similarity-based recommendations
// 2) autoTag(text) → keyword extraction over an engineering vocabulary
// This is intentionally deterministic + dependency-free so it runs on Fluid Compute
// with cold-start ~0ms. Swap in @vercel/ai-gateway later for true LLM tagging.

import type { Course, Video, ViewEvent } from "./types";

const VOCAB = [
  "force","moment","equilibrium","truss","frame","centroid","friction",
  "kinematics","kinetics","energy","momentum","harmonic","vibration",
  "stress","strain","beam","torsion","buckling","mohr",
  "first-law","second-law","entropy","carnot","rankine","otto",
  "hydrostatic","bernoulli","viscous","pipe-flow",
  "conduction","convection","radiation","heat-exchanger",
  "indeterminate","slope-deflection","beam-design","column","footing","shear","aci",
  "classification","seepage","consolidation","shear-strength","slope",
  "kvl","kcl","thevenin","norton","phasor","transient",
  "maxwell","wave","transmission-line","antenna",
  "fourier","laplace","z-transform","lti","sampling",
  "lp","simplex","transportation","queueing","simulation",
  "forecast","mrp","inventory","six-sigma","spc",
  "orthographic","isometric","gdt","autocad","solidworks",
  "design-thinking","requirement","concept","fmea","prototype",
  "ode","pde","linear-algebra","complex","numerical",
  "transfer-function","root-locus","bode","pid","state-space",
];

const DIM = VOCAB.length;
const idx = new Map(VOCAB.map((t, i) => [t, i] as const));

export function embed(tokens: string[]): number[] {
  const v = new Array<number>(DIM).fill(0);
  for (const t of tokens) {
    const i = idx.get(t.toLowerCase());
    if (i !== undefined) v[i] = 1;
  }
  // normalize for cosine similarity
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

export function cosine(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

const KEYWORDS: Record<string, string[]> = {
  statics: ["truss", "force", "equilibrium"],
  dynamics: ["kinematics", "vibration", "harmonic"],
  thermo: ["entropy", "carnot", "second-law"],
  fluid: ["bernoulli", "pipe-flow", "viscous"],
  beam: ["beam", "stress", "shear"],
  circuit: ["kvl", "kcl", "phasor"],
  control: ["pid", "bode", "root-locus"],
  cad: ["autocad", "solidworks", "gdt"],
};

export function autoTag(text: string): string[] {
  const lo = text.toLowerCase();
  const tags = new Set<string>();
  for (const [topic, keys] of Object.entries(KEYWORDS)) {
    if (lo.includes(topic) || keys.some((k) => lo.includes(k))) {
      tags.add(topic);
      keys.filter((k) => lo.includes(k)).forEach((k) => tags.add(k));
    }
  }
  // also pull any vocab term that appears literally
  for (const t of VOCAB) if (lo.includes(t)) tags.add(t);
  return [...tags].slice(0, 8);
}

// Recommend courses: weighted average of (a) user view history, (b) recent global
// trends. Falls back to top-rated when cold.
export function recommend(
  courses: Course[],
  userViews: ViewEvent[],
  videos: Video[],
  k = 4
): Course[] {
  if (!courses.length) return [];
  if (userViews.length === 0) {
    return [...courses]
      .sort((a, b) => b.rating * b.enrolled - a.rating * a.enrolled)
      .slice(0, k);
  }
  // build user profile vector from viewed courses' embeddings
  const viewedCourseIds = new Set<string>();
  for (const v of userViews) {
    if (v.courseId) viewedCourseIds.add(v.courseId);
    if (v.videoId) {
      const vid = videos.find((x) => x.id === v.videoId);
      if (vid) viewedCourseIds.add(vid.courseId);
    }
  }
  const dim = courses[0].embedding?.length ?? 0;
  const profile = new Array<number>(dim).fill(0);
  for (const cid of viewedCourseIds) {
    const c = courses.find((x) => x.id === cid);
    if (c?.embedding) c.embedding.forEach((x, i) => (profile[i] += x));
  }
  const norm = Math.sqrt(profile.reduce((s, x) => s + x * x, 0)) || 1;
  for (let i = 0; i < dim; i++) profile[i] /= norm;
  return [...courses]
    .filter((c) => !viewedCourseIds.has(c.id))
    .map((c) => ({ c, score: cosine(profile, c.embedding ?? []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.c);
}
