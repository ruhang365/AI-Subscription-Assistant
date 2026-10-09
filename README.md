# 💊 AI 后悔药 (AI Subscription Assistant)

> **让订阅不再是“单行道”。打破信息差，夺回消费者的“反悔权”。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Vertex AI](https://img.shields.io/badge/AI-Vertex%20AI-blue)](https://cloud.google.com/vertex-ai)

## 🌟 项目愿景 (Vision)

在 AI 工具爆发的今天，订阅容易退订难已成为常态。复杂的取消流程、隐蔽的扣费条款、无处可寻的客服入口……这些都在通过“信息不对等”来裹挟消费者。

**AI 后悔药** 是一个开源的智能辅助工具，旨在：
- ⚔️ **打破信息差**：揭露各大平台的真实退款政策与潜规则。
- 🛡️ **实现信息对等**：赋予普通用户与大平台对话的法律与商务语言能力。
- 🤝 **互助共建**：汇聚社区力量，整理最全的“避坑指南”与“退费攻略”。

**我们希望让每一次非自愿的扣费，都有“反悔”的机会。不用在订阅这件事情上走弯路，让话语权回归用户。**

## ✨ 核心功能 (Features)

- **🤖 AI 智能诊断**：通过 Google Cloud Vertex AI 调用 Gemini 模型，分析你的遭遇（误触、忘记取消、技术故障等），自动匹配最佳退费策略。
- **📝 律师级文书生成**：一键生成符合商务礼仪且引用消费者权益条款（如欧盟 14 天冷静期、Stripe 争议规则）的英文申诉邮件。
- **🔥 热门平台直通车**：针对 **Lovart**, **Midjourney**, **OpenAI**, **Apple** 等“重灾区”平台，提供定制化的“保姆级”退费指引与典型案例库。
- **📊 胜率预测**：基于社区大数据的退款成功率评估，不打无准备之仗。

## 🛠️ 技术栈 (Tech Stack)

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **AI Engine**: Google Cloud Vertex AI
- **Icons**: Lucide React

## 🤝 如何参与共建 (Contributing)

这是一个**开源共建**项目。一个人的力量是有限的，但我们汇聚在一起，就能构建最强大的消费者权益知识库。

我们非常欢迎你通过以下方式参与：

### 1. 提交退费案例 (Case Study)
如果你成功退款了某个软件，或者发现了新的退款渠道，请提交 Issue 分享你的经验：
- **平台名称**
- **退款原因**（如：忘记取消 / 误操作 / 无法使用）
- **成功关键点**（如：在邮件里强调了xx条款 / 找了xx支付渠道申诉）
- **相关截图/文案**（脱敏后）

### 2. 补充知识库 (Knowledge Base)
如果你熟悉代码，欢迎直接完善 `src/App.jsx` 中的 `KNOWLEDGE_BASE` 数据，添加新的平台支持：

```javascript
'new_platform': {
  name: 'New Platform Name',
  policy: '该平台的退款核心逻辑...',
  refundUrl: 'https://...',
  steps: [...]
}
```

### 3. 改进 AI 提示词 (Prompt Engineering)
帮助我们优化 AI 的生成逻辑，让申诉邮件更具说服力。

## 🚀 快速开始 (Getting Started)

1. **克隆项目**
   ```bash
   git clone https://github.com/fzy2012/AI-Subscription-Assistant.git
   cd AI-Subscription-Assistant
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   本地开发可使用 Vercel Dev 或将前端代理到部署好的服务端 API。生产环境不要配置 Gemini API Key，模型调用只走 Vertex AI 服务端函数：
   ```env
   GOOGLE_CLOUD_PROJECT=your-gcp-project-id
   GOOGLE_CLOUD_LOCATION=global
   GOOGLE_GENAI_USE_VERTEXAI=True
   VERTEX_AI_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   VERTEX_AI_MODEL=gemini-2.5-flash-lite
   ```

   如果只用 `npm run dev` 启动 Vite 前端，可额外配置：
   ```env
   VITE_AI_GENERATE_ENDPOINT=https://your-domain.com/api/vertex-generate
   ```

4. **启动项目**
   ```bash
   npm run dev
   ```

## ⚠️ 免责声明 (Disclaimer)

本项目提供的所有建议、文书模板及策略仅供参考，**不构成法律建议**。退款结果取决于各平台具体政策、您的实际使用情况以及沟通时机。在使用本工具时，请确保提供的信息真实有效。

---

**Together, let's reclaim our right to unsubscribe.**
**让我们一起，夺回退订的话语权。**

## Claude / Claude Code 退款指南

### 需求与范围

`/claude-code-refund/` 面向 Claude Code、Claude Pro / Max 用户，提供按实际付款渠道查找退款或支持入口的静态攻略，以及浏览器内生成申请文案的辅助工具。重点覆盖账号停用或无法登录时的支持路径、官网订阅、Apple、Google Play、API Console、团队席位和代购等情况。

### 使用边界

- 退款、取消续费和账号申诉是不同事项；取消订阅不等于退款，账号申诉按官方要求单独提交。
- 文案只整理用户填写的事实，未填写的日期、金额、币种或使用情况应保留为待补信息，不补造理由或承诺退款结果。
- 英文申请采用已选条件和用户填写的英文说明；中文自由说明保留在中文版及检查页的独立提示中，不猜测翻译、不默默混入英文。用户需要加入自由描述时，可编辑英文稿补充。Apple 文案仅供联系 Apple 客服补充订单情况，退款门户仍是申请的主要入口。
- 生成过程在浏览器页面内完成。用户应将必要材料直接交给相应官方支持渠道，不向本站提交收据、账号凭据或支付资料。
- 页面不承诺退款资格、成功率或到账时间。各渠道付款方及适用条款不同，以官方审核结果为准。

### 来源维护

官方政策与入口最后核实日期记为 2026-10-08。更新页面说明时应重新核对官方原文，至少检查退款申请流程、无法登录时的支持入口、Apple / Google Play 付款处理、API 积分退款规则、取消订阅方式及封号申诉要求。主要来源：

- [Claude 付费计划退款说明](https://support.claude.com/en/articles/12386328-request-a-refund-for-a-paid-claude-plan)
- [Claude 如何获取支持](https://support.claude.com/en/articles/9015913-how-to-get-support)
- [取消 Pro / Max 订阅](https://support.claude.com/en/articles/8325617-cancel-your-pro-or-max-subscription)
- [停用、警告与申诉](https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals)
- [Claude API 付款与积分](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage)

### 个人案例的脱敏与维护

页面中的“煜哥的一次实际退款经历”依据已核实的个人账单和往来记录整理，仅公开付款日期、金额、收据上的产品类别、处理过程和退款凭证金额。公开案例不得附上或链接私人邮箱、组织名称、发票号、银行卡尾号、Stripe 链接或原始截图。需要补充案例时，先核对凭证实际支持的事实，并明确区分官方已发起退款与银行已到账；不得从单一个案推导封号退款成功率、因果关系或通用政策。该额外用量账单不应改写为 Pro / Max 月费，也不能被当成 API 预付积分通常不可退款规则的普遍例外。

往来邮件示例位于 `personalEmails.js`，由实际发出与收到的邮件逐段核对后节选：三段本人请求与追问、AI 客服回复和人工退款确认。仅展示脱敏原文和中文说明，省略用“…”标明，不公开私信链接、邮件标识、附件或订单信息。静态经历区与案例弹层同步展示，默认折叠；官方给出的到账预计必须标明是当时的回复，银行到账仍需单独核实。邮件示例不带入用户申请文案。

### 本地验收

从 `/claude-code-refund/` 直接打开并刷新页面，分别检查桌面 `1440 × 900` 与手机 `390 × 844` 首屏：同时看见第一问与四个案例入口，初始不展示长文案和材料表单。用关闭 JavaScript 的页面展开“完整退款路径、材料与官方来源”，确认主要路径和官方链接仍可阅读。

打开文案工具，逐项检查“双入口首屏”、一问一步、案例的“真实经历 / 情况示例”标签，以及单份申请文案的语言切换。案例弹层需支持关闭与键盘操作，关闭后原有选择保留；点击“按这种情况开始”只带入渠道条件，不带入案例中的金额、日期和用量。切换语言后确认只更新同一份文案；手动编辑后确认返回资料页且未改资料时保留编辑，修改资料后点击“更新文案”才重新生成；更换付款渠道后确认必须重新生成。再检查官网、Apple、Google Play、API、团队和其他付款渠道的对应入口、缺失信息占位及取消/退款区别，并验证复制与分享行为、分享网址不包含表单个人信息、键盘操作和首页原有退款路径。个人经历内容同时在 `cases.js` 与静态攻略中呈现，维护时须同步核对事实。

可运行的项目检查命令：

```bash
npm run build
npm run lint
npm run ai:guard
node --test src/claude-refund/*.test.mjs
```

文案测试覆盖付款渠道分流、无法登录、额度与订阅区别、缺失信息占位和文案更新。浏览器验收还需检查实际复制与分享、手机布局及原有退款路径；构建通过不能代替这些检查。
