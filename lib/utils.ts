/**
 * Combines CSS class names into a single clean string.
 */
export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ");
}
