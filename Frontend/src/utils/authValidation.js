export function isEmailFormat(value) {
  const v = (value || "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function meetsStrongPassword(value) {
  const v = value || "";
  if (v.length < 8) return false;
  if (!/[A-Z]/.test(v)) return false;
  if (!/[a-z]/.test(v)) return false;
  if (!/\d/.test(v)) return false;
  if (!/[^A-Za-z0-9]/.test(v)) return false;
  return true;
}

export function registerFormReady(fields) {
  const nameOk = !!(fields?.name || "").trim();
  const emailOk = isEmailFormat(fields?.email);
  const pwdOk = meetsStrongPassword(fields?.password);
  return nameOk && emailOk && pwdOk;
}

export function loginFormReady(fields) {
  const emailOk = isEmailFormat(fields?.email);
  const pwdOk = meetsStrongPassword(fields?.password);
  return emailOk && pwdOk;
}
