import toastStyles from './toast.css?inline';

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
  const shadow = host.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = toastStyles.replaceAll(':root', ':host');
  const toast = document.createElement('div');
  toast.style.setProperty('--toast-duration', `${duration}ms`);
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
