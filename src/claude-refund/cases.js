import { SOURCES } from './refund.js';
import { PERSONAL_EMAIL_EXAMPLES, PERSONAL_EMAIL_INTRO } from './personalEmails.js';

export const REFUND_CASES = [
  {
    id: 'personal', real: true, title: '煜哥：客服找不到账单，如何继续跟进',
    conditions: { channel: 'web', product: 'extra' },
    applies: '额外用量预付额度无法核对，自动客服找不到账单或无法提供用量明细。',
    methods: [
      '2026 年 5 月 8 日支付 45 美元，收据为 “Prepaid extra usage, Individual plan”，属于预付额外用量。',
      '5 月 13 日，AI 客服回复找不到账单配置，无法退款或提供用量明细，随后关闭会话。',
      '煜哥提交发票、收据和付款凭证，要求人工核对购买、已用、剩余及到期明细，或提供书面处理结论；5 月 18 日、23 日和 25 日继续跟进。',
      '9 月 30 日，人工客服确认已处理未使用部分退款，同时收到 22.47 美元的官方退款凭证。',
    ],
    outcome: '官方已发起未使用部分退款，银行实际到账尚未核实。该个案不能用于判断其他订单的退款结果。',
    emails: PERSONAL_EMAIL_EXAMPLES, emailIntro: PERSONAL_EMAIL_INTRO,
    next: '先查清收据上的商品名称。找不到账单时，带齐凭证，明确要求人工账单复核和书面答复。',
    source: SOURCES.support,
  },
  {
    id: 'suspended', title: '官网个人订阅被封号', conditions: { channel: 'web', product: 'individual' },
    applies: '通过 Claude 官网购买 Pro / Max 个人订阅，账户显示封禁、受限或无法登录。',
    methods: ['先确认还能否进入账号。完全无法登录时，从官方帮助中心打开消息入口，选择 I can’t login。', '提供收据、注册邮箱及受限提示，分别提出核对退款资格和取消续费。'],
    next: '确认当前登录状态，再准备适合你的申请。退款资格由官方审核。', source: SOURCES.refund,
  },
  {
    id: 'apple', title: '通过 Apple 购买，想申请退款', conditions: { channel: 'apple' },
    applies: 'Apple 收据显示购买的是 Claude 个人订阅。',
    methods: ['使用付款时的 Apple 账户进入 reportaproblem.apple.com，找到 Claude 订单并申请退款。', '退款由 Apple 审核。另在 Apple 订阅设置取消续费，申请退款不会自动取消订阅。'],
    next: '准备 Apple 订单，到 Apple 官方入口申请。', source: SOURCES.refund, sourceLabel: 'Claude 对 Apple 购买的退款说明',
  },
  {
    id: 'unknown', title: '不知道这笔钱是谁收的', conditions: { channel: 'unknown' },
    applies: '看到扣款，但还不清楚买的是什么、是官网还是其他渠道收款。',
    methods: ['在邮箱中搜索 Claude、Anthropic、Apple 或 Google 的收据，查看商品名称和收款方。', '核对应用商店订阅、银行账单商户名称或原购买平台订单。信用卡、支付宝等支付方式本身不能确定退款渠道。'],
    next: '找到收据后再选择渠道，避免把申请发给错误的收款方。', source: SOURCES.refund,
  },
  {
    id: 'google', title: '通过 Google Play 付款', conditions: { channel: 'google' },
    applies: 'Google Play 收据显示购买的是 Claude 个人订阅。',
    methods: ['按 Claude 官方说明联系支持，说明订阅仍有效还是已经失效。', '提供 Google Play 付款邮箱或 GPA 订单号、付款日期及问题，请官方核对交易和退款资格。'],
    next: '先确认登录与订阅状态，再准备支持申请；另外确认 Google Play 自动续费是否取消。', source: SOURCES.refund,
  },
  {
    id: 'api', title: 'API 充值或额度有问题', conditions: { channel: 'web', product: 'api' },
    applies: '购买的是 Claude API / Console 积分，而非 Pro / Max 个人订阅。',
    methods: ['官方说明 API 已购积分不可退款。账单异常或无法核对额度时，请求人工核账和书面处理结论。', '能登录时从 Console 的 Get help 联系支持；无法登录时使用官方帮助中心。'],
    next: '准备 Console 组织与账单记录，请官方核对适用规则。', source: SOURCES.api,
  },
  {
    id: 'team', title: '公司或团队统一付款', conditions: { channel: 'web', product: 'team' },
    applies: 'Team / Enterprise 订单由组织统一购买和管理。',
    methods: ['先联系组织所有者或管理员，说明账号受限提示及影响。', '由负责付款的人核对发票、席位和计费周期，再由有支持权限的联系人申请处理。'],
    next: '向管理员提供问题说明，不把团队账单当作个人订阅申请。', source: SOURCES.support,
  },
  {
    id: 'reseller', title: '通过代购或第三方购买', conditions: { channel: 'reseller' },
    applies: '款项付给代购、卖家或第三方平台，订单不是 Anthropic 直接收款。',
    methods: ['保存订单、付款凭证和服务约定，通过原购买平台或卖家的正式售后渠道申请。', '争议按原交易平台规则处理，保留书面答复。'],
    next: '联系实际收款方，准备订单及无法使用的说明。',
  },
];
