import { useEffect, useRef, useState } from 'react';
import { REFUND_CASES } from './cases.js';

export default function CaseBrowser({ onChoose }) {
  const [showMore, setShowMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [selected]);

  function choose() {
    dialog.current.close();
    onChoose(selected.conditions);
  }

  return <section aria-labelledby="claude-cases-title" className="mt-5">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id="claude-cases-title" className="text-lg font-bold text-gray-900">看看类似情况</h2>
      <span className="text-xs text-gray-500">选一个想看的</span>
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {REFUND_CASES.slice(0, showMore ? undefined : 4).map(item => <button key={item.id} type="button"
        onClick={() => setSelected(item)} className="min-h-[100px] rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
        <span className={`mb-1.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold ${item.real ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>{item.real ? '真实经历' : '情况示例'}</span>
        <span className="block text-sm font-semibold leading-5 text-gray-800">{item.title}</span>
      </button>)}
    </div>
    <button type="button" aria-expanded={showMore} onClick={() => setShowMore(value => !value)} className="mt-2 rounded-lg px-1 py-2 text-sm text-blue-700 underline underline-offset-4">{showMore ? '收起更多情况' : '更多情况：Google Play、API、团队、代购'}</button>
    <dialog ref={dialog} onClose={() => setSelected(null)} aria-labelledby="claude-case-title"
      className="max-h-[90dvh] w-[92vw] max-w-xl overflow-y-auto rounded-2xl border border-gray-200 p-0 shadow-2xl backdrop:bg-slate-950/40"
      onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      {selected && <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`text-xs font-semibold ${selected.real ? 'text-amber-700' : 'text-gray-500'}`}>{selected.real ? '真实经历 · 额外用量账单' : '情况示例 · 按官方说明整理'}</span>
            <h2 id="claude-case-title" className="mt-2 text-xl font-bold text-gray-900">{selected.title}</h2>
          </div>
          <button type="button" autoFocus aria-label="关闭案例详情" onClick={() => dialog.current.close()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl text-gray-600">×</button>
        </div>
        <h3 className="mb-2 mt-6 text-sm font-bold">适用情况</h3>
        <p className="text-sm leading-6 text-gray-600">{selected.applies}</p>
        <h3 className="mb-2 mt-5 text-sm font-bold">{selected.real ? '处理经过' : '处理方法'}</h3>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">{selected.methods.map(method => <li key={method}>{method}</li>)}</ol>
        {selected.outcome && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900"><strong>已确认的结果：</strong>{selected.outcome}</p>}
        {selected.emails && <details className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <summary className="cursor-pointer text-sm font-bold text-amber-900">往来邮件示例：我怎么写，官方怎么回（{selected.emails.length} 段）</summary>
          <p className="mt-2 text-xs leading-5 text-gray-500">{selected.emailIntro}</p>
          <div className="mt-3 space-y-3">{selected.emails.map(email => <article key={email.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-500">{email.date} · {email.sender}</p>
            <h4 className="mt-1 text-sm font-bold text-gray-900">{email.title}</h4>
            <p className="mt-2 text-sm leading-6 text-gray-600">{email.explanation}</p>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer font-semibold text-blue-700">查看英文原文节选</summary>
              <blockquote lang="en" className="mt-3 whitespace-pre-wrap break-words border-l-2 border-blue-200 pl-3 text-sm leading-6 text-gray-700">{email.excerpt}</blockquote>
            </details>
          </article>)}</div>
        </details>}
        <h3 className="mb-2 mt-5 text-sm font-bold">下一步</h3>
        <p className="text-sm leading-6 text-gray-600">{selected.next}</p>
        {selected.source && <a href={selected.source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-blue-700 underline">{selected.sourceLabel || '相关官方说明'} ↗</a>}
        <button type="button" onClick={choose} className="mt-6 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800">按这种情况开始</button>
      </div>}
    </dialog>
  </section>;
}
