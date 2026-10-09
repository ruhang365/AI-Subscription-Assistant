import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { PERSONAL_EMAIL_EXAMPLES, PERSONAL_EMAIL_INTRO } from './personalEmails.js';
import { REFUND_CASES } from './cases.js';

test('公开邮件节选不泄露邮箱、订单标识、私链或原始邮件数据', () => {
  const publicText = JSON.stringify(PERSONAL_EMAIL_EXAMPLES);
  assert.ok(!/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(publicText));
  assert.ok(!/https?:\/\/|\b\d{12,}\b|\b[A-Z0-9]{6,}-\d+\b|\b\d{4}-\d{4}-\d{4}\b/.test(publicText));
  for (const email of PERSONAL_EMAIL_EXAMPLES) {
    assert.deepEqual(Object.keys(email).sort(), ['id', 'date', 'sender', 'title', 'excerpt', 'explanation'].sort());
  }
  assert.equal(PERSONAL_EMAIL_EXAMPLES.filter(email => email.sender === '我发给官方').length, 3);
  assert.equal(PERSONAL_EMAIL_EXAMPLES.filter(email => email.sender.startsWith('官方回复')).length, 2);
});

test('静态阅读与真实案例保留相同节选、来源边界和未核实到账说明', async () => {
  const html = await readFile(new URL('../../claude-code-refund/index.html', import.meta.url), 'utf8');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  assert.ok(html.includes('id="personal-email-examples"'));
  assert.ok(html.includes(escape(PERSONAL_EMAIL_INTRO)));
  for (const email of PERSONAL_EMAIL_EXAMPLES) {
    assert.ok(html.includes(escape(email.excerpt)), `静态页缺少原文：${email.id}`);
    assert.ok(html.includes(escape(email.explanation)), `静态页说明未同步：${email.id}`);
  }
  const personal = REFUND_CASES.find(item => item.id === 'personal');
  assert.equal(personal.emails, PERSONAL_EMAIL_EXAMPLES);
  assert.deepEqual(personal.conditions, { channel: 'web', product: 'extra' });
  assert.match(PERSONAL_EMAIL_EXAMPLES.at(-1).explanation, /银行实际到账仍未核实/);
});
