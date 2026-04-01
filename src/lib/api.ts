const API_URL = "https://functions.poehali.dev/0ceddf8a-4fa3-4308-b897-00ea2b194174";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getStats: () => apiFetch("/stats"),
  getGoals: () => apiFetch("/goals"),
  getGoal: (id: number) => apiFetch(`/goals/${id}`),
  getProjects: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/projects${qs}`);
  },
  getProject: (id: number) => apiFetch(`/projects/${id}`),
  getForumTopics: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`/forum/topics${qs}`);
  },
  getForumTopic: (id: number) => apiFetch(`/forum/topics/${id}`),
  createForumTopic: (data: object) =>
    apiFetch("/forum/topics", { method: "POST", body: JSON.stringify(data) }),
  replyToTopic: (topicId: number, data: object) =>
    apiFetch(`/forum/topics/${topicId}/replies`, { method: "POST", body: JSON.stringify(data) }),
  likeForumTopic: (id: number) =>
    apiFetch(`/forum/topics/${id}/like`, { method: "POST", body: JSON.stringify({}) }),
  submitCalculator: (data: object) =>
    apiFetch("/calculator", { method: "POST", body: JSON.stringify(data) }),
};
