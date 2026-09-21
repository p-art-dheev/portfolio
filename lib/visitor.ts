const STORAGE_KEY = "pardheev-visitor-id";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isVisitorId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function getVisitorId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing && UUID_RE.test(existing)) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
