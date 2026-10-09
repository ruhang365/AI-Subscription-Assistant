import test from 'node:test';
import assert from 'node:assert/strict';
import { URL } from 'node:url';
import { buildTemplates, initialDetails, isClaudePlatform, resolveRoute, GUIDE_URL } from './refund.js';

const details = changes => ({ ...initialDetails(), ...changes });

test('Claude 名称被正确识别，其它平台不被误识别', () => {
  for (const name of ['Claude', 'CLAUDE CODE', 'Anthropic', '克劳德']) assert.equal(isClaudePlatform(name), true);
  for (const name of ['ChatGPT', 'Midjourney', 'Lovart', '', undefined]) assert.equal(isClaudePlatform(name), false);
});

test('不沿用旧表单默认零用量或付款渠道，只承接用户原始信息', () => {
  const value = initialDetails({ amount: '45 USD', date: '2026-05-08', usageStatus: 'zero', paymentMethod: 'credit_card', userStory: '账户登录失败' });
  assert.equal(value.amount, '45 USD');
  assert.equal(value.paymentDate, '2026-05-08');
  assert.equal(value.description, '账户登录失败');
  assert.equal(value.usageStatus, 'unknown');
  assert.equal(value.channel, 'unknown');
});

test('官网正常登录走退款资格检查，无法登录或受限走帮助中心', () => {
  assert.equal(resolveRoute(details({ channel: 'web', accountStatus: 'logged_in' })).id, 'web');
  for (const accountStatus of ['no_login', 'restricted', 'unknown']) {
    const route = resolveRoute(details({ channel: 'web', accountStatus }));
    assert.equal(route.id, 'no-login');
    assert.ok(route.steps.some(step => step.includes('can’t login')));
    assert.ok(!route.steps.some(step => step.includes('Settings')));
  }
});

test('Apple 无论能否登录 Claude 都走 Apple，取消订阅单独说明', () => {
  for (const accountStatus of ['logged_in', 'no_login', 'restricted']) {
    const route = resolveRoute(details({ channel: 'apple', accountStatus }));
    assert.equal(route.id, 'apple');
    assert.equal(route.links[0].url, 'https://reportaproblem.apple.com/');
    assert.match(route.summary, /单独取消/);
  }
});

test('Google Play 活跃和失效状态不同，但均由 Claude 支持核对', () => {
  const active = resolveRoute(details({ channel: 'google', subscriptionStatus: 'active' }));
  const inactive = resolveRoute(details({ channel: 'google', subscriptionStatus: 'inactive' }));
  assert.equal(active.id, 'google');
  assert.equal(inactive.id, 'google');
  assert.notEqual(active.summary, inactive.summary);
  assert.match(inactive.summary, /GPA/);
  assert.ok(active.steps.some(step => step.includes('GPA')));
});

test('API、额外用量、团队、代购和未知订单得到不同路径', () => {
  for (const [product, id] of [['api', 'api'], ['extra', 'extra'], ['team', 'team'], ['reseller', 'reseller'], ['unknown', 'lookup']]) {
    assert.equal(resolveRoute(details({ product, channel: 'web' })).id, id);
  }
  assert.match(resolveRoute(details({ product: 'api' })).summary, /不可退款/);
  assert.equal(resolveRoute(details({ channel: 'reseller' })).id, 'reseller');
  assert.equal(resolveRoute(details()).id, 'lookup');
});

test('矛盾的额度类型与应用商店渠道先核账，不套错误退款路径', () => {
  for (const product of ['api', 'extra', 'team']) {
    for (const channel of ['apple', 'google']) assert.equal(resolveRoute(details({ product, channel })).id, 'mismatch');
  }
});

test('缺失资料保留占位，不捏造用量和退款资格', () => {
  const input = details({ channel: 'web', accountStatus: 'no_login' });
  const draft = buildTemplates(input, resolveRoute(input));
  assert.match(draft.zh, /\[付款日期/);
  assert.match(draft.zh, /\[金额及币种/);
  assert.match(draft.en, /\[Describe your actual usage/);
  assert.ok(!draft.en.includes('have not used'));
  assert.ok(!draft.zh.includes('确认没有使用'));
  assert.ok(!draft.en.includes('full refund'));
  assert.match(draft.zh, /取消续费与本次退款请分别确认/);
});

test('文案随输入和实际使用状态更新，币种和用户原文原样保留', () => {
  const input = details({ channel: 'web', amount: '315 CNY', paymentDate: '2026-10-01', usageStatus: 'some', accountStatus: 'restricted', description: '屏幕显示账户受限' });
  const draft = buildTemplates(input, resolveRoute(input));
  assert.match(draft.zh, /315 CNY/);
  assert.match(draft.en, /2026-10-01/);
  assert.ok(!draft.en.includes('屏幕显示账户受限'));
  assert.equal(draft.separateDescription, '屏幕显示账户受限');
  assert.match(draft.zh, /屏幕显示账户受限/);
  assert.match(draft.en, /have used some/);
  assert.ok(!draft.en.includes('not used'));
  const changed = { ...input, amount: '45 USD', usageStatus: 'zero' };
  const next = buildTemplates(changed, resolveRoute(changed));
  assert.ok(!next.zh.includes('315 CNY'));
  assert.match(next.en, /have not used/);
});

test('切换收款方时文案收件对象和诉求跟随渠道变化', () => {
  const input = details({ channel: 'apple' });
  assert.match(buildTemplates(input, resolveRoute(input)).en, /Hi Apple Support/);
  const api = details({ product: 'api', channel: 'web' });
  assert.match(buildTemplates(api, resolveRoute(api)).en, /human billing support/);
  const unknown = details();
  assert.match(buildTemplates(unknown, resolveRoute(unknown)).en, /identify the product/);
  assert.match(buildTemplates(details({ channel: 'web' }), resolveRoute(details({ channel: 'web' })), 'billing').zh, /计费周期/);
  assert.match(buildTemplates(api, resolveRoute(api), 'billing').zh, /购买额度/);
});

test('英文使用已选事实，中文自由说明单独保存，不做猜测式翻译', () => {
  const input = details({ channel: 'web', accountStatus: 'no_login', description: '客服说没有账单，我需要人工核对' });
  const draft = buildTemplates(input, resolveRoute(input));
  assert.match(draft.en, /cannot currently log in/);
  assert.match(draft.en, /review the refund eligibility/);
  assert.ok(!/[\u3400-\u9fff]/u.test(draft.en));
  assert.equal(draft.separateDescription, input.description);
  assert.match(draft.zh, /客服说没有账单/);
  const english = { ...input, description: 'The receipt is missing from my account.' };
  assert.match(buildTemplates(english, resolveRoute(english)).en, /The receipt is missing/);
  assert.equal(buildTemplates(english, resolveRoute(english)).separateDescription, '');
});

test('Apple 文案用于客服咨询，不套用 Claude 会话流程或默认登录询问', () => {
  const input = details({ channel: 'apple', description: '订单无法使用' });
  const draft = buildTemplates(input, resolveRoute(input));
  assert.match(draft.en, /Hi Apple Support/);
  assert.match(draft.en, /appropriate Apple refund process/);
  assert.ok(!draft.en.includes('keep this conversation'));
  assert.ok(!draft.en.includes('Describe whether you can log in'));
  assert.match(draft.zh, /用于向 Apple 支持/);
});

test('所有正常选项均有完整步骤，分享地址不包含个人信息', () => {
  for (const product of ['individual', 'extra', 'api', 'team', 'reseller', 'unknown']) {
    for (const channel of ['unknown', 'web', 'apple', 'google', 'reseller']) {
      const input = details({ product, channel });
      const route = resolveRoute(input);
      assert.ok(route.steps.length >= 3);
      assert.ok(route.title && route.summary && route.materials.length);
      assert.ok(buildTemplates(input, route).en);
    }
  }
  const url = new URL(GUIDE_URL);
  assert.equal(url.search, '');
  assert.equal(url.hash, '');
});
