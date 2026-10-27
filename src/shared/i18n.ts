import type messages from '../../public/_locales/en/messages.json';

export function t(
  key: keyof typeof messages,
  substitutions?: string | string[],
): string {
  return chrome.i18n.getMessage(key, substitutions);
}
