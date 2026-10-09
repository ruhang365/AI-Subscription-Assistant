// 官方规则与个人个案分开维护；纯本地分流，不判断退款资格或成功率。
export const GUIDE_PATH = '/claude-code-refund/';
export const GUIDE_URL = 'https://sub.ruhang365.cn/claude-code-refund/';
export const VERIFIED_ON = '2026-10-08';
export const SOURCES = {
  refund: 'https://support.claude.com/en/articles/12386328-request-a-refund-for-a-paid-claude-plan',
  support: 'https://support.claude.com/en/articles/9015913-how-to-get-support',
  appeals: 'https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals',
  cancel: 'https://support.claude.com/en/articles/8325617-cancel-your-pro-or-max-subscription',
  api: 'https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage',
};

export const isClaudePlatform = (name = '') => /claude|anthropic|克劳德/i.test(name);

export const PRODUCT_OPTIONS = [
  ['individual', 'Pro / Max 个人订阅'],
  ['extra', '额外用量预付额度'],
  ['api', 'API / Console 充值'],
  ['team', 'Team / Enterprise 团队账号'],
  ['reseller', '代购 / 第三方服务'],
  ['unknown', '不清楚，先查账单'],
];
export const CHANNEL_OPTIONS = [
  ['unknown', '不确定付款渠道'], ['web', '官网直接付款'],
  ['apple', 'Apple App Store'], ['google', 'Google Play'], ['reseller', '付给代购 / 第三方'],
];
export const ACCOUNT_OPTIONS = [
  ['unknown', '还没确认'], ['logged_in', '能正常登录账户'],
  ['restricted', '能登录，但显示封号 / 受限'], ['no_login', '完全无法登录'],
];
export const USAGE_OPTIONS = [
  ['unknown', '还没核对用量'], ['zero', '确认没有使用'],
  ['some', '有使用，需核对剩余部分'],
];

export function initialDetails(seed = {}) {
  return {
    product: 'individual', channel: 'unknown', accountStatus: 'unknown',
    usageStatus: 'unknown', subscriptionStatus: 'unknown',
    paymentDate: seed.date || '', amount: seed.amount || '',
    accountEmail: '', orderNumber: '', restrictionDate: '',
    description: seed.userStory || seed.issueDetails || seed.errorDescription || '',
  };
}

const BASE_MATERIALS = ['付款日期、金额和币种', '发票、收据或订单记录', '注册邮箱和实际使用情况'];
const supportLink = { label: '打开 Claude 官方帮助中心', url: 'https://support.claude.com/en/' };
const refundLink = { label: '查看官方退款说明', url: SOURCES.refund };
const lookupSteps = [
  '在邮箱或支付账单里查找 Anthropic / Claude、Apple 或 Google 的收据，确认商品名称与实际收款方。',
  '区分 Pro / Max 订阅、额外用量额度、API 充值和第三方服务；使用 Claude Code 本身不能说明购买类型。',
  '确认后回到上方选择对应类型和付款渠道，再按指引申请。',
];

export function resolveRoute(details) {
  const { product, channel, accountStatus, subscriptionStatus } = details;
  const base = { materials: BASE_MATERIALS, requestType: 'refund', links: [supportLink, refundLink] };
  if (product === 'reseller' || channel === 'reseller') {
    return { ...base, id: 'reseller', title: '先联系实际收款的代购或第三方',
      summary: '先核对订单里的卖家、商品和服务约定，再向收款方申请处理。第三方订单不能直接套用 Anthropic 退款流程。',
      links: [], steps: ['保存原订单、付款凭证、服务约定和无法使用的说明。', '通过原购买平台或卖家的正式售后渠道提交退款申请。', '若有争议，按原交易平台的售后规则继续处理，并保存书面答复。'],
      materials: [...BASE_MATERIALS, '卖家名称、订单渠道和服务约定'] };
  }
  if (['api', 'extra', 'team'].includes(product) && ['apple', 'google'].includes(channel)) {
    return { ...base, id: 'mismatch', title: '购买类型与付款渠道需要再核对',
      summary: '应用商店收据可能对应个人订阅。先确认这笔钱买的是什么，再选退款入口。',
      requestType: 'identify', steps: lookupSteps, links: [refundLink] };
  }
  if (channel === 'apple') {
    return { ...base, id: 'apple', title: '向 Apple 提交退款申请',
      summary: 'Apple 处理了这笔付款，退款由 Apple 审核。申请退款后还需要单独取消订阅，避免继续扣费。',
      links: [{ label: '打开 Apple 退款入口', url: 'https://reportaproblem.apple.com/' }, refundLink],
      steps: ['用付款时的 Apple 账户登录 reportaproblem.apple.com。', '选择“申请退款”，填写真实原因，找到 Claude 订单并提交。', '在同一页面查看审核结果；另外到 Apple 账户的订阅设置确认自动续费已取消。'],
      materials: [...BASE_MATERIALS, 'Apple 付款账户及 Claude 订单'] };
  }
  if (channel === 'google') {
    const inactive = subscriptionStatus === 'inactive';
    return { ...base, id: 'google', title: '请 Claude 支持核对 Google Play 付款',
      summary: inactive ? '订阅已经失效：提供 Google Play 付款邮箱或 GPA 订单号，让官方核对扣款及退款资格。' : '活跃订阅由 Claude 支持先核对退款资格；不清楚订阅状态时，一并提供收据和当前状态。',
      steps: [accountStatus === 'logged_in' ? '在 Claude 的 Get help 中联系支持，明确说明通过 Google Play 付款。' : '打开官方帮助中心右下角对话；无法登录时选择 I can’t login，说明通过 Google Play 付款。',
        '提供 Google Play 付款账号或收据上的 GPA 订单号、付款日期和实际问题。',
        '等待官方审核，在原会话中跟进；另在 Google Play 订阅设置确认自动续费已取消。'],
      materials: [...BASE_MATERIALS, 'Google Play 付款邮箱或 GPA 订单号', '订阅当前是否活跃'] };
  }
  if (product === 'api') {
    return { ...base, id: 'api', title: '通过 Console 支持核对 API 账单', requestType: 'billing',
      summary: '官方规则写明 API 购买的积分不可退款。账单异常、额度无法访问或记录缺失时，可请求人工核对和书面处理结论。',
      links: [{ label: '打开 Claude Console', url: 'https://platform.claude.com/' }, { label: '查看 API 付款规则', url: SOURCES.api }, supportLink],
      steps: [accountStatus === 'logged_in' ? '进入 Console，点击账户菜单中的 Get help，说明 API 账单问题。' : '从官方帮助中心联系支持，无法登录时选择 I can’t login，并说明是 API / Console 账号。',
        '请组织管理员提供对应发票、收据及购买、已用、剩余额度的记录。',
        '请求人工账单复核及书面结论；不要把个人退款个案理解为 API 积分普遍可以退款。'],
      materials: [...BASE_MATERIALS, 'Console 组织和额度记录（直接提供给官方）'] };
  }
  if (product === 'team') {
    return { ...base, id: 'team', title: '先联系组织所有者或管理员', requestType: 'billing',
      summary: '团队订单由组织统一管理，先让负责付款的人核对账单，再由有支持权限的联系人申请处理。',
      steps: ['把受限提示、发生时间和影响告知组织所有者或管理员。', '请负责付款的人核对团队订单、席位及计费周期。', '由组织所有者或有支持权限的联系人在官方 Get help 中提交账单问题，保留原会话。'],
      materials: [...BASE_MATERIALS, '组织管理员及对应团队账单'] };
  }
  if (product === 'extra') {
    return { ...base, id: 'extra', title: '请人工核对预付额度与剩余用量', requestType: 'billing',
      summary: '预付额度和 Pro / Max 月费是不同的款项。带上收据商品名称，请官方核对购买、已用和剩余部分，以及适用的处理方式。',
      steps: ['通过官方帮助中心联系支持；无法登录时选择 I can’t login。', '提交发票、收据和付款凭证，明确这是额外用量预付额度，并要求人工核对账单。', '请求用量、剩余额度、到期时间及书面处理结果；收到退款凭证后，再到原付款方式核对到账。'],
      materials: [...BASE_MATERIALS, '收据商品名称、额度和用量记录'] };
  }
  if (channel === 'unknown' || product === 'unknown') {
    return { ...base, id: 'lookup', title: '先确认购买类型和收款方', requestType: 'identify',
      summary: '先找收据，再选渠道。付款用的是信用卡、支付宝还是微信，不能单独确定向谁申请退款。',
      steps: lookupSteps, links: [refundLink] };
  }
  if (accountStatus !== 'logged_in') {
    return { ...base, id: 'no-login', title: '通过帮助中心申请账户与订阅支持',
      summary: '封号后仍可能看到受限页面；完全无法登录时，也可以从帮助中心请求取消订阅并核对退款资格。',
      steps: ['打开 Claude 官方帮助中心，点击右下角消息图标开始会话。',
        '无法登录时选择 I can’t login；说明账号受限、付款情况，并分别提出取消续费和核对退款资格。',
        '按要求核对账户和付款信息。若无法访问注册邮箱，用可用邮箱联系支持，并在邮件跟进时抄送原账号邮箱。',
        '保留原会话与书面回复，分别确认订阅取消、退款审批、退款凭证和实际到账。'],
      materials: [...BASE_MATERIALS, '封号或登录错误截图、发生日期'] };
  }
  return { ...base, id: 'web', title: '通过 Claude 官方客服检查退款资格',
    summary: '目前能正常登录：从账户菜单进入官方退款流程，填写真实情况，由官方检查是否符合退款条件。',
    steps: ['点击左下角头像或姓名 → Get help → Send us a message。', '选择 Accept → Claude Refund Request，选择真实的退款原因。', '按提示核对资格；符合条件时在支持会话中继续取消和退款，并保存处理结果。'] };
}

const valueOr = (value, placeholder) => String(value || '').trim() || `[${placeholder}]`;
export const containsChinese = (value = '') => /[\u3400-\u9fff]/u.test(value);

export function buildTemplates(details, route, purpose = 'request') {
  const billing = purpose === 'billing' || route.requestType === 'billing';
  const creditPurchase = ['api', 'extra'].includes(details.product);
  const identify = route.requestType === 'identify' && !billing;
  const product = PRODUCT_OPTIONS.find(([id]) => id === details.product)?.[1] || '待核对';
  const enProduct = { individual: 'Pro / Max subscription', extra: 'prepaid extra usage credits', api: 'API / Console credits', team: 'Team / Enterprise account', reseller: 'third-party service', unknown: '[Product shown on receipt]' }[details.product];
  const zhStatus = { logged_in: '我目前能够登录账户。', restricted: '账户目前显示封禁或受限提示。', no_login: '我目前无法登录账户。', unknown: '[请填写账户是否能登录、是否显示受限提示]' }[details.accountStatus];
  const enStatus = { logged_in: 'I can currently log in to my account.', restricted: 'My account currently shows a suspension or restriction notice.', no_login: 'I cannot currently log in to my account.', unknown: '[Describe whether you can log in and any restriction notice]' }[details.accountStatus];
  const zhUsage = { zero: '我已核对，确认没有使用这笔订单对应的服务或额度。', some: '我有使用，请核对已使用和剩余部分。', unknown: '[请核对实际使用情况；不确定时请求官方提供明细]' }[details.usageStatus];
  const enUsage = { zero: 'I have checked and confirm that I have not used the service or credits associated with this purchase.', some: 'I have used some of the service or credits. Please review the used and remaining portions.', unknown: '[Describe your actual usage, or request a usage breakdown if uncertain]' }[details.usageStatus];
  const date = valueOr(details.paymentDate, '付款日期 / Payment date');
  const amount = valueOr(details.amount, '金额及币种 / Amount and currency');
  const order = valueOr(details.orderNumber, '订单号或发票号 / Order or invoice number');
  const email = valueOr(details.accountEmail, '注册邮箱 / Account email');
  const enDate = valueOr(details.paymentDate, 'Payment date');
  const enAmount = valueOr(details.amount, 'Amount and currency');
  const enOrder = valueOr(details.orderNumber, 'Order or invoice number');
  const enEmail = valueOr(details.accountEmail, 'Account email');
  const description = String(details.description || '').trim();
  // 自由描述不做猜测式翻译；中文原文单独交还用户，英文只采用已确认的选项。
  const separateDescription = containsChinese(description) ? description : '';
  const enDescription = description && !separateDescription ? `Details (in my own words): ${description}\n\n` : '';
  const apple = route.id === 'apple';
  const zhBilling = creditPurchase ? '这笔付款、购买额度、已使用额度、剩余余额和到期时间' : '这笔付款、购买内容、计费周期和实际使用情况';
  const enBilling = creditPurchase ? 'the payment, credits purchased, credits consumed, remaining balance, and expiry date' : 'the payment, product purchased, billing period, and actual usage';
  const zhRequest = identify ? '请帮我确认这笔订单的购买类型、实际收款方及适用的售后渠道。' : billing ? `请转交人工账单支持，核对${zhBilling}。若无法提供明细，请给出具体原因及书面处理结论；并说明未使用部分是否符合退款或其他处理条件。` : '请根据这笔付款的实际情况核对退款资格，并告知处理结果。若存在自动续费，请取消后续续费并提供确认；取消续费与本次退款请分别确认。';
  const enRequest = identify ? 'Please help identify the product, actual payment recipient, and appropriate support channel for this order.' : billing ? `Please escalate this to a human billing support agent to review ${enBilling}. If a breakdown is unavailable, please explain why and provide a written determination, including whether the unused portion is eligible for a refund or another remedy.` : 'Please review the refund eligibility of this payment based on the actual circumstances and confirm the outcome. If recurring billing is active, please cancel future renewals and confirm this separately from the refund decision.';
  const recipientZh = route.id === 'apple' ? 'Apple 支持团队' : route.id === 'reseller' ? '售后团队' : route.id === 'team' ? '组织管理员 / 官方支持团队' : '官方支持团队';
  const recipientEn = route.id === 'apple' ? 'Apple Support' : route.id === 'reseller' ? 'Support Team' : route.id === 'team' ? 'Organization Administrator / Support Team' : 'Support Team';
  const zhClosing = apple ? '这份说明用于向 Apple 支持补充订单情况。请指导我核对适用的退款流程及查询申请状态；我会在 Apple 订阅设置单独管理续费，并按要求提供订单收据。' : '我会通过正式支持渠道提供发票、收据、付款凭证及相关截图。请保留本次会话并以书面回复确认处理结果。';
  const enClosing = apple ? 'Please guide me through the appropriate Apple refund process and explain how to check the request status. I will manage renewal separately in my Apple subscription settings and can provide the order receipt as needed.' : 'I can provide the invoice, receipt, payment proof, and relevant screenshots through the official support channel. Please keep this conversation open and confirm the outcome in writing.';
  const zh = `主题：${apple ? 'Claude App Store 订单支持说明' : billing ? '请求人工核对账单与额度' : identify ? '请求核对订单与售后渠道' : '账户使用问题与退款资格核对'}\n\n${recipientZh}，您好：\n\n购买类型：${product}\n付款日期：${date}\n金额及币种：${amount}\n订单或发票号：${order}\n注册邮箱：${email}\n\n${apple && details.accountStatus === 'unknown' ? '' : `${zhStatus}\n`}${details.restrictionDate ? `问题发生日期：${details.restrictionDate}\n` : ''}${zhUsage}\n\n情况说明：${valueOr(details.description, '请填写真实情况')}\n\n${apple ? '我想咨询这笔 Claude App Store 订单的处理方式，请核对退款资格。' : zhRequest}\n\n${zhClosing}\n\n谢谢。\n[姓名]`;
  const en = `Subject: ${apple ? 'Help with a Claude App Store purchase' : billing ? 'Human billing review requested' : identify ? 'Order and support channel clarification' : 'Account access issue and refund eligibility review'}\n\nHi ${recipientEn},\n\nProduct: ${enProduct}\nPayment date: ${enDate}\nAmount and currency: ${enAmount}\nOrder or invoice number: ${enOrder}\nAccount email: ${enEmail}\n\n${apple && details.accountStatus === 'unknown' ? '' : `${enStatus}\n`}${details.restrictionDate ? `Issue start date: ${details.restrictionDate}\n` : ''}${enUsage}\n\n${enDescription}${apple ? 'I would like help reviewing the refund eligibility of this Claude App Store purchase.' : enRequest}\n\n${enClosing}\n\nThank you,\n[Name]`;
  return { zh, en, separateDescription };
}
