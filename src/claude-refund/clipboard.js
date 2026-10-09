// 浏览器拒绝剪贴板时，把文本交还给用户手动复制；不宣称复制成功。
export async function copyText(text, onFallback, clipboard = globalThis.navigator?.clipboard) {
  try {
    if (!clipboard?.writeText) throw new Error('Clipboard unavailable');
    await clipboard.writeText(text);
    return true;
  } catch {
    onFallback?.();
    return false;
  }
}
