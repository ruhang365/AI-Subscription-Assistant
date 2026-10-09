// 已逐段核对往来邮件。仅保留公开节选，不存邮箱、订单号、附件或私人邮件链接。
export const PERSONAL_EMAIL_INTRO = '以下节选来自煜哥实际发出和收到的邮件，保留英文原文；中文说明依据邮件整理。“…”表示省略。邮箱、组织、订单号、私人链接和附件不公开。邮件只说明这个个案的沟通过程，不代表通用退款政策。';

export const PERSONAL_EMAIL_EXAMPLES = [
  {
    "id": "ai-reply",
    "date": "2026-05-13",
    "sender": "官方回复 · AI 客服",
    "title": "找不到账单，无法直接处理",
    "excerpt": "Unfortunately, I was unable to locate billing information for this purchase in our refund system.",
    "explanation": "AI 客服说在退款系统里找不到这笔付款的账单信息。邮件还说明，无法处理退款或确认这 45 美元是否已使用，需要进一步复核。这是当时的客服回复，并非“所有预付额度都不能退款”的结论。"
  },
  {
    "id": "human-review",
    "date": "2026-05-13",
    "sender": "我发给官方",
    "title": "明确请求人工核账和书面明细",
    "excerpt": "I understand you cannot process a refund because the billing configuration is missing, but I still need a written balance/usage statement for audit/reconciliation.\n\nRequests (please escalate to a human billing/engineering agent):\n…\n2) Provide an offline/exported balance/usage statement for this purchase, including:\n   - credits purchased and credited,\n   - whether any credits were consumed (even if you do not have real-time access),\n   - any remaining balance,\n   - expiry date and whether the credits have expired.\n\nPlease do not close this request until a written statement is provided.",
    "explanation": "我没有只重复“请退款”，而是要求转交人工账单或工程人员，列清需要核对的购买、使用、剩余和到期明细，并要求提供书面答复后再关闭请求。"
  },
  {
    "id": "follow-up",
    "date": "2026-05-18",
    "sender": "我发给官方",
    "title": "继续追问，不要关闭工单",
    "excerpt": "Please do not close this ticket. I’m still waiting for a human billing/engineering agent to provide a written balance/usage statement.",
    "explanation": "仍未得到人工核账结果时，我继续在原邮件中追问，明确自己等待的是人工提供的书面余额和用量明细。"
  },
  {
    "id": "written-outcome",
    "date": "2026-05-25",
    "sender": "我发给官方",
    "title": "区分账单问题与账号申诉，要求明确结论",
    "excerpt": "Please route this to a human Billing / Console / Product Support agent. This is not an account reinstatement request.\n\n…\n\nSpecifically, I need one of the following from a human support/billing agent:\n1. A balance/usage statement showing credits purchased, credits consumed, remaining balance, and expiry date; or\n2. A written explanation of why Anthropic cannot provide a balance/usage statement despite the invoice and receipt; or\n3. A written policy-based final determination explaining the status of these prepaid credits after account suspension.\n\nPlease do not close this ticket without a written response from a human agent.",
    "explanation": "这次我明确说明：处理的是账单和额度问题，不是在申请恢复账号。要求人工给出明细、无法提供明细的原因，或依据政策作出的书面处理结论。"
  },
  {
    "id": "refund-confirmation",
    "date": "2026-09-30",
    "sender": "官方回复 · 人工客服",
    "title": "确认已处理未使用部分退款",
    "excerpt": "I've processed a refund for the unused portion of your prepaid credits.",
    "explanation": "人工客服确认已处理未使用部分的退款，邮件另提示预计 5–10 个工作日退回原付款方式。这是当时给出的到账预计；结合 22.47 美元退款凭证，能确认官方已发起退款，银行实际到账仍未核实。"
  }
];
