import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizePageView } from './analytics.js';

test('analytics keeps public page identity and strips all user-supplied fields', () => {
  for (const path of ['/', '/claude-code-refund/']) {
    const url = `https://sub.ruhang365.cn${path}`;
    assert.deepEqual(sanitizePageView({ type: 'pageview', url: `${url}?email=test@example.test&order=private&utm_source=test#draft`, description: 'private draft' }), { type: 'pageview', url });
  }
});

test('analytics ignores unknown paths, preview/local hosts, custom events and malformed input', () => {
  for (const url of ['https://sub.ruhang365.cn/order/private', 'http://127.0.0.1:4174/', 'https://preview.vercel.app/', 'https://sub.ruhang365.cn.evil.test/', 'not a url']) {
    assert.equal(sanitizePageView({ type: 'pageview', url }), null);
  }
  assert.equal(sanitizePageView({ type: 'event', url: 'https://sub.ruhang365.cn/' }), null);
  assert.equal(sanitizePageView(null), null);
});
