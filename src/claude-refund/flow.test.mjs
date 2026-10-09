import test from 'node:test';
import assert from 'node:assert/strict';
import { caseAnswers, chooseAnswer, emptyAnswers, firstUnanswered, questionsFor, routeDetails } from './flow.js';
import { initialDetails, resolveRoute } from './refund.js';

const keys = answers => questionsFor(answers).map(question => question.key);

test('Apple、代购和不明付款不询问无关登录情况', () => {
  for (const channel of ['apple', 'reseller', 'unknown']) {
    const answers = chooseAnswer(emptyAnswers(), 'channel', channel);
    assert.deepEqual(keys(answers), ['channel']);
    assert.equal(firstUnanswered(answers), -1);
    assert.equal(resolveRoute(routeDetails(initialDetails(), answers)).id, { apple: 'apple', reseller: 'reseller', unknown: 'lookup' }[channel]);
  }
});

test('官网按商品补问登录，团队和商品不明不进入个人退款流程', () => {
  for (const product of ['individual', 'extra', 'api', 'team', 'unknown']) {
    const answers = { ...emptyAnswers(), channel: 'web', product };
    assert.deepEqual(keys(answers), ['individual', 'extra', 'api'].includes(product) ? ['channel', 'product', 'accountStatus'] : ['channel', 'product']);
    assert.equal(resolveRoute(routeDetails(initialDetails(), answers)).id, { individual: 'no-login', extra: 'extra', api: 'api', team: 'team', unknown: 'lookup' }[product]);
  }
});

test('Google Play 问登录与订阅状态，账单按个人订单核对', () => {
  const answers = caseAnswers({ channel: 'google' });
  assert.deepEqual(keys(answers), ['channel', 'accountStatus', 'subscriptionStatus']);
  assert.equal(firstUnanswered(answers), 1);
  const input = routeDetails(initialDetails(), { ...answers, accountStatus: 'no_login', subscriptionStatus: 'inactive' });
  assert.equal(input.product, 'individual');
  assert.match(resolveRoute(input).summary, /订阅已经失效/);
});

test('更换付款渠道清除旧条件，更换商品清除旧登录答案', () => {
  const answers = caseAnswers({ channel: 'web', product: 'api', accountStatus: 'logged_in' });
  assert.deepEqual(chooseAnswer(answers, 'channel', 'apple'), { ...emptyAnswers(), channel: 'apple' });
  assert.equal(chooseAnswer(answers, 'product', 'team').accountStatus, null);
  assert.equal(chooseAnswer(answers, 'product', 'api'), answers);
});

test('案例只带入适用条件，个人账单信息保留用户事实', () => {
  const answers = caseAnswers({ channel: 'web', product: 'extra', amount: '45 USD', paymentDate: '2026-05-08', usageStatus: 'zero', description: '案例叙述' });
  assert.equal(firstUnanswered(answers), 2);
  assert.equal(answers.amount, undefined);
  const actual = initialDetails({ amount: '19 EUR', userStory: '用户自己的情况' });
  const input = routeDetails(actual, answers);
  assert.equal(input.amount, '19 EUR');
  assert.equal(input.paymentDate, '');
  assert.equal(input.usageStatus, 'unknown');
  assert.equal(input.description, '用户自己的情况');
});

test('没有登录提问的渠道仍可使用用户自行补充的账户状态', () => {
  const answers = caseAnswers({ channel: 'apple' });
  assert.equal(routeDetails({ ...initialDetails(), accountStatus: 'restricted' }, answers).accountStatus, 'restricted');
});
