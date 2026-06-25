export function showToast(msg) {
  if (window.__showToast) {
    window.__showToast(msg);
  }
}
