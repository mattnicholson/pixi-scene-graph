export function If({ cond, children }) {
  if (cond) {
    return children;
  }
  return null;
}
