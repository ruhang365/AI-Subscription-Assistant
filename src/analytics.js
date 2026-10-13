import { inject } from '@vercel/analytics';

export function sanitizePageView(event) {
  if (event?.type !== 'pageview') return null;
  try {
    const url = new URL(event.url);
    if (url.origin !== 'https://sub.ruhang365.cn' ||
        !['/', '/claude-code-refund/'].includes(url.pathname)) return null;
    // Only public page paths enter analytics, never query strings, anchors or form data.
    return { type: 'pageview', url: `${url.origin}${url.pathname}` };
  } catch {
    return null;
  }
}

export function startAnalytics() {
  if (window.location.origin !== 'https://sub.ruhang365.cn') return;
  inject({ mode: 'production', beforeSend: sanitizePageView });
}
