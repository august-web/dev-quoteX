export function isDevAuthenticated(): boolean {
  try {
    return localStorage.getItem("iwq_dev_authenticated") === "true";
  } catch {
    return false;
  }
}

export function loginDev(email: string) {
  try {
    localStorage.setItem("iwq_dev_email", email);
    localStorage.setItem("iwq_dev_authenticated", "true");
  } catch { void 0; }
}

export function logoutDev() {
  try {
    localStorage.removeItem("iwq_dev_authenticated");
  } catch { void 0; }
}
