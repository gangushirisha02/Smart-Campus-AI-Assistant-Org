// Shared localStorage-based store for tracking campus activity

const KEYS = {
  activityLog: "campus_activity_log",
  uploadedFiles: "campus_uploaded_files",
  queryCount: "campus_query_count",
} as const;

export interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  role: "admin" | "student";
  time: string; // ISO string
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number; // bytes
  type: string; // mime
  uploadedAt: string; // ISO
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("campus-store-update"));
}

// ---- Activity Log ----
export function getActivityLog(): ActivityEntry[] {
  return read<ActivityEntry[]>(KEYS.activityLog, []);
}

export function logActivity(action: string, user: string, role: "admin" | "student") {
  const log = getActivityLog();
  log.unshift({ id: crypto.randomUUID(), action, user, role, time: new Date().toISOString() });
  if (log.length > 100) log.length = 100;
  write(KEYS.activityLog, log);
}

// ---- Uploaded Files ----
export function getUploadedFiles(): UploadedFile[] {
  return read<UploadedFile[]>(KEYS.uploadedFiles, []);
}

export function addUploadedFile(file: UploadedFile) {
  const files = getUploadedFiles();
  files.unshift(file);
  write(KEYS.uploadedFiles, files);
}

export function removeUploadedFile(id: string) {
  const files = getUploadedFiles().filter((f) => f.id !== id);
  write(KEYS.uploadedFiles, files);
}

// ---- Query Count ----
export function getQueryCount(): number {
  return read<number>(KEYS.queryCount, 0);
}

export function incrementQueryCount() {
  write(KEYS.queryCount, getQueryCount() + 1);
}

// ---- Derived counts ----
export function getSignupCount(role?: "admin" | "student"): number {
  const stored = localStorage.getItem("campus_users");
  if (!stored) return 0;
  const users: Record<string, { password: string; user: { role: string } }> = JSON.parse(stored);
  const defaultEmails = ["admin@campus.edu", "student@campus.edu"];
  return Object.entries(users).filter(
    ([email, entry]) => !defaultEmails.includes(email) && (!role || entry.user.role === role)
  ).length;
}

export function getStudentLoginCount(): number {
  return getActivityLog().filter((a) => a.action === "Login" && a.role === "student").length;
}

export function getActiveUserCount(): number {
  // Count all signups (students + admins)
  return getSignupCount("student") + getSignupCount("admin");
}
