// 两种入口共用付款与账户条件；案例只补条件，不补用户账单事实。
import { ACCOUNT_OPTIONS, PRODUCT_OPTIONS } from './refund.js';

export const QUESTIONS = {
  channel: { key: 'channel', title: '这笔钱在哪里付的？', options: [
    ['web', 'Claude 官网'], ['apple', 'Apple App Store'], ['google', 'Google Play'],
    ['reseller', '代购 / 第三方'], ['unknown', '不清楚，帮我找'],
  ] },
  product: { key: 'product', title: '这笔钱买的是什么？', options: PRODUCT_OPTIONS.filter(([id]) => id !== 'reseller').map(([id, label]) => [id, id === 'individual' ? 'Pro / Max 按月或按年订阅' : label]) },
  accountStatus: { key: 'accountStatus', title: '现在能登录 Claude 吗？', options: ACCOUNT_OPTIONS.map(([id, label]) => [id, id === 'unknown' ? '不清楚 / 还没试过' : label]) },
  subscriptionStatus: { key: 'subscriptionStatus', title: 'Google Play 订阅还有效吗？', options: [
    ['active', '仍然有效'], ['inactive', '已经失效'], ['unknown', '不清楚'],
  ] },
};

export const emptyAnswers = () => ({ channel: null, product: null, accountStatus: null, subscriptionStatus: null });

export function questionsFor(answers) {
  const questions = [QUESTIONS.channel];
  if (answers.channel === 'web') {
    questions.push(QUESTIONS.product);
    if (['individual', 'extra', 'api'].includes(answers.product)) questions.push(QUESTIONS.accountStatus);
  } else if (answers.channel === 'google') {
    questions.push(QUESTIONS.accountStatus, QUESTIONS.subscriptionStatus);
  }
  return questions;
}

export function chooseAnswer(answers, key, value) {
  if (answers[key] === value) return answers;
  if (key === 'channel') return { ...emptyAnswers(), channel: value };
  if (key === 'product') return { ...answers, product: value, accountStatus: null, subscriptionStatus: null };
  return { ...answers, [key]: value };
}

export function routeDetails(details, answers) {
  return { ...details,
    channel: answers.channel || 'unknown',
    product: answers.channel === 'reseller' ? 'reseller' : ['apple', 'google'].includes(answers.channel) ? 'individual' : answers.product || 'unknown',
    accountStatus: answers.accountStatus || details.accountStatus || 'unknown',
    subscriptionStatus: answers.subscriptionStatus || 'unknown',
  };
}

export function firstUnanswered(answers) {
  const questions = questionsFor(answers);
  return questions.findIndex(question => answers[question.key] === null);
}

export function caseAnswers(conditions) {
  const answers = emptyAnswers();
  // 只接受这些路径条件，账单金额、日期、用量和文案不得由案例带入。
  for (const key of Object.keys(answers)) if (conditions[key] !== undefined) answers[key] = conditions[key];
  return answers;
}
