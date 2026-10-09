import { useEffect, useRef, useState } from 'react';
import CaseBrowser from './CaseBrowser.jsx';
import { copyText } from './clipboard.js';
import { caseAnswers, chooseAnswer, emptyAnswers, firstUnanswered, questionsFor, routeDetails } from './flow.js';
import { ACCOUNT_OPTIONS, GUIDE_URL, SOURCES, USAGE_OPTIONS, VERIFIED_ON, buildTemplates, containsChinese, initialDetails, resolveRoute } from './refund.js';

const fieldClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const buttonClass = 'rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500';
const linkClass = 'text-sm text-blue-700 underline underline-offset-4';

function InputField({ name, label, details, onChange, placeholder }) {
  return <div><label htmlFor={`claude-${name}`} className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
    <input id={`claude-${name}`} name={name} value={details[name]} onChange={onChange} type={name === 'accountEmail' ? 'email' : 'text'}
      autoComplete="off" maxLength={240} placeholder={placeholder} className={fieldClass} /></div>;
}

function SelectField({ name, label, value, options, onChange }) {
  return <div><label htmlFor={`claude-${name}`} className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
    <select id={`claude-${name}`} name={name} value={value} onChange={onChange} className={fieldClass}>
      {options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}
    </select></div>;
}

export default function ClaudeRefundTool({ seed = {}, embedded = false, onBack }) {
  const [details, setDetails] = useState(() => initialDetails(seed));
  const [answers, setAnswers] = useState(emptyAnswers);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [view, setView] = useState('questions');
  const [navigationVersion, setNavigationVersion] = useState(0);
  const [purpose, setPurpose] = useState('request');
  const [draft, setDraft] = useState(null);
  const [language, setLanguage] = useState('en');
  const [copyStatus, setCopyStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [shareFallback, setShareFallback] = useState(false);
  const [channelNotice, setChannelNotice] = useState(false);
  const flowRef = useRef(null);
  const headingRef = useRef(null);
  const draftRef = useRef(null);
  const interacted = useRef(false);
  const questions = questionsFor(answers);
  const question = questions[questionIndex] || questions[0];
  const currentDetails = routeDetails(details, answers);
  const route = resolveRoute(currentDetails);
  const routeKey = JSON.stringify([currentDetails.product, currentDetails.channel, currentDetails.accountStatus, currentDetails.subscriptionStatus]);
  const signature = JSON.stringify([currentDetails, purpose]);
  const draftValid = draft?.routeKey === routeKey;
  const needsRegeneration = draft && (!draftValid || draft.signature !== signature);
  const lookup = ['lookup', 'mismatch'].includes(route.id);
  const apple = route.id === 'apple';
  const officialAction = route.id === 'web' ? { label: '打开 Claude，联系支持', url: 'https://claude.ai/' }
    : route.id === 'api' && currentDetails.accountStatus !== 'logged_in' ? { label: '打开官方帮助中心', url: 'https://support.claude.com/en/' }
      : ['reseller', 'team'].includes(route.id) ? null : route.links[0];
  const draftAction = apple ? { label: '打开 Apple 支持页面', url: 'https://support.apple.com/contact' } : officialAction;

  useEffect(() => {
    if (!interacted.current) return;
    flowRef.current?.scrollIntoView({ block: 'start' });
    headingRef.current?.focus({ preventScroll: true });
  }, [view, questionIndex, navigationVersion]);

  useEffect(() => {
    function openAnchor() {
      const id = window.location.hash.slice(1);
      if (!['personal-experience', 'personal-email-examples', 'choose-path', 'sources-title', 'faq-title'].includes(id)) return;
      const target = document.getElementById(id);
      if (!target) return;
      for (let parent = target; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
      target.scrollIntoView({ block: 'start' });
    }
    openAnchor();
    window.addEventListener('hashchange', openAnchor);
    return () => window.removeEventListener('hashchange', openAnchor);
  }, []);

  function go(nextView) {
    interacted.current = true;
    setView(nextView);
    setNavigationVersion(version => version + 1);
    setCopyStatus('');
    setCopied(false);
  }

  function nextQuestion() {
    interacted.current = true;
    if (questionIndex < questions.length - 1) setQuestionIndex(index => index + 1);
    else go('route');
  }

  function editSituation() {
    setQuestionIndex(0);
    go('questions');
  }

  function useCase(conditions) {
    const next = caseAnswers(conditions);
    const unanswered = firstUnanswered(next);
    changeAnswers(next);
    setPurpose('request');
    setQuestionIndex(unanswered < 0 ? 0 : unanswered);
    go(unanswered < 0 ? 'route' : 'questions');
  }

  function changeAnswers(next) {
    if (answers.channel && next.channel !== answers.channel) {
      setChannelNotice(Object.entries(details).some(([key, value]) =>
        ['paymentDate', 'amount', 'accountEmail', 'orderNumber', 'restrictionDate', 'description'].includes(key) && value.trim()));
    }
    setAnswers(next);
  }

  function changeField(event) {
    const { name, value } = event.target;
    setDetails(previous => ({ ...previous, [name]: value }));
    setCopyStatus('');
    setCopied(false);
  }

  function generate() {
    if (!draftValid || draft.signature !== signature) setDraft({ ...buildTemplates(currentDetails, route, purpose), signature, routeKey });
    go('draft');
  }

  function changeDraft(event) {
    setDraft(previous => ({ ...previous, [language]: event.target.value }));
    setCopyStatus('');
    setCopied(false);
  }

  async function copyDraft() {
    if (!draftValid) return;
    const success = await copyText(draft[language], () => {
      draftRef.current?.focus();
      draftRef.current?.select();
    });
    if (success) {
      setCopyStatus(needsRegeneration ? '旧文案已复制，可用于保存补充内容。请更新文案后再提交。' : apple ? '客服说明已复制。需要向 Apple 客服补充订单情况时，可使用这份说明。' : '申请文案已复制。下一步，到对应渠道粘贴并提交。');
      setCopied(!needsRegeneration);
    } else {
      setCopyStatus('浏览器未能复制，已选中文案。请用复制快捷键或长按复制，再到对应渠道提交。');
      setCopied(false);
    }
  }

  async function shareGuide() {
    const success = await copyText(GUIDE_URL, () => setShareFallback(true));
    if (success) {
      setShareStatus('攻略链接已复制，不包含你的填写信息。');
    } else {
      setShareStatus('请复制下方公开攻略链接。');
    }
  }

  return <div className="text-gray-900">
    {embedded && <button type="button" onClick={onBack} className="mb-3 text-sm text-gray-600 underline underline-offset-4">返回填写平台</button>}
    <section ref={flowRef} aria-labelledby="claude-flow-title" className="scroll-mt-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 ref={headingRef} tabIndex={-1} id="claude-flow-title" className="text-lg font-bold outline-none">{view === 'questions' ? '按我的情况找路径' : view === 'route' ? '适合你的处理路径' : view === 'form' ? '准备申请信息' : '检查并复制申请'}</h2>
        {view !== 'questions' && <button type="button" onClick={editSituation} className={linkClass}>修改情况</button>}
      </div>
      {channelNotice && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">付款渠道已更换，之前填写的订单资料仍保留。请核对金额、日期、邮箱和情况说明是否属于当前这笔付款。</p>}
      {view === 'questions' && <>
        <fieldset><legend className="mb-3 text-xl font-bold">{question.title}</legend>
          <div className="grid grid-cols-2 gap-2">
            {question.options.map(([id, text]) => <label key={id} className={`relative flex min-h-11 cursor-pointer items-center rounded-xl border px-3 py-2.5 text-sm transition-colors ${answers[question.key] === id ? 'border-blue-600 bg-blue-50 font-semibold text-blue-800' : 'border-gray-200 text-gray-700 hover:border-blue-300'} focus-within:outline focus-within:outline-2 focus-within:outline-blue-600`}>
              <input type="radio" name={`claude-question-${question.key}`} value={id} checked={answers[question.key] === id}
                onChange={() => changeAnswers(chooseAnswer(answers, question.key, id))} className="sr-only" />
              <span>{text}</span>{answers[question.key] === id && <span aria-hidden="true" className="ml-auto pl-2 text-blue-700">✓</span>}
            </label>)}
          </div>
        </fieldset>
        <div className="mt-3 flex items-center justify-between gap-3">
          {questionIndex > 0 ? <button type="button" onClick={() => { interacted.current = true; setQuestionIndex(index => index - 1); }} className="rounded-lg px-2 py-2 text-sm text-gray-600">← 上一步</button> : <span className="text-xs text-gray-500">只问与你有关的问题</span>}
          <button type="button" disabled={answers[question.key] === null} onClick={nextQuestion} className={buttonClass}>继续 →</button>
        </div>
      </>}
      {view === 'route' && <>
        <h3 className="text-xl font-bold">{route.title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">{route.summary}</p>
        {draft && !draftValid && <p className="mt-3 text-sm text-amber-800">情况已改变，请重新生成申请文案。</p>}
        {lookup ? <>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600">{route.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <button type="button" onClick={editSituation} className={`${buttonClass} mt-5`}>我找到收据了，重新选择</button>
          <details className="mt-4 rounded-xl bg-gray-50 p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-blue-700">还没找到收据？查看排查办法</summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-6 text-gray-600">
              <li>换一个常用邮箱查找，也检查垃圾邮件，搜索 Claude、Anthropic、Apple、Google 或卖家名称。</li>
              <li>检查付款时使用的 Apple / Google 账户的订阅记录，或原购买平台的订单。</li>
              <li>仍找不到时，联系付款渠道客服，提供扣款日期和金额，请其协助确认收款商户。确认渠道后再回来选择，暂时不用填写退款申请。</li>
            </ul>
          </details>
        </> : <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {route.id === 'apple' && <a href={officialAction.url} target="_blank" rel="noopener noreferrer" className={buttonClass}>前往 Apple 申请退款 ↗</a>}
            <button type="button" onClick={() => go('form')} className={apple ? linkClass : buttonClass}>{apple ? '需要联系客服？准备说明' : '准备申请文案 →'}</button>
          </div>
          <details className="mt-4 rounded-xl bg-gray-50 p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-gray-700">查看操作步骤与材料</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 leading-6 text-gray-600">{route.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <p className="mt-4 font-semibold">需要准备</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-6 text-gray-600">{route.materials.map(item => <li key={item}>{item}</li>)}</ul>
          </details>
        </>}
      </>}
      {view === 'form' && <>
        <p className="mb-4 text-sm leading-6 text-gray-600">{apple ? '先到 Apple 退款门户申请；只有需要向 Apple 客服补充订单情况时，才使用这份说明。' : '可稍后补齐，留空处会保留待填提示。信息只在当前页面使用。'}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField name="accountEmail" label="注册邮箱（选填）" details={details} onChange={changeField} placeholder="用于填写申请" />
          <InputField name="paymentDate" label="付款日期（选填）" details={details} onChange={changeField} placeholder="例如：2026-10-08" />
          <InputField name="amount" label="金额及币种（选填）" details={details} onChange={changeField} placeholder="例如：45 USD" />
          <SelectField name="usageStatus" label="实际使用情况" value={details.usageStatus} options={USAGE_OPTIONS} onChange={changeField} />
        </div>
        <label htmlFor="claude-description" className="mb-1.5 mt-4 block text-sm font-semibold text-gray-700">情况说明（选填）</label>
        <textarea id="claude-description" name="description" rows={2} value={details.description} onChange={changeField} maxLength={4000} placeholder="写下实际问题及希望处理的事项" className={fieldClass} />
        {containsChinese(details.description) && <p className="mt-2 text-xs leading-5 text-gray-600">中文说明保留在中文版。英文版会根据已选情况生成，你也可以在下一步补充英文细节。</p>}
        <details className="mt-4 rounded-xl bg-gray-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700">补充订单信息 / 请求人工核账</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InputField name="orderNumber" label="订单 / 发票号（选填）" details={details} onChange={changeField} />
            <InputField name="restrictionDate" label="问题发生日期（选填）" details={details} onChange={changeField} />
            {!answers.accountStatus && <SelectField name="accountStatus" label="当前登录状态（选填）" value={details.accountStatus} options={ACCOUNT_OPTIONS} onChange={changeField} />}
            <SelectField name="purpose" label="申请内容" value={purpose} options={[
              ['request', '按当前渠道准备申请'], ['billing', '账单找不到，请求人工核对'],
            ]} onChange={event => setPurpose(event.target.value)} />
          </div>
        </details>
        {needsRegeneration && <div id="claude-regenerate-warning" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <p>点击“更新文案”会按当前资料重新生成中英文稿，覆盖之前的手动编辑。请先保存想保留的补充内容。</p>
          {draftValid && <button type="button" onClick={() => go('draft')} className="mt-1 font-semibold underline underline-offset-4">查看旧文案，先保存补充</button>}
        </div>}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go('route')} className="rounded-lg px-2 py-2 text-sm text-gray-600">← 返回处理路径</button>
          <button type="button" onClick={generate} aria-describedby={needsRegeneration ? 'claude-regenerate-warning' : undefined} className={buttonClass}>{draft ? needsRegeneration ? '更新文案 →' : '查看已有文案 →' : '生成申请文案 →'}</button>
        </div>
      </>}
      {view === 'draft' && draftValid && <>
        {needsRegeneration && <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">资料已修改，下方仍是更新前的文案。可先复制保存补充内容，再返回资料页点击“更新文案”。</p>}
        {apple && <p className="mb-3 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-800">这份说明供联系 Apple 客服时使用。退款申请先到 <a href={officialAction.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Apple 退款门户 ↗</a> 办理。</p>}
        <p className="mb-3 text-sm leading-6 text-gray-600">补齐待填位置，再检查一遍。可以直接修改文案。</p>
        <div className="mb-3 flex gap-2" role="group" aria-label="文案语言">
          {[['en', '英文'], ['zh', '中文']].map(([id, text]) => <button type="button" key={id} aria-pressed={language === id} onClick={() => { setLanguage(id); setCopyStatus(''); setCopied(false); }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${language === id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>{text}</button>)}
        </div>
        {language === 'en' && draft.separateDescription && <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
          <p>英文已整理你的所选情况；中文补充单独保留。如需加入这些细节，请在下方英文稿中补充。</p>
          <details className="mt-1"><summary className="cursor-pointer font-semibold">查看中文补充（尚未加入英文）</summary>
            <p className="mt-2 whitespace-pre-wrap break-words">{draft.separateDescription}</p></details>
        </div>}
        <label htmlFor="claude-draft" className="sr-only">{language === 'en' ? '英文申请文案' : '中文申请文案'}</label>
        <textarea ref={draftRef} id="claude-draft" rows={12} value={draft[language]} onChange={changeDraft} spellCheck={false} className={`${fieldClass} resize-y font-mono text-xs leading-6`} />
        <p className="mt-2 text-xs leading-5 text-gray-500">修改资料后需点击“更新文案”，不会自动覆盖你的编辑。复制的是当前显示的文案。</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="button" onClick={copyDraft} className={copied ? linkClass : buttonClass}>{needsRegeneration ? '复制旧文案，保存补充' : `复制${language === 'en' ? '英文' : '中文'}${apple ? '客服说明' : '申请'}`}</button>
          {draftAction && <a href={draftAction.url} target="_blank" rel="noopener noreferrer" className={copied ? buttonClass : linkClass}>{draftAction.label} ↗</a>}
        </div>
        <p role="status" className="mt-3 text-sm leading-6 text-blue-700">{copyStatus}</p>
        {!officialAction && <p className="mt-3 text-sm leading-6 text-gray-600">{route.id === 'team' ? '请将申请交给组织所有者或管理员，由有支持权限的人继续处理。' : '请在原购买平台或卖家的正式售后渠道粘贴并提交。'}</p>}
        <button type="button" onClick={() => go('form')} className="mt-3 rounded-lg py-2 text-sm text-gray-600 underline underline-offset-4">← 返回修改资料</button>
      </>}
    </section>
    <CaseBrowser onChoose={useCase} />
    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-200 pt-3">
      <button type="button" onClick={shareGuide} className={linkClass}>分享这份指南</button>
      <a href="/" className="text-sm text-gray-600 underline underline-offset-4">其他平台退款</a>
      <details className="text-xs text-gray-500"><summary className="cursor-pointer">来源与收藏</summary>
        <p className="mt-2 leading-6">规则核实：{VERIFIED_ON} · <a className={linkClass} href={SOURCES.refund} target="_blank" rel="noopener noreferrer">官方退款说明</a>。电脑可用 ⌘D / Ctrl+D 收藏，手机可在浏览器菜单添加书签。</p>
      </details>
    </div>
    {shareStatus && <p role="status" className="mt-2 text-sm text-blue-700">{shareStatus}</p>}
    {shareFallback && <input aria-label="公开攻略分享链接" readOnly value={GUIDE_URL} onFocus={event => event.target.select()} className={`${fieldClass} mt-2`} />}
  </div>;
}
