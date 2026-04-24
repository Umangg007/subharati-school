/**
 * Centralised input validators for all backend controllers.
 * All functions are pure and return boolean unless noted.
 */

// ─── String helpers ──────────────────────────────────────────────────────────

const isNonEmptyString = (value, maxLen = 200) => {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLen;
};

const sanitizeText = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // control chars
    .replace(/[<>]/g, "")                                       // basic XSS strip
    .trim();
};

const normalizeString = (value) => sanitizeText(value);

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

// ─── Email ────────────────────────────────────────────────────────────────────

const isEmail = (value) => {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());
};

// ─── Phone ────────────────────────────────────────────────────────────────────

/** Optional phone — empty string is allowed */
const isPhone = (value) => {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string") return false;
  return /^[+()0-9\s-]{7,20}$/.test(value.trim());
};

/** Required phone — must be present and valid */
const isRequiredPhone = (value) => {
  if (typeof value !== "string") return false;
  const phone = value.trim();
  if (!phone) return false;
  return /^[+()0-9\s-]{7,20}$/.test(phone);
};

// ─── Password ────────────────────────────────────────────────────────────────

const isStrongPassword = (value) => {
  if (typeof value !== "string") return false;
  if (value.length < 8 || value.length > 128) return false;
  return /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
};

// ─── URL / Image ─────────────────────────────────────────────────────────────

const isPublicImageUrl = (value) => {
  if (typeof value !== "string") return false;
  const url = value.trim();
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/uploads/")
  );
};

// ─── Date ─────────────────────────────────────────────────────────────────────

/** Returns true if value is a valid parseable date string / number */
const isValidDate = (value) => {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
};

// ─── Enum helpers ─────────────────────────────────────────────────────────────

/** Returns true if value is one of the allowed string options */
const isAllowedValue = (value, allowedList) => {
  if (typeof value !== "string") return false;
  return allowedList.includes(value.trim());
};

// ─── Mongo ObjectId ──────────────────────────────────────────────────────────

const isMongoId = (value) => {
  if (typeof value !== "string") return false;
  return /^[a-f\d]{24}$/i.test(value);
};

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = {
  isNonEmptyString,
  sanitizeText,
  normalizeString,
  normalizeEmail,
  isEmail,
  isPhone,
  isRequiredPhone,
  isStrongPassword,
  isPublicImageUrl,
  isValidDate,
  isAllowedValue,
  isMongoId
};
