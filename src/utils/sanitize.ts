/**
 * Basic sanitization for user/content supplied text destined for <head> elements.
 * Strategy:
 *  - Trim
 *  - Collapse internal whitespace
 *  - Strip any HTML tags (coarse regex) to avoid injecting markup
 *  - Limit length to a safe upper bound (default ~300 chars for meta fields)
 */
export function sanitizeHeadText(input: unknown, max = 300): string | undefined {
  if (typeof input !== 'string') {
    return undefined;
  }
  let value = input.trim();
  if (!value) {
    return undefined;
  }
  // Remove HTML tags
  // Remove script/style blocks entirely first
  value = value.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  value = value.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  value = value.replace(/<[^>]*>/g, '');
  // Collapse whitespace
  value = value.replace(/\s+/g, ' ');
  if (value.length > max) {
    value = `${value.slice(0, max - 1).trimEnd()}…`;
  }
  return value;
}

/** Escape for element text (title tag). We already stripped tags; just ensure angle brackets & ampersands are encoded */
export function escapeForHtmlText(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape for attribute values */
export function escapeForAttr(value: string | undefined): string | undefined {
  if (!value) {
    return value;
  }
  return escapeForHtmlText(value)?.replace(/"/g, '&quot;');
}
