import React, { useState, useEffect } from 'react';
import ClaudeRefundTool from './claude-refund/ClaudeRefundTool.jsx';
import { GUIDE_PATH, isClaudePlatform } from './claude-refund/refund.js';

// --- 图标组件定义 (Inline SVGs) ---
const IconBase = ({ children, className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    {children}
  </svg>
);

const Zap = (props) => <IconBase {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></IconBase>;
const Clock = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>;
const AlertCircle = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></IconBase>;
const HelpCircle = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></IconBase>;
const MoreHorizontal = (props) => <IconBase {...props}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></IconBase>;
const BarChart3 = (props) => <IconBase {...props}><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></IconBase>;
const FileText = (props) => <IconBase {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></IconBase>;
const Sparkles = (props) => <IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" /></IconBase>;
const ArrowRight = (props) => <IconBase {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></IconBase>;
const ChevronLeft = (props) => <IconBase {...props}><polyline points="15 18 9 12 15 6" /></IconBase>;
const RefreshCcw = (props) => <IconBase {...props}><path d="M3 2v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" /></IconBase>;
const ShieldCheck = (props) => <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></IconBase>;
const CheckCircle2 = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></IconBase>;
const MessageSquare = (props) => <IconBase {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconBase>;
const Copy = (props) => <IconBase {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></IconBase>;
const ExternalLink = (props) => <IconBase {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></IconBase>;
const Wand2 = (props) => <IconBase {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></IconBase>;
const Loader2 = (props) => <IconBase {...props} className={`${props.className || ""} animate-spin`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></IconBase>;

const Github = (props) => <IconBase {...props}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 6.97A3.37 3.37 0 0 0 8 18.13V22" /></IconBase>;

// --- 核心配置 ---
const BRAND_CONFIG = {
  logo: "/logo.png", // 正方形图标
  fullLogo: "/logo-full.png", // 长条形 Banner
  name: "AI 后悔药",
  subName: "AI Subscription Assistant",
  slogan: "入行 从这里开始",
  year: "2026",
  githubUrl: "https://github.com/fzy2012/AI-Subscription-Assistant"
};

// --- API Helpers ---
const callVertexAi = async (prompt, systemInstruction = "", responseSchema = null) => {
  const payload = {
    prompt,
    systemInstruction,
    responseSchema,
  };

  try {
    const response = await fetch(import.meta.env.VITE_AI_GENERATE_ENDPOINT || '/api/vertex-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    const text = data.text;
    return responseSchema ? JSON.parse(text) : text;
  } catch (error) {
    console.error("Vertex AI API Error:", error);
    throw error;
  }
};

// --- 知识库与场景数据 ---
const KNOWLEDGE_BASE = {
  platforms: {
    'openai': {
      name: 'OpenAI (ChatGPT)',
      policy: '先核对购买渠道，再查看 OpenAI 官方退款说明。申请时如实提供扣费和使用情况。',
      refundUrl: 'https://help.openai.com/en/articles/7232895-how-do-i-request-a-refund-for-my-chatgpt-subscription'
    },
    'midjourney': {
      name: 'Midjourney',
      policy: '在 Midjourney 账户页查看订阅和退款选项；是否符合条件以官方审核为准。',
      refundUrl: 'https://www.midjourney.com/account'
    },
    'apple': {
      name: 'Apple App Store',
      policy: '通过 Apple 购买的订单，前往 Apple 报告问题页，选择与你实际情况相符的退款原因。',
      refundUrl: 'https://reportaproblem.apple.com/'
    },
    'google': {
      name: 'Google Play',
      policy: '通过 Google Play 购买的订单，按官方退款流程查看对应时间和地区的申请方式。',
      refundUrl: 'https://support.google.com/googleplay/workflow/9813244'
    },
    'lovart': {
      name: 'Lovart',
      policy: '通过官方支持渠道说明扣费问题，并按客服回复补充材料。处理步骤和结果以实际订单为准。',
      refundUrl: null,
      steps: [
        {
          title: "发送首封邮件",
          desc: "发送英文邮件至 support@lovart.ai，说明误操作/未确认金额，要求退款。"
        },
        {
          title: "回复自动邮件",
          desc: "收到自动回复后，查看是否要求补充材料；需要时在原邮件中回复脱敏账单和真实诉求。"
        },
        {
          title: "仍未解决时",
          desc: "保留往来记录，通过原客服渠道跟进；如仍有账单争议，可向实际付款渠道咨询处理方式。"
        }
      ]
    },
    'other': {
      name: '其他平台 (SaaS通用)',
      policy: '从订单或收据确认实际收款方，查看该平台的退款条款，再通过官方客服说明情况。',
      refundUrl: null
    }
  }
};

const REFUND_SCENARIOS = {
  'accidental': {
    id: 'accidental',
    icon: <Zap className="text-amber-500" />,
    color: "bg-amber-50 border-amber-200 hover:border-amber-400",
    badge: "高频高发",
    title: '误触 / 冲动消费',
    description: '手滑点了订阅，或者原本只想试用却扣了年费。',
    emailSubject: "Refund Request - Accidental Subscription",
    defaultTemplate: (data) => `I am writing to request a refund for a subscription that was purchased by mistake on ${data.date}. 

I would like to cancel this subscription and ask you to review whether the charge of ${data.amount} is eligible for a refund.
Usage since purchase: [Please describe actual usage].`
  },
  'forgot_cancel': {
    id: 'forgot_cancel',
    icon: <Clock className="text-blue-500" />,
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    badge: "核对用量",
    title: '忘记取消续费',
    description: '忘记关闭自动续费，想核对这次扣费能否退回。',
    emailSubject: "Refund Request - Unwanted Auto-Renewal",
    defaultTemplate: (data) => `My subscription auto-renewed on ${data.date} contrary to my intent. I meant to cancel before the renewal date but missed the window.

My usage since renewal: ${data.usageStatus === 'zero' ? 'I have not used the service since renewal.' : data.usageStatus === 'low' ? 'I have used the service a little.' : data.usageStatus === 'high' ? 'I have used the service extensively.' : '[Please describe actual usage].'} Please review whether this charge is eligible for a refund.`
  },
  'technical': {
    id: 'technical',
    icon: <AlertCircle className="text-rose-500" />,
    color: "bg-rose-50 border-rose-200 hover:border-rose-400",
    badge: "需证据",
    title: '技术故障无法使用',
    description: '付了钱但功能报错、宕机或无法登录。',
    emailSubject: "Refund Request - Service Unusable / Technical Issues",
    defaultTemplate: (data) => `I am requesting a refund because the service has been unusable for me. Since subscribing on ${data.date}, I have encountered persistent technical issues: [${data.errorDescription || "Login/Generation errors"}].

As the service described was not delivered effectively, I request a full refund of ${data.amount}.`
  },
  'dissatisfied': {
    id: 'dissatisfied',
    icon: <HelpCircle className="text-purple-500" />,
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    badge: "难度较高",
    title: '效果不满意',
    description: '生成质量太差，完全不符合宣传预期。',
    emailSubject: "Refund Request - Service Not As Described",
    defaultTemplate: (data) => `I recently subscribed to your service but found the quality significantly different from what was advertised. Specifically: [${data.issueDetails || "The output quality is poor"}].

Please review the issue and let me know whether this purchase is eligible for a refund.`
  },
  'other': {
    id: 'other',
    icon: <MoreHorizontal className="text-gray-500" />,
    color: "bg-gray-50 border-gray-200 hover:border-gray-400",
    badge: "人工辅助",
    title: '其他复杂情况',
    description: '账号被封、重复扣款或其他特殊原因。',
    emailSubject: "Refund Inquiry - Billing Issue",
    defaultTemplate: (data) => `I am writing regarding a billing issue with my account (Charge date: ${data.date}, Amount: ${data.amount}).
The situation is as follows: [${data.issueDetails || "Please explain your situation here"}].

Given these circumstances, I kindly request your team to review my case and process a refund.`
  }
};

// --- Helper Functions for Logic ---
const getStrategicAdvice = (formData) => {
  const { scenario, platformType } = formData;
  let advice = "";
  if (scenario === 'technical') advice = `关键在于"证据"。请务必在申诉中附上报错截图或录屏。`;
  else if (scenario === 'accidental') advice = `说明误操作发生的时间、扣费金额和实际使用情况，并保留收据。`;
  else if (scenario === 'forgot_cancel') advice = `说明续费日期和续费后的实际用量；如果想停止后续扣费，还需要单独取消续费。`;
  else if (scenario === 'dissatisfied') advice = `具体说明实际功能与购买时介绍有哪些差异，并保留相应记录。`;
  else if (scenario === 'other') advice = `按时间顺序说明发生了什么，以及希望客服核对或处理的事项。`;
  if (platformType === 'apple') advice += ` 注意：Apple 扣费请直接去 Apple 官网申诉，别找 App 开发者。`;
  return advice;
};

// --- Components Defined Outside App ---

const Header = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 h-16">
      <div className="max-w-5xl mx-auto px-6 h-full flex justify-between items-center">
        <a href="https://ruhang365.cn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
           {/* Logo 图标 */}
           <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
             {!imgError ? (
               <img 
                 src={BRAND_CONFIG.logo} 
                 alt="Logo" 
                 className="w-full h-full object-cover" 
                 onError={() => {
                   setImgError(true);
                 }}
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                  <span className="text-xs font-bold text-white leading-none">365</span>
               </div>
             )}
           </div>
           
           {/* 应用名称 - 始终显示 */}
           <div>
             <h1 className="font-bold text-gray-900 leading-none text-lg">{BRAND_CONFIG.name}</h1>
             <p className="text-[11px] text-gray-500 font-medium tracking-wide mt-0.5">{BRAND_CONFIG.subName}</p>
           </div>
        </a>

        <div className="hidden md:flex items-center gap-2">
           <a 
             href={BRAND_CONFIG.githubUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
           >
             <Github size={14} />
             <span>Star on GitHub</span>
           </a>
           <span className="flex h-2 w-2 rounded-full bg-green-500 ml-2"></span>
           <span className="text-xs font-medium text-gray-500">Online Assistant</span>
        </div>
      </div>
    </header>
  );
};

const IntroView = ({ setStep }) => (
  <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto animate-fade-in">
    {/* Hero Section */}
    <div className="text-center mb-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[300px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none" />
      
      <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-8 leading-tight">
        误扣费？想退款？<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI 帮你“反悔”。</span>
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
        找到对应的退款入口，整理扣费情况和申请文案。
        从确认付款渠道开始，按步骤处理。
      </p>
      <button 
        onClick={() => setStep(1)}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 shadow-gray-900/20"
      >
        立即开始诊断
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      <a href={GUIDE_PATH} className="relative mx-auto mt-6 flex max-w-xl items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-left shadow-sm transition-colors hover:bg-blue-100">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 font-bold text-white" aria-hidden="true">C</span>
        <span><span className="block text-base font-bold text-gray-900">Claude Code 被封号，怎么申请退款？</span>
          <span className="mt-1 block text-sm text-gray-600">官方入口、分步指引，还有煜哥的实际退款经历</span></span>
        <ArrowRight className="ml-auto shrink-0 text-blue-700" size={20} />
      </a>
    </div>

    {/* Bento Grid Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BarChart3 size={80} className="text-blue-600" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
          <BarChart3 size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">核对申请条件</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          按购买平台和付款渠道查看申请入口，核对扣费日期、用量和所需材料。
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FileText size={80} className="text-purple-600" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
          <Wand2 size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">AI 深度润色</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          先生成申请草稿，也可用 AI 调整表达；发送前请核对每一项事实。
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={80} className="text-green-600" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
          <Zap size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">一键直达入口</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          拒绝在复杂的官网里迷路。直接提供核心退款链接，省时省心。
        </p>
      </div>
    </div>
  </div>
);

const TemplateSelectView = ({ setStep, formData, setFormData, handleSmartFill, isAiAnalyzing, handleScenarioSelect }) => (
  <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
    <button onClick={() => setStep(0)} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-gray-200">
        <ChevronLeft size={14} /> 
      </div>
      返回首页
    </button>

    {/* AI Smart Fill Section */}
    <div className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Sparkles size={120} className="text-blue-900" />
      </div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" /> 
          懒人模式：AI 智能诊断
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          用几句话描述扣费情况，AI 可帮你整理信息，识别结果需要你核对。使用 AI 识别会将这段描述发送给模型服务，请省略密码、卡号和完整订单信息。
        </p>
        <div className="flex gap-2">
          <textarea 
            value={formData.userStory}
            onChange={(e) => setFormData(prev => ({ ...prev, userStory: e.target.value }))}
            placeholder="例如：昨天我不小心点了 Midjourney 的年费订阅，扣了我 200 美元，但我一次都没用过，想退款..."
            className="flex-grow p-3 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-14"
          />
          <button 
            onClick={handleSmartFill}
            disabled={isAiAnalyzing || !formData.userStory.trim()}
            className="bg-blue-600 text-white px-6 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0 w-32 justify-center"
          >
            {isAiAnalyzing ? <Loader2 size={18} /> : "AI 识别"}
          </button>
        </div>
      </div>
    </div>

    {/* Popular Platforms Shortcut */}
    <div className="mb-8">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">🔥 热门平台直通车</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href={GUIDE_PATH} className="group flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white" aria-hidden="true">C</span>
          <span><span className="block font-bold text-gray-900">Claude / Claude Code 退款专区</span>
            <span className="mt-1 block text-xs leading-5 text-gray-600">被封号、登录不了？按付款渠道找到申请入口</span></span>
          <ArrowRight className="ml-auto shrink-0 text-blue-600" size={20} />
        </a>
        <div 
          onClick={() => {
            setFormData(prev => ({ 
              ...prev, 
              platform: 'Lovart', 
              platformType: 'lovart',
              scenario: 'other' // Lovart 走特殊流程，可默认选一个或后续逻辑覆盖
            }));
            setStep(2);
          }}
          className="group cursor-pointer flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-pink-200 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
            L
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Lovart 退款专区</h3>
            <p className="text-xs text-gray-500">针对 Lovart 复杂邮件申诉流程的定制模板</p>
          </div>
          <ArrowRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>

    <div className="mb-6">
      <div className="flex items-center gap-4 mb-3">
         <div className="h-px bg-gray-200 flex-grow"></div>
         <span className="text-xs font-bold text-gray-400 uppercase">或者手动选择场景</span>
         <div className="h-px bg-gray-200 flex-grow"></div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">发生了什么？</h2>
      <p className="text-gray-500">选择最贴切的场景，我们将为您匹配专属的退款逻辑。</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Object.values(REFUND_SCENARIOS).map((scenario) => (
        <div 
          key={scenario.id}
          onClick={() => handleScenarioSelect(scenario.id)}
          className={`group relative p-6 bg-white border rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${scenario.color}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              {scenario.icon}
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/60 text-gray-600 border border-gray-100">
              {scenario.badge}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
            {scenario.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {scenario.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const DetailsFormView = ({ setStep, formData, setFormData, handleInputChange }) => {
  const scenarioConfig = REFUND_SCENARIOS[formData.scenario];

  return (
    <div className="pt-24 pb-20 px-6 max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => setStep(1)} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-gray-200">
          <ChevronLeft size={14} /> 
        </div>
        重选原因
      </button>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-blue-600 block"></span>
            补充案件细节
          </h2>
          <p className="text-sm text-gray-500 mt-1 pl-4">补充“{scenarioConfig.title}”的实际情况</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">平台名称</label>
            <input 
              type="text" 
              name="platform" 
              value={formData.platform}
              onChange={handleInputChange}
              placeholder="例如: ChatGPT, Midjourney, Claude..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">金额</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400 font-bold">$</span>
                <input 
                  type="text" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="20.00"
                  className="w-full pl-7 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">日期</label>
              <input 
                type="text" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="YYYY-MM-DD"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">支付方式</label>
            <select 
              name="paymentMethod"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="credit_card">信用卡直接扣款 (Stripe/Direct)</option>
              <option value="apple">Apple App Store 订阅</option>
              <option value="google">Google Play 订阅</option>
              <option value="paypal">PayPal</option>
              <option value="alipay">Alipay (支付宝)</option>
              <option value="wechat">WeChat Pay (微信支付)</option>
            </select>
          </div>

          {/* 动态表单项 */}
          {(formData.scenario === 'technical' || formData.scenario === 'dissatisfied' || formData.scenario === 'other') ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  {formData.scenario === 'technical' ? '故障描述' : 
                   formData.scenario === 'dissatisfied' ? '不满之处' : '情况说明'}
                </label>
                {formData.platformType === 'lovart' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        issueDetails: "我被扣了一年的订阅费，但我本意只是想试用一个月。系统在没有明确提示金额的情况下直接免密支付扣款了。我完全没有使用过该服务。"
                      }))}
                      className="text-xs text-pink-600 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md font-bold transition-colors flex items-center gap-1 border border-pink-100"
                      title="案例1：免密支付误扣年费"
                    >
                      <Sparkles size={10} /> 误扣年费
                    </button>
                    <button 
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        issueDetails: "我忘记取消试用订阅了，导致被自动续费。但我自从续费发生后，一次都没有使用过（积分未动）。"
                      }))}
                      className="text-xs text-pink-600 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md font-bold transition-colors flex items-center gap-1 border border-pink-100"
                      title="案例2：试用期结束忘记取消"
                    >
                      <Clock size={10} /> 忘记取消
                    </button>
                    <button 
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        issueDetails: "我付款了，但是网站一直报错/生成失败，根本无法正常使用服务。我有报错截图作为证据。"
                      }))}
                      className="text-xs text-pink-600 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-md font-bold transition-colors flex items-center gap-1 border border-pink-100"
                      title="案例3：技术故障无法使用"
                    >
                      <AlertCircle size={10} /> 无法使用
                    </button>
                  </div>
                )}
              </div>
              
              {formData.platformType === 'lovart' && (
                <div className="mb-3 bg-pink-50 border border-pink-100 rounded-lg p-3 flex gap-3 items-start">
                  <div className="shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-pink-600 text-xs font-bold">!</span>
                  </div>
                  <div className="text-xs text-pink-800 leading-relaxed">
                    <span className="font-bold">Lovart 退费关键：</span>留意客服回复，按要求补充<span className="font-bold underline">账单截图</span>等材料，发送前遮去无关的支付信息。
                  </div>
                </div>
              )}

              <textarea 
                name={formData.scenario === 'technical' ? 'errorDescription' : 'issueDetails'}
                value={formData.scenario === 'technical' ? formData.errorDescription : formData.issueDetails}
                onChange={handleInputChange}
                placeholder="请用简单的英语或中文描述核心问题..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900 h-28 resize-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">用量状态 <span className="text-red-500 font-normal text-xs ml-1">(关键判定项)</span></label>
              <div className="grid grid-cols-3 gap-3">
                {['zero', 'low', 'high'].map((status) => (
                  <button 
                    key={status}
                    className={`py-3 px-2 border rounded-xl text-sm font-bold transition-all ${formData.usageStatus === status ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'}`}
                    onClick={() => setFormData({...formData, usageStatus: status})}
                  >
                    {status === 'zero' && '0 使用'}
                    {status === 'low' && '轻微使用'}
                    {status === 'high' && '大量使用'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => setStep(3)}
            disabled={!formData.platform || !formData.amount}
            className="w-full mt-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="text-yellow-400" />
            生成退费方案
          </button>
        </div>
      </div>
    </div>
  );
};

const AnalyzingView = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white fixed inset-0 z-50">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping blur-xl"></div>
      <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-gray-100">
         <RefreshCcw size={40} className="text-blue-600 animate-spin" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">正在整理申请草稿…</h2>
    <div className="flex flex-col items-center gap-2 text-sm text-gray-500 font-medium">
      <span className="animate-pulse">整理你填写的情况</span>
      <span className="animate-pulse delay-100">汇总申请前需核对的事项</span>
      <span className="animate-pulse delay-200">准备英文申请草稿</span>
    </div>
  </div>
);

const ResultView = ({ setStep, formData, aiPolishedEmail, handleEmailPolish, isAiPolishing }) => {
  const scenarioConfig = REFUND_SCENARIOS[formData.scenario];
  const defaultEmailBody = scenarioConfig.defaultTemplate(formData);
  const emailBody = aiPolishedEmail || defaultEmailBody;
  const platformInfo = KNOWLEDGE_BASE.platforms[formData.platformType];
  
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">行动方案报告</h2>
        <button onClick={() => setStep(2)} className="text-sm font-medium text-gray-500 hover:text-gray-900 underline">修改信息</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">申请前核对</h3>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li>核对扣费日期、金额和收款方。</li>
            <li>如实说明用量，保留收据或故障记录。</li>
            <li>查看对应付款渠道的退款条件。</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">退款由收款平台审核；取消续费不会自动退回已扣费用。</p>
        </div>

        {/* Advice Card */}
        <div className="md:col-span-2 bg-blue-50/50 rounded-3xl border border-blue-100 p-6 flex gap-4">
           <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
             <ShieldCheck size={20} />
           </div>
           <div>
             <h3 className="font-bold text-gray-900 mb-2">准备提示</h3>
             <p className="text-sm text-gray-700 leading-relaxed font-medium">
               {getStrategicAdvice(formData)}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Steps */}
         <div className="space-y-6">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <CheckCircle2 size={20} className="text-gray-900"/> 
             执行步骤
           </h3>
           <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              {platformInfo.steps ? (
                // Custom Steps for platforms like Lovart
                platformInfo.steps.map((step, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${index === platformInfo.steps.length - 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                           {step.desc}
                        </p>
                      </div>
                    </div>
                    {index < platformInfo.steps.length - 1 && <div className="w-px h-4 bg-gray-200 ml-4 my-1"></div>}
                  </div>
                ))
              ) : (
                // Default Standard Steps
                <>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">自助通道 (Self-Service)</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                         {formData.platformType === 'apple' 
                          ? <span>访问 <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Apple 报告问题页</a>，登录后选择与你实际情况相符的退款原因。</span>
                          : <span>登录官网 {platformInfo.refundUrl && <a href={platformInfo.refundUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">官方入口 <ExternalLink size={10} className="inline"/></a>}，查看退款条件和申请方式。取消续费与申请退款需要分别处理。</span>
                        }
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-4 bg-gray-200 ml-4"></div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">发送申诉 (Email/Chat)</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                         若自助方式无法解决，请核对右侧草稿，再通过平台官网或收据列出的客服渠道发送。
                      </p>
                    </div>
                  </div>
                </>
              )}
           </div>
         </div>

         {/* Email Copy */}
         <div className="space-y-2">
           <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-gray-900"/> 
                  申诉邮件
                </h3>
                {!aiPolishedEmail && (
                  <button 
                    onClick={handleEmailPolish}
                    disabled={isAiPolishing}
                    className="text-xs flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-md font-bold hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {isAiPolishing ? <Loader2 size={12}/> : <Wand2 size={12}/>} 
                    AI 深度润色
                  </button>
                )}
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(`Hi Support Team,\n\n${emailBody}\n\nMy account email: [Insert Email]\n\nBest regards,\n[Your Name]`); alert("已复制"); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
              >
                <Copy size={12}/> Copy All
              </button>
           </div>
           
           <div className={`bg-gray-900 rounded-2xl p-6 text-gray-300 font-mono text-xs leading-relaxed shadow-lg relative group transition-all duration-500 ${aiPolishedEmail ? 'ring-2 ring-purple-500' : ''}`}>
              <div className="absolute top-4 right-4 flex gap-2">
                {aiPolishedEmail && <span className="text-purple-400 font-sans font-bold text-[10px] border border-purple-700 px-2 py-1 rounded uppercase flex items-center gap-1"><Sparkles size={8}/> AI Polished</span>}
                <span className="text-gray-600 font-sans font-bold text-[10px] border border-gray-700 px-2 py-1 rounded uppercase">English Only</span>
              </div>

              <p className="mb-4 text-gray-400">Subject: {scenarioConfig.emailSubject}</p>
              <p>Hi Support Team,</p>
              <br/>
              <p className="whitespace-pre-wrap">{emailBody}</p>
              <br/>
              <p>My account details: [Please Insert ID]</p>
              <br/>
              <p>Best regards,</p>
              <p>[Your Name]</p>
           </div>
         </div>
      </div>
    </div>
  );
};

const App = () => {
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    scenario: '', 
    platform: '',
    platformType: 'other',
    amount: '',
    date: '',
    paymentMethod: 'credit_card',
    usageStatus: '',
    timeSinceCharge: 'within_24h',
    errorDescription: '',
    issueDetails: '',
    userStory: '' // New field for raw story
  });
  
  // AI States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [aiPolishedEmail, setAiPolishedEmail] = useState(null);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleScenarioSelect = (scenarioId) => {
    setFormData(prev => ({ ...prev, scenario: scenarioId }));
    setStep(2);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'platform') {
      const lowerVal = value.toLowerCase();
      if (isClaudePlatform(value)) setFormData(prev => ({ ...prev, platformType: 'claude' }));
      else if (lowerVal.includes('chatgpt') || lowerVal.includes('openai')) setFormData(prev => ({ ...prev, platformType: 'openai' }));
      else if (lowerVal.includes('midjourney') || lowerVal.includes('mj')) setFormData(prev => ({ ...prev, platformType: 'midjourney' }));
      else if (lowerVal.includes('apple') || lowerVal.includes('store')) setFormData(prev => ({ ...prev, platformType: 'apple' }));
      else if (lowerVal.includes('google')) setFormData(prev => ({ ...prev, platformType: 'google' }));
      else if (lowerVal.includes('lovart')) setFormData(prev => ({ ...prev, platformType: 'lovart' }));
      else setFormData(prev => ({ ...prev, platformType: 'other' }));
    }
  };

  // --- AI Feature 1: Smart Fill ---
  const handleSmartFill = async () => {
    if (!formData.userStory.trim()) return;
    // Claude 专区可直接进入本地指引，原文只留在当前页面。
    if (isClaudePlatform(formData.userStory)) {
      setFormData(prev => ({ ...prev, platform: 'Claude / Claude Code', platformType: 'claude', scenario: 'other' }));
      setStep(2);
      return;
    }
    setIsAiAnalyzing(true);

    const systemPrompt = `You are a Refund Expert. Extract data from the user's story into JSON.
    Fields:
    - platform (string)
    - amount (string, e.g., "$20")
    - date (string)
    - usageStatus (enum: "zero", "low", "high")
    - scenario (enum: "accidental", "forgot_cancel", "technical", "dissatisfied", "other")
    - issueDetails (string, summary of the problem in English)
    
    If info is missing, use empty string. Infer scenario based on context.`;

    const schema = {
      type: "OBJECT",
      properties: {
        platform: { type: "STRING" },
        amount: { type: "STRING" },
        date: { type: "STRING" },
        usageStatus: { type: "STRING", enum: ["zero", "low", "high"] },
        scenario: { type: "STRING", enum: ["accidental", "forgot_cancel", "technical", "dissatisfied", "other"] },
        issueDetails: { type: "STRING" }
      }
    };

    try {
      const result = await callVertexAi(formData.userStory, systemPrompt, schema);
      
      setFormData(prev => ({
        ...prev,
        ...result,
        userStory: formData.userStory // keep the story
      }));
      
      // Auto determine platform type
      let pType = 'other';
      const lowerPlat = (result.platform || '').toLowerCase();
      if (isClaudePlatform(result.platform)) pType = 'claude';
      else if (lowerPlat.includes('chatgpt') || lowerPlat.includes('openai')) pType = 'openai';
      else if (lowerPlat.includes('midjourney') || lowerPlat.includes('mj')) pType = 'midjourney';
      else if (lowerPlat.includes('apple')) pType = 'apple';
      else if (lowerPlat.includes('google')) pType = 'google';
      else if (lowerPlat.includes('lovart')) pType = 'lovart';
      setFormData(prev => ({ ...prev, platformType: pType }));

      // If we successfully got a scenario, move to step 2 (Details) directly, skipping manual selection
      if (pType === 'claude' || result.scenario) {
        setStep(2);
      }
    } catch (e) {
      console.error(e);
      alert("AI 分析失败，请手动填写。");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // --- AI Feature 2: Email Polish ---
  const handleEmailPolish = async () => {
    setIsAiPolishing(true);
    const scenarioConfig = REFUND_SCENARIOS[formData.scenario];
    const currentDraft = scenarioConfig.defaultTemplate(formData);
    
    const systemPrompt = `You help users write clear, factual customer support emails.
    Rewrite the following refund request email to be more professional, persuasive, and empathetic. 
    Use the user's raw story context if available to make it personalized.
    Do not invent facts, usage, refund eligibility, legal citations, or guaranteed outcomes. Preserve placeholders for unknown details.
    Return ONLY the body of the email.`;

    const userPrompt = `
    Context:
    Platform: ${formData.platform}
    Amount: ${formData.amount}
    Scenario: ${formData.scenario}
    User Raw Story: ${formData.userStory || "N/A"}
    
    Original Draft:
    ${currentDraft}
    `;
    
    try {
      const polishedText = await callVertexAi(userPrompt, systemPrompt);
      setAiPolishedEmail(polishedText);
    } catch (e) {
      console.error(e);
      alert("润色失败，请重试。");
    } finally {
      setIsAiPolishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 relative selection:bg-blue-100">
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }}>
      </div>

      <Header />

      <main className="relative z-10">
        {step === 0 && <IntroView setStep={setStep} />}
        {step === 1 && (
          <TemplateSelectView 
            setStep={setStep} 
            formData={formData} 
            setFormData={setFormData} 
            handleSmartFill={handleSmartFill} 
            isAiAnalyzing={isAiAnalyzing}
            handleScenarioSelect={handleScenarioSelect}
          />
        )}
        {step >= 2 && formData.platformType === 'claude' && (
          <div className="mx-auto max-w-5xl px-6 pb-20 pt-24 animate-fade-in">
            <ClaudeRefundTool embedded seed={formData} onBack={() => {
              setFormData(prev => ({ ...prev, platform: '', platformType: 'other' }));
              setStep(2);
            }} />
          </div>
        )}
        {step === 2 && formData.platformType !== 'claude' && (
          <DetailsFormView 
            setStep={setStep} 
            formData={formData} 
            setFormData={setFormData}
            handleInputChange={handleInputChange} 
          />
        )}
        {step === 3 && formData.platformType !== 'claude' && <AnalyzingView />}
        {step === 4 && formData.platformType !== 'claude' && (
          <ResultView 
            setStep={setStep} 
            formData={formData} 
            aiPolishedEmail={aiPolishedEmail} 
            handleEmailPolish={handleEmailPolish} 
            isAiPolishing={isAiPolishing} 
          />
        )}
      </main>

      <footer className="relative z-10 py-12 text-center border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-10">
        <div className="flex flex-col items-center gap-6">
           <a href="https://ruhang365.cn" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
             <img 
               src={BRAND_CONFIG.fullLogo} 
               alt="入行365" 
               className="h-16 md:h-20 object-contain opacity-90 hover:opacity-100 transition-all" 
               onError={(e) => {
                 if (e.target.src.endsWith(BRAND_CONFIG.fullLogo)) {
                    e.target.src = BRAND_CONFIG.logo;
                    e.target.className = "w-16 h-16 rounded-xl shadow-sm";
                 } else {
                    e.target.style.display = 'none';
                 }
               }} 
             />
           </a>
           
           <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">{BRAND_CONFIG.slogan}</p>
              <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-gray-400 mt-4">
                <a href={`${BRAND_CONFIG.githubUrl}/issues/new/choose`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <MessageSquare size={12} />
                  提交新案例
                </a>
                <span className="text-gray-300">|</span>
                <a href={BRAND_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Github size={12} />
                  参与共建
                </a>
              </div>
              <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-normal mt-2">
                © {BRAND_CONFIG.year} 入行365 · 退款结果以平台审核为准，本站内容不构成法律建议。
              </p>
              <p className="mt-3 px-4 text-[11px] leading-relaxed text-gray-500">本站使用不含申请内容的访问统计，了解页面访问和来源；表单内容不进入流量统计。</p>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
