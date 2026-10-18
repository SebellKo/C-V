import tokens from '../styles/tokens.css?inline';

let currentToast: HTMLElement | undefined;
let dismissTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(
  title: string,
  detail: string,
  tone: 'success' | 'error' = 'success',
): void {
  const duration = tone === 'error' ? 5000 : 1500;
  currentToast?.remove();
  clearTimeout(dismissTimer);
  const host = document.createElement('cv-toast');
  host.style.cssText =
    'all:initial!important;position:fixed!important;bottom:16px!important;left:50%!important;transform:translateX(-50%)!important;width:min(360px,calc(100% - 32px))!important;z-index:2147483647!important;pointer-events:none!important;';
  const shadow = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent =
    tokens.replaceAll(':root', ':host') +
    `
    .toast { display:flex; align-items:center; gap:10px; min-height:56px; box-sizing:border-box;
      padding:10px 12px; border:1px solid var(--border); border-radius:var(--radius-lg);
      background:var(--popover); color:var(--foreground); box-shadow:var(--shadow-popover); font-family:var(--font-sans);
      animation:cv-toast-visibility ${duration}ms ease-out both; }
    .icon { box-sizing:border-box; width:32px; height:32px; padding:8px; border-radius:var(--radius-full);
      background:var(--accent); color:var(--primary); flex-shrink:0; }
    .error { align-items:flex-start; }
    .error strong, .error p { overflow:visible; text-overflow:clip; white-space:normal; overflow-wrap:anywhere; }
    .error .icon { background:var(--destructive-muted); color:var(--destructive); }
    .text { min-width:0; }
    strong,p { display:block; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    strong { font-size:var(--text-label-size); line-height:var(--text-label-line-height); font-weight:var(--font-weight-semibold); }
    p { color:var(--muted-foreground); font-size:var(--text-caption-size); line-height:var(--text-caption-line-height); }
    .toast:not(.error) strong { color:var(--muted-foreground); font-size:var(--text-caption-size);
      line-height:var(--text-caption-line-height); font-weight:var(--font-weight-regular); }
    .toast:not(.error) p { margin-top:2px; color:var(--foreground); font-size:var(--text-label-size);
      line-height:var(--text-label-line-height); }
    @keyframes cv-toast-visibility {
      0% { opacity:0; transform:translateY(4px); }
      ${(200 / duration) * 100}%, ${((duration - 250) / duration) * 100}% { opacity:1; transform:translateY(0); }
      100% { opacity:0; transform:translateY(4px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast { animation:none; }
    }
  `;
  const toast = document.createElement('div');
  toast.className = tone === 'error' ? 'toast error' : 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '20');
  icon.setAttribute('height', '20');
  icon.setAttribute('class', 'icon');
  icon.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    tone === 'error' ? 'M6 6l12 12M6 18 18 6' : 'M20 6 9 17l-5-5',
  );
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  icon.append(path);
  const text = document.createElement('div');
  text.className = 'text';
  const heading = document.createElement('strong');
  const description = document.createElement('p');
  text.append(heading, description);
  toast.append(icon, text);
  shadow.append(style, toast);
  document.documentElement.append(host);
  currentToast = host;
  requestAnimationFrame(() => {
    heading.textContent = title;
    description.textContent = detail;
  });
  dismissTimer = setTimeout(() => {
    host.remove();
    if (currentToast === host) currentToast = undefined;
  }, duration);
}
